"""
FastAPI Backend for Project 1: Automated Content Tagging for Blogs.
Exposes live predictions (Sentence-Transformer all-MiniLM-L6-v2, TF-IDF 2x Title, and Keyword Matcher),
batch review queue, taxonomy, reviewer audit, evaluation metrics, and editorial feedback saving.
"""

import json
import os
import pickle
import sys
from datetime import datetime
from typing import List, Optional
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SRC_DIR)
sys.path.insert(0, SRC_DIR)

from prepare_data import clean_article_text
from train_and_evaluate import (
    KeywordAliasMatcher,
    TfidfOvRModel,
    SemanticChunkEmbeddingModel,
    extract_supporting_snippet,
)

DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
FEEDBACK_PATH = os.path.join(OUTPUT_DIR, "editor_feedback_log.json")


class _ModelUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name in ("KeywordAliasMatcher", "TfidfOvRModel", "SemanticChunkEmbeddingModel"):
            return {
                "KeywordAliasMatcher": KeywordAliasMatcher,
                "TfidfOvRModel": TfidfOvRModel,
                "SemanticChunkEmbeddingModel": SemanticChunkEmbeddingModel,
            }[name]
        return super().find_class(module, name)


with open(os.path.join(OUTPUT_DIR, "trained_models.pkl"), "rb") as f:
    BUNDLE = _ModelUnpickler(f).load()

TAXONOMY_DATA = BUNDLE["taxonomy_data"]
CANONICAL_TAGS = BUNDLE["canonical_tags"]

with open(os.path.join(DATA_DIR, "dataset_summary.json"), "r", encoding="utf-8") as f:
    DATASET_SUMMARY = json.load(f)

with open(os.path.join(OUTPUT_DIR, "evaluation_metrics.json"), "r", encoding="utf-8") as f:
    EVAL_METRICS = json.load(f)

with open(os.path.join(OUTPUT_DIR, "batch_tag_predictions.json"), "r", encoding="utf-8") as f:
    BATCH_PREDS = json.load(f)

REV_DF = pd.read_csv(os.path.join(DATA_DIR, "held_out_reviewer_sample.csv"))

app = FastAPI(title="TagFlow AI — Automated Content Tagging API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    title: str
    body: str
    model_engine: str = "sbert"  # "sbert" | "tfidf" | "keyword"
    use_per_tag_thresholds: bool = True
    global_threshold: float = 0.55
    max_suggestions: int = 5
    min_words: int = 15


class FeedbackRequest(BaseModel):
    post_id: Optional[str] = None
    title: str
    word_count: int
    model_used: str
    suggested_tags: List[str]
    final_editor_approved_tags: List[str]
    flagged_for_review: bool
    editor_notes: str = ""


@app.get("/api/state")
def get_state():
    feedback_list = []
    if os.path.exists(FEEDBACK_PATH):
        try:
            with open(FEEDBACK_PATH, "r", encoding="utf-8") as f:
                feedback_list = json.load(f)
        except Exception:
            feedback_list = []

    return {
        "taxonomy": TAXONOMY_DATA,
        "canonical_tags": CANONICAL_TAGS,
        "dataset_summary": DATASET_SUMMARY,
        "evaluation_metrics": EVAL_METRICS,
        "batch_predictions": BATCH_PREDS,
        "reviewer_sample": REV_DF.to_dict(orient="records"),
        "feedback_log": feedback_list,
    }


@app.post("/api/predict")
def predict_tags(req: PredictRequest):
    clean_t = (req.title or "").strip()
    clean_b = clean_article_text(req.body or "")
    raw_chars = len(req.body or "")
    clean_chars = len(clean_b or "")
    removed_chars = max(0, raw_chars - clean_chars)
    word_count = len((clean_t + " " + clean_b).split()) if (clean_t or clean_b) else 0
    chunks = BUNDLE["sem_model"].split_into_chunks(clean_b) if clean_b else []

    probs_sbert = BUNDLE["sem_model"].predict_proba([clean_t], [clean_b])[0]
    probs_tfidf = BUNDLE["tfidf_model"].predict_proba([clean_t], [clean_b])[0]
    probs_kw = BUNDLE["kw_model"].predict_proba([clean_t], [clean_b])[0]

    if req.model_engine == "sbert":
        probs = probs_sbert
        thresh_vec = (
            BUNDLE.get("sem_per_tag_thresholds", BUNDLE["per_tag_thresholds"])
            if req.use_per_tag_thresholds
            else np.full(len(CANONICAL_TAGS), req.global_threshold)
        )
    elif req.model_engine == "tfidf":
        probs = probs_tfidf
        thresh_vec = (
            BUNDLE["per_tag_thresholds"]
            if req.use_per_tag_thresholds
            else np.full(len(CANONICAL_TAGS), req.global_threshold)
        )
    else:
        probs = probs_kw
        thresh_vec = np.full(len(CANONICAL_TAGS), 0.45 if req.use_per_tag_thresholds else req.global_threshold)

    passing_idx = np.where(probs >= thresh_vec)[0]
    ranked_idx = passing_idx[np.argsort(probs[passing_idx])[::-1][: req.max_suggestions]]
    suggested_tags = [CANONICAL_TAGS[i] for i in ranked_idx] if word_count >= req.min_words else []

    if word_count < req.min_words:
        review_status = f"Needs Editor Review (Short Draft: {word_count} words < {req.min_words} min)"
        flagged = True
    elif len(suggested_tags) == 0:
        review_status = "Needs Editor Review (No tag met confidence threshold)"
        flagged = True
    else:
        review_status = "Auto-Approved (High Confidence)"
        flagged = False

    top5_indices = np.argsort(probs)[::-1][:5]
    top_candidates = []
    for rank, idx in enumerate(top5_indices, 1):
        tag_name = CANONICAL_TAGS[idx]
        score = float(probs[idx])
        th_val = float(thresh_vec[idx])
        passed = (score >= th_val) and (word_count >= req.min_words) and (tag_name in suggested_tags)
        snippet = extract_supporting_snippet(clean_b, tag_name, TAXONOMY_DATA)
        top_candidates.append({
            "rank": rank,
            "tag": tag_name,
            "score": round(score, 4),
            "threshold": round(th_val, 2),
            "passed": bool(passed),
            "snippet": snippet or "Matched primarily via title terms.",
            "sbert_score": round(float(probs_sbert[idx]), 4),
            "tfidf_score": round(float(probs_tfidf[idx]), 4),
            "kw_score": round(float(probs_kw[idx]), 4),
        })

    return {
        "clean_title": clean_t,
        "clean_body": clean_b,
        "word_count": word_count,
        "removed_boilerplate_chars": removed_chars,
        "chunks": chunks,
        "suggested_tags": suggested_tags,
        "review_status": review_status,
        "flagged_for_review": flagged,
        "top_candidates": top_candidates,
    }


@app.post("/api/feedback")
def save_feedback(req: FeedbackRequest):
    accepted = [t for t in req.suggested_tags if t in req.final_editor_approved_tags]
    rejected = [t for t in req.suggested_tags if t not in req.final_editor_approved_tags]
    added = [t for t in req.final_editor_approved_tags if t not in req.suggested_tags]

    record = {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "post_id": req.post_id or f"DRAFT-{int(datetime.now().timestamp())}",
        "title": req.title,
        "word_count": req.word_count,
        "model_used": req.model_used,
        "suggested_tags": req.suggested_tags,
        "accepted_tags": accepted,
        "rejected_tags": rejected,
        "added_missing_tags": added,
        "final_editor_approved_tags": req.final_editor_approved_tags,
        "flagged_for_review": req.flagged_for_review,
        "editor_notes": req.editor_notes,
    }
    existing = []
    if os.path.exists(FEEDBACK_PATH):
        try:
            with open(FEEDBACK_PATH, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = []
    existing.insert(0, record)
    with open(FEEDBACK_PATH, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)

    # If a batch post_id was updated, also update it in memory
    if req.post_id:
        for item in BATCH_PREDS:
            if item["post_id"] == req.post_id:
                item["final_editor_approved_tags"] = req.final_editor_approved_tags
                item["review_status"] = "Editor Reviewed & Approved"

    return {"status": "ok", "record": record, "feedback_log": existing}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
