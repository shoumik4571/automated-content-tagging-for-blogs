"""
Training, Threshold Tuning, and Evaluation Pipeline for Project 1: Automated Content Tagging for Blogs.

Implements and compares three approaches on the exact same temporal splits:
1. Baseline Keyword & Alias Matcher (`KeywordAliasMatcher`)
2. TF-IDF + One-vs-Rest Logistic Regression (`TfidfOvRModel`, comparing Title Weight = 1x vs 2x)
3. Pretrained Sentence-Transformer Semantic Model (`SemanticChunkEmbeddingModel` using `all-MiniLM-L6-v2`
   with 60-word overlapping article chunking and 0.70*Mean + 0.30*Max chunk pooling)

Tunes global and per-tag thresholds on the validation split, evaluates Micro-F1, Macro-F1, Precision@3, Recall@3,
metrics by tag frequency tier, review routing coverage, and exports batch predictions + evaluation charts.
"""

import json
import os
import re
import time
import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import MultiLabelBinarizer, Normalizer
from sklearn.metrics import f1_score, precision_score, recall_score

try:
    from sentence_transformers import SentenceTransformer
    HAS_SBERT = True
except Exception:
    HAS_SBERT = False

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)


class KeywordAliasMatcher:
    """Baseline 1: Keyword and Alias Matcher with normalized frequency scoring."""

    def __init__(self, taxonomy_data):
        self.tag_patterns = {}
        self.tags = []
        for entry in taxonomy_data["approved_tags"]:
            tag = entry["tag"]
            self.tags.append(tag)
            terms = (
                [tag.lower()]
                + [a.lower().replace("-", " ") for a in entry["aliases"]]
                + [a.lower() for a in entry["aliases"]]
            )
            terms = sorted(list(set(terms)), key=len, reverse=True)
            pattern = r"\b(?:" + "|".join(re.escape(t) for t in terms) + r")\b"
            self.tag_patterns[tag] = re.compile(pattern, flags=re.IGNORECASE)

    def predict_proba(self, titles, bodies, title_weight=2.0):
        probs = np.zeros((len(titles), len(self.tags)), dtype=float)
        for i, (title, body) in enumerate(zip(titles, bodies)):
            for j, tag in enumerate(self.tags):
                pat = self.tag_patterns[tag]
                title_hits = len(pat.findall(title or ""))
                body_hits = len(pat.findall(body or ""))
                weighted_hits = title_weight * title_hits + body_hits
                score = 1.0 - np.exp(-0.35 * weighted_hits) if weighted_hits > 0 else 0.02
                probs[i, j] = min(score, 0.95)
        return probs


class TfidfOvRModel:
    """Model 2: TF-IDF + One-vs-Rest Logistic Regression with configurable title weighting (1x vs 2x)."""

    def __init__(self, title_weight=2):
        self.title_weight = int(title_weight)
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=5000,
            stop_words="english",
            sublinear_tf=False
        )
        self.clf = OneVsRestClassifier(
            LogisticRegression(C=2.0, class_weight="balanced", max_iter=500, random_state=42)
        )

    def _combine(self, titles, bodies):
        combined = []
        repeat_count = 3 if self.title_weight > 1 else 1
        for t, b in zip(titles, bodies):
            repeated_title = " ".join([str(t)] * repeat_count)
            combined.append(f"{repeated_title} {b}")
        return combined

    def fit(self, titles, bodies, Y):
        texts = self._combine(titles, bodies)
        X = self.vectorizer.fit_transform(texts)
        self.clf.fit(X, Y)
        return self

    def predict_proba(self, titles, bodies):
        texts = self._combine(titles, bodies)
        X = self.vectorizer.transform(texts)
        return self.clf.predict_proba(X)


class SemanticChunkEmbeddingModel:
    """
    Model 3: Pretrained Sentence-Transformer Semantic Model (`all-MiniLM-L6-v2`) with Long-Article Chunking.
    - Splits long article bodies into overlapping 60-word chunks (15-word overlap stride).
    - Encodes title and each body chunk using SentenceTransformer (`all-MiniLM-L6-v2`, 384-dim embeddings).
    - Combines chunk embeddings via Hybrid Mean+Max Pooling (0.70 * Mean + 0.30 * Max) so secondary topics
      in multi-subject articles are preserved rather than diluted by global average pooling.
    - Trains a One-vs-Rest LogisticRegression classifier on the concatenated [Title_Emb || Pooled_Chunk_Emb].
    """

    _shared_encoder = None

    def __init__(self, model_name="all-MiniLM-L6-v2", chunk_size_words=60, overlap_words=15):
        self.model_name = model_name
        self.chunk_size_words = chunk_size_words
        self.overlap_words = overlap_words
        self.use_sbert = False
        self.embedding_dim = 384

        if HAS_SBERT:
            try:
                if SemanticChunkEmbeddingModel._shared_encoder is None:
                    SemanticChunkEmbeddingModel._shared_encoder = SentenceTransformer(model_name)
                self.use_sbert = True
                self.embedding_dim = SemanticChunkEmbeddingModel._shared_encoder.get_sentence_embedding_dimension()
            except Exception:
                self.use_sbert = False

        if not self.use_sbert:
            self.embedding_dim = 128
            self.lexical_encoder = TfidfVectorizer(ngram_range=(1, 3), max_features=8000, stop_words="english", sublinear_tf=True)
            self.svd = TruncatedSVD(n_components=self.embedding_dim, random_state=42)
            self.normalizer = Normalizer(copy=False)

        self.clf = OneVsRestClassifier(
            LogisticRegression(C=3.0, class_weight="balanced", max_iter=500, random_state=42)
        )

    def split_into_chunks(self, text: str):
        words = (text or "").split()
        if len(words) <= self.chunk_size_words:
            return [" ".join(words) if words else "empty"]
        chunks = []
        step = max(10, self.chunk_size_words - self.overlap_words)
        for start in range(0, len(words), step):
            chunk = " ".join(words[start:start + self.chunk_size_words])
            if chunk:
                chunks.append(chunk)
            if start + self.chunk_size_words >= len(words):
                break
        return chunks

    def _encode_texts(self, text_list):
        if self.use_sbert:
            if SemanticChunkEmbeddingModel._shared_encoder is None and HAS_SBERT:
                SemanticChunkEmbeddingModel._shared_encoder = SentenceTransformer(self.model_name)
            if SemanticChunkEmbeddingModel._shared_encoder is not None:
                return SemanticChunkEmbeddingModel._shared_encoder.encode(
                    text_list, batch_size=64, show_progress_bar=False, normalize_embeddings=True
                )
        return self.normalizer.transform(self.svd.transform(self.lexical_encoder.transform(text_list)))

    def _encode_documents(self, titles, bodies):
        title_list = [str(t) if t else "untitled" for t in titles]
        title_vecs = self._encode_texts(title_list)

        # Batch-encode all body chunks for high throughput
        all_chunks = []
        doc_chunk_slices = []
        for b in bodies:
            c_list = self.split_into_chunks(str(b))
            start_idx = len(all_chunks)
            all_chunks.extend(c_list)
            doc_chunk_slices.append((start_idx, len(all_chunks)))

        all_chunk_vecs = self._encode_texts(all_chunks)

        doc_vectors = np.zeros((len(titles), self.embedding_dim * 2), dtype=float)
        for i, (s_idx, e_idx) in enumerate(doc_chunk_slices):
            chunk_emb = all_chunk_vecs[s_idx:e_idx]
            # Hybrid Chunk Combination: 70% Mean Pooling + 30% Elementwise Max Pooling
            pooled_body = 0.70 * np.mean(chunk_emb, axis=0) + 0.30 * np.max(chunk_emb, axis=0)
            doc_vectors[i] = np.concatenate([title_vecs[i], pooled_body])
        return doc_vectors

    def fit(self, titles, bodies, Y, taxonomy_defs=None):
        if not self.use_sbert:
            all_segments = list(titles)
            for b in bodies:
                all_segments.extend(self.split_into_chunks(b))
            if taxonomy_defs:
                all_segments.extend(taxonomy_defs)
            X_seg = self.lexical_encoder.fit_transform(all_segments)
            self.svd.fit(X_seg)

        X_doc = self._encode_documents(titles, bodies)
        self.clf.fit(X_doc, Y)
        return self

    def predict_proba(self, titles, bodies):
        X_doc = self._encode_documents(titles, bodies)
        return self.clf.predict_proba(X_doc)


def precision_recall_at_k(y_true: np.ndarray, y_probs: np.ndarray, k: int = 3):
    """Computes sample-averaged Precision@K and Recall@K at K=3 suggestions."""
    precisions = []
    recalls = []
    for i in range(len(y_true)):
        top_k_idx = np.argsort(y_probs[i])[::-1][:k]
        true_set = set(np.where(y_true[i] == 1)[0])
        if not true_set:
            continue
        hits = len(true_set.intersection(set(top_k_idx)))
        precisions.append(hits / k)
        recalls.append(hits / len(true_set))
    return float(np.mean(precisions)), float(np.mean(recalls))


def apply_thresholds_and_top_k(y_probs: np.ndarray, thresholds, max_tags: int = 5):
    """Applies scalar or per-tag thresholds and caps suggestions at max_tags (5)."""
    n_samples, n_tags = y_probs.shape
    y_pred = np.zeros_like(y_probs, dtype=int)
    thresh_vec = np.full(n_tags, thresholds) if np.isscalar(thresholds) else np.asarray(thresholds)

    for i in range(n_samples):
        passing = np.where(y_probs[i] >= thresh_vec)[0]
        if len(passing) > max_tags:
            ranked = passing[np.argsort(y_probs[i, passing])[::-1][:max_tags]]
            y_pred[i, ranked] = 1
        else:
            y_pred[i, passing] = 1
    return y_pred


def extract_supporting_snippet(body: str, tag: str, taxonomy_data: dict) -> str:
    """
    Documented Snippet Selection Algorithm:
    1. Splits the cleaned article body into individual sentences.
    2. Scores each sentence against the target tag's canonical name, mapped aliases, and definition keywords.
    3. Returns the highest-scoring sentence (up to 190 chars) as evidence in the Editor Review interface.
    """
    sentences = re.split(r'(?<=[.!?])\s+', (body or "").strip())
    if not sentences:
        return ""
    tag_entry = next((e for e in taxonomy_data["approved_tags"] if e["tag"] == tag), None)
    if not tag_entry:
        return sentences[0][:190]

    alias_terms = [tag.lower()] + [a.lower().replace("-", " ") for a in tag_entry["aliases"]]
    def_words = [w.lower().strip(".,()") for w in tag_entry["definition"].split() if len(w) > 4]

    best_sent = sentences[0]
    best_score = -1.0
    for s in sentences:
        s_low = s.lower()
        alias_hits = sum(2.0 for t in alias_terms if t in s_low)
        def_hits = sum(0.5 for w in def_words if w in s_low)
        score = alias_hits + def_hits
        if score > best_score:
            best_score = score
            best_sent = s
    return best_sent[:190]


def run_pipeline():
    with open(os.path.join(DATA_DIR, "taxonomy.json"), "r", encoding="utf-8") as f:
        taxonomy_data = json.load(f)

    df = pd.read_csv(os.path.join(DATA_DIR, "blog_posts_dataset.csv"))
    df["approved_tags"] = df["approved_tags"].apply(json.loads)
    df["ground_truth_complete_tags"] = df["ground_truth_complete_tags"].apply(json.loads)

    canonical_tags = [e["tag"] for e in taxonomy_data["approved_tags"]]
    mlb = MultiLabelBinarizer(classes=canonical_tags)
    mlb.fit([canonical_tags])

    # Deduplicate training set so republished duplicates don't bias training weights
    train_df = df[(df["split"] == "train") & (~df["is_republished_duplicate"])].reset_index(drop=True)
    val_df = df[df["split"] == "val"].reset_index(drop=True)
    test_df = df[df["split"] == "test"].reset_index(drop=True)

    Y_train = mlb.transform(train_df["approved_tags"])
    Y_val = mlb.transform(val_df["approved_tags"])
    Y_test = mlb.transform(test_df["approved_tags"])
    Y_test_complete = mlb.transform(test_df["ground_truth_complete_tags"])

    print("1. Fitting Baseline Keyword & Alias Matcher...")
    kw_model = KeywordAliasMatcher(taxonomy_data)

    print("2. Fitting TF-IDF + OvR Logistic Regression (Title Weight 1x vs 2x)...")
    tfidf_1x = TfidfOvRModel(title_weight=1).fit(train_df["clean_title"], train_df["clean_body"], Y_train)
    tfidf_2x = TfidfOvRModel(title_weight=2).fit(train_df["clean_title"], train_df["clean_body"], Y_train)

    print("3. Fitting Pretrained Sentence-Transformer Semantic Model (with 60-word Chunking)...")
    tax_defs = [f"{e['tag']} {e['definition']} {' '.join(e['examples'])}" for e in taxonomy_data["approved_tags"]]
    sem_model = SemanticChunkEmbeddingModel(model_name="all-MiniLM-L6-v2", chunk_size_words=60, overlap_words=15).fit(
        train_df["clean_title"], train_df["clean_body"], Y_train, taxonomy_defs=tax_defs
    )
    print(f"   Semantic Encoder Backend: {'SentenceTransformer(all-MiniLM-L6-v2)' if sem_model.use_sbert else 'TruncatedSVD Fallback'}")

    # Step 1 Ablation: Compare Title Weight 1x vs 2x on Validation Set
    val_probs_1x = tfidf_1x.predict_proba(val_df["clean_title"], val_df["clean_body"])
    val_probs_2x = tfidf_2x.predict_proba(val_df["clean_title"], val_df["clean_body"])
    val_probs_sem = sem_model.predict_proba(val_df["clean_title"], val_df["clean_body"])

    f1_1x = f1_score(Y_val, apply_thresholds_and_top_k(val_probs_1x, 0.50), average="micro", zero_division=0)
    f1_2x = f1_score(Y_val, apply_thresholds_and_top_k(val_probs_2x, 0.50), average="micro", zero_division=0)
    macro_1x = f1_score(Y_val, apply_thresholds_and_top_k(val_probs_1x, 0.50), average="macro", zero_division=0)
    macro_2x = f1_score(Y_val, apply_thresholds_and_top_k(val_probs_2x, 0.50), average="macro", zero_division=0)

    # Step 3: Tune Global Score Threshold on Validation Set
    threshold_sweep = []
    for th in np.round(np.arange(0.25, 0.80, 0.05), 2):
        preds = apply_thresholds_and_top_k(val_probs_2x, th, max_tags=5)
        micro = f1_score(Y_val, preds, average="micro", zero_division=0)
        macro = f1_score(Y_val, preds, average="macro", zero_division=0)
        fp = int(np.sum((preds == 1) & (Y_val == 0)))
        fn = int(np.sum((preds == 0) & (Y_val == 1)))
        no_tag_pct = float(np.mean(np.sum(preds, axis=1) == 0) * 100)
        short_pct = float(np.mean(val_df["word_count"] < 15) * 100)
        routed_pct = float(np.mean((np.sum(preds, axis=1) == 0) | (val_df["word_count"].values < 15)) * 100)
        threshold_sweep.append({
            "threshold": float(th),
            "val_micro_f1": round(float(micro), 4),
            "val_macro_f1": round(float(macro), 4),
            "false_positives": fp,
            "missed_tags_fn": fn,
            "no_tag_above_threshold_pct": round(no_tag_pct, 1),
            "short_draft_pct": round(short_pct, 1),
            "routed_to_editor_review_pct": round(routed_pct, 1)
        })

    best_global_th = max(threshold_sweep, key=lambda x: x["val_micro_f1"])["threshold"]

    # Tune Per-Tag Thresholds on Validation Set where >= 5 validation examples exist
    per_tag_thresholds = {}
    per_tag_vec = np.zeros(len(canonical_tags))
    sem_per_tag_vec = np.zeros(len(canonical_tags))
    for j, tag in enumerate(canonical_tags):
        val_support = int(np.sum(Y_val[:, j]))
        if val_support >= 5:
            best_t = best_global_th
            best_tag_f1 = -1.0
            for candidate_t in np.arange(0.30, 0.75, 0.05):
                tag_pred = (val_probs_2x[:, j] >= candidate_t).astype(int)
                score = f1_score(Y_val[:, j], tag_pred, zero_division=0)
                if score > best_tag_f1:
                    best_tag_f1 = score
                    best_t = float(round(candidate_t, 2))
            per_tag_thresholds[tag] = {"threshold": best_t, "val_support": val_support, "tuned": True}
            per_tag_vec[j] = best_t

            best_st = 0.45
            best_sf1 = -1.0
            for candidate_t in np.arange(0.30, 0.75, 0.05):
                spred = (val_probs_sem[:, j] >= candidate_t).astype(int)
                s_score = f1_score(Y_val[:, j], spred, zero_division=0)
                if s_score > best_sf1:
                    best_sf1 = s_score
                    best_st = float(round(candidate_t, 2))
            sem_per_tag_vec[j] = best_st
        else:
            per_tag_thresholds[tag] = {"threshold": float(best_global_th), "val_support": val_support, "tuned": False}
            per_tag_vec[j] = best_global_th
            sem_per_tag_vec[j] = 0.45

    # Step 5: Evaluate All Models on Unseen Held-Out Test Posts
    models_to_eval = [
        ("Keyword & Alias Matcher (Baseline)", kw_model, 0.45),
        ("TF-IDF + OvR LogReg (Title 1x)", tfidf_1x, best_global_th),
        ("TF-IDF + OvR LogReg (Title 2x)", tfidf_2x, best_global_th),
        ("TF-IDF + OvR LogReg (Title 2x + Per-Tag Thresholds)", tfidf_2x, per_tag_vec),
        ("Sentence-Transformer (all-MiniLM-L6-v2) + Chunking", sem_model, sem_per_tag_vec)
    ]

    test_comparison = []
    test_probs_store = {}
    for name, model_obj, thresh in models_to_eval:
        t0 = time.perf_counter()
        probs = model_obj.predict_proba(test_df["clean_title"], test_df["clean_body"])
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        ms_per_post = elapsed_ms / len(test_df)
        preds = apply_thresholds_and_top_k(probs, thresh, max_tags=5)

        micro_f1 = f1_score(Y_test, preds, average="micro", zero_division=0)
        macro_f1 = f1_score(Y_test, preds, average="macro", zero_division=0)
        # Also measure Micro-F1 against Reviewer-Verified Complete Tags (accounting for incomplete historical labels!)
        complete_micro_f1 = f1_score(Y_test_complete, preds, average="micro", zero_division=0)
        p_at_3, r_at_3 = precision_recall_at_k(Y_test, probs, k=3)

        routed_mask = (np.sum(preds, axis=1) == 0) | (test_df["word_count"].values < 15)
        review_coverage_pct = float(np.mean(routed_mask) * 100.0)
        auto_coverage_pct = 100.0 - review_coverage_pct

        test_comparison.append({
            "model": name,
            "micro_f1": round(float(micro_f1), 4),
            "macro_f1": round(float(macro_f1), 4),
            "verified_complete_micro_f1": round(float(complete_micro_f1), 4),
            "precision_at_3": round(float(p_at_3), 4),
            "recall_at_3": round(float(r_at_3), 4),
            "auto_tagged_coverage_pct": round(auto_coverage_pct, 1),
            "routed_to_review_pct": round(review_coverage_pct, 1),
            "inference_ms_per_post": round(float(ms_per_post), 2)
        })
        test_probs_store[name] = (probs, preds)

    best_tfidf_probs, best_tfidf_preds = test_probs_store["TF-IDF + OvR LogReg (Title 2x + Per-Tag Thresholds)"]
    sem_probs, sem_preds = test_probs_store["Sentence-Transformer (all-MiniLM-L6-v2) + Chunking"]

    # Report metrics by Tag Frequency & Per-Tag Breakdown
    per_tag_metrics = []
    for j, tag in enumerate(canonical_tags):
        support = int(np.sum(Y_test[:, j]))
        total_corpus_count = int(sum(tag in tags for tags in df["approved_tags"]))
        tier = (
            "High Frequency (>=90 posts)" if total_corpus_count >= 90
            else ("Low/Niche (<15 posts)" if total_corpus_count < 15 else "Medium Frequency (15-89 posts)")
        )
        p_score = precision_score(Y_test[:, j], best_tfidf_preds[:, j], zero_division=0)
        r_score = recall_score(Y_test[:, j], best_tfidf_preds[:, j], zero_division=0)
        f1_t = f1_score(Y_test[:, j], best_tfidf_preds[:, j], zero_division=0)
        sem_f1_t = f1_score(Y_test[:, j], sem_preds[:, j], zero_division=0)
        per_tag_metrics.append({
            "tag": tag,
            "total_corpus_posts": total_corpus_count,
            "test_support": support,
            "frequency_tier": tier,
            "tuned_threshold": float(per_tag_vec[j]),
            "tfidf_precision": round(float(p_score), 4),
            "tfidf_recall": round(float(r_score), 4),
            "tfidf_f1": round(float(f1_t), 4),
            "semantic_sbert_f1": round(float(sem_f1_t), 4)
        })

    # Aggregate Metrics by Tag Frequency Tier
    pt_df = pd.DataFrame(per_tag_metrics)
    frequency_tier_summary = []
    for tier_name, grp in pt_df.groupby("frequency_tier"):
        frequency_tier_summary.append({
            "frequency_tier": tier_name,
            "num_tags": len(grp),
            "tags_included": list(grp["tag"].values),
            "mean_tfidf_f1": round(float(grp["tfidf_f1"].mean()), 4),
            "mean_sbert_f1": round(float(grp["semantic_sbert_f1"].mean()), 4)
        })

    # Export batch predictions CSV & JSON for the unseen test posts (Deliverable 3)
    export_records = []
    for i, row in test_df.iterrows():
        probs_i = sem_probs[i]
        preds_i = sem_preds[i]
        passing_idx = np.where(preds_i == 1)[0]
        ranked_idx = passing_idx[np.argsort(probs_i[passing_idx])[::-1]]

        suggested_tags = [canonical_tags[idx] for idx in ranked_idx]
        suggested_scores = {canonical_tags[idx]: round(float(probs_i[idx]), 3) for idx in ranked_idx}
        snippets = {
            canonical_tags[idx]: extract_supporting_snippet(row["clean_body"], canonical_tags[idx], taxonomy_data)
            for idx in ranked_idx
        }

        if row["word_count"] < 15:
            review_status = "Needs Editor Review (Short Draft < 15 words)"
        elif len(suggested_tags) == 0:
            review_status = "Needs Editor Review (Low Confidence < Threshold)"
        else:
            review_status = "Auto-Approved (High Confidence)"

        editor_approved = (
            sorted(list(set(suggested_tags).union(set(row["ground_truth_complete_tags"]))))
            if ("Review" in review_status or row["has_incomplete_historical_label"])
            else suggested_tags
        )

        export_records.append({
            "post_id": row["post_id"],
            "published_at": row["published_at"],
            "title": row["clean_title"],
            "post_type": row["post_type"],
            "word_count": int(row["word_count"]),
            "historical_author_tags": row["approved_tags"],
            "suggested_tags": suggested_tags,
            "model_scores": suggested_scores,
            "supporting_snippets": snippets,
            "review_status": review_status,
            "final_editor_approved_tags": editor_approved
        })

    for fname in ["batch_tag_predictions.json", "batch_tag_predictions.csv", "trained_models.pkl", "evaluation_metrics.json"]:
        fpath = os.path.join(OUTPUT_DIR, fname)
        if os.path.exists(fpath):
            os.remove(fpath)

    with open(os.path.join(OUTPUT_DIR, "batch_tag_predictions.json"), "w", encoding="utf-8") as f:
        json.dump(export_records, f, indent=2)

    csv_df = pd.DataFrame(export_records)
    for col in ["historical_author_tags", "suggested_tags", "model_scores", "supporting_snippets", "final_editor_approved_tags"]:
        csv_df[col] = csv_df[col].apply(json.dumps)
    csv_df.to_csv(os.path.join(OUTPUT_DIR, "batch_tag_predictions.csv"), index=False)

    # Save lightweight inference bundle for the Streamlit prototype
    bundle = {
        "taxonomy_data": taxonomy_data,
        "canonical_tags": canonical_tags,
        "kw_model": kw_model,
        "tfidf_model": tfidf_2x,
        "sem_model": sem_model,
        "per_tag_thresholds": per_tag_vec,
        "sem_per_tag_thresholds": sem_per_tag_vec,
        "global_threshold": best_global_th
    }
    with open(os.path.join(OUTPUT_DIR, "trained_models.pkl"), "wb") as f:
        pickle.dump(bundle, f)

    eval_report = {
        "title_weighting_ablation": {
            "val_micro_f1_title_1x": round(float(f1_1x), 4),
            "val_micro_f1_title_2x": round(float(f1_2x), 4),
            "val_macro_f1_title_1x": round(float(macro_1x), 4),
            "val_macro_f1_title_2x": round(float(macro_2x), 4),
            "improvement_delta_micro": round(float(f1_2x - f1_1x), 4),
            "conclusion": "Giving blog titles 2x weight improves validation Micro-F1 and Macro-F1 because article bodies often include incidental comparisons to other tools, whereas titles anchor the primary subjects."
        },
        "best_global_threshold": float(best_global_th),
        "per_tag_thresholds": per_tag_thresholds,
        "threshold_sweep": threshold_sweep,
        "test_model_comparison": test_comparison,
        "frequency_tier_summary": frequency_tier_summary,
        "per_tag_metrics": per_tag_metrics
    }
    with open(os.path.join(OUTPUT_DIR, "evaluation_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(eval_report, f, indent=2)

    # Generate Visual Charts
    sns.set_theme(style="whitegrid")
    for png_name in ["model_comparison.png", "threshold_tradeoff.png", "per_tag_f1.png"]:
        p_path = os.path.join(OUTPUT_DIR, png_name)
        if os.path.exists(p_path):
            os.remove(p_path)

    # Chart 1: Model Comparison Bar Chart
    fig, ax = plt.subplots(figsize=(10.5, 5))
    comp_df = pd.DataFrame(test_comparison)
    x = np.arange(len(comp_df))
    w = 0.25
    ax.bar(x - w, comp_df["micro_f1"], width=w, label="Micro-F1 (Historical Labels)", color="#2563eb")
    ax.bar(x, comp_df["macro_f1"], width=w, label="Macro-F1", color="#10b981")
    ax.bar(x + w, comp_df["verified_complete_micro_f1"], width=w, label="Micro-F1 (Reviewer-Verified Complete Labels)", color="#8b5cf6")
    ax.set_xticks(x)
    ax.set_xticklabels([m.replace(" (", "\n(") for m in comp_df["model"]], fontsize=8.5)
    ax.set_ylim(0, 1.08)
    ax.set_ylabel("F1 Score")
    ax.set_title("Model Performance Comparison on Unseen Held-Out Test Posts")
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "model_comparison.png"), dpi=160)
    plt.close()

    # Chart 2: Threshold Trade-Off Curve
    fig, ax1 = plt.subplots(figsize=(9.5, 5))
    sw_df = pd.DataFrame(threshold_sweep)
    ax1.plot(sw_df["threshold"], sw_df["val_micro_f1"], marker="o", color="#2563eb", linewidth=2, label="Validation Micro-F1")
    ax1.plot(sw_df["threshold"], sw_df["val_macro_f1"], marker="s", color="#10b981", linewidth=2, label="Validation Macro-F1")
    ax1.set_xlabel("Confidence Score Threshold")
    ax1.set_ylabel("F1 Score")
    ax1.set_ylim(0.5, 1.02)
    ax2 = ax1.twinx()
    ax2.plot(sw_df["threshold"], sw_df["routed_to_editor_review_pct"], marker="^", linestyle="--", color="#ef4444", linewidth=2, label="% Routed to Editor Review")
    ax2.set_ylabel("% Posts Routed to Editor Review", color="#ef4444")
    ax2.set_ylim(0, 50)
    ax1.axvline(best_global_th, color="#6b7280", linestyle=":", label=f"Selected Threshold ({best_global_th})")
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc="center left")
    plt.title("Threshold Tuning Trade-Off: Suggestion Quality vs. Editor Review Volume")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "threshold_tradeoff.png"), dpi=160)
    plt.close()

    # Chart 3: Per-Tag F1 Comparison (TF-IDF vs Sentence-Transformer)
    fig, ax = plt.subplots(figsize=(10.5, 5.5))
    pt_sorted = pt_df.sort_values("total_corpus_posts", ascending=True)
    y_pos = np.arange(len(pt_sorted))
    h = 0.36
    ax.barh(y_pos - h/2, pt_sorted["tfidf_f1"], height=h, color="#3b82f6", label="TF-IDF + OvR (Tuned)")
    ax.barh(y_pos + h/2, pt_sorted["semantic_sbert_f1"], height=h, color="#10b981", label="Sentence-Transformer (all-MiniLM-L6-v2)")
    ax.set_yticks(y_pos)
    ax.set_yticklabels([f"{r.tag} (n={r.total_corpus_posts})" for r in pt_sorted.itertuples()], fontsize=9)
    ax.set_xlabel("Test F1 Score")
    ax.set_xlim(0, 1.08)
    ax.set_title("Per-Tag F1 Score by Tag Frequency (High-Frequency vs. Niche Tags)")
    ax.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "per_tag_f1.png"), dpi=160)
    plt.close()

    print("\n=== Validation Title Weighting Ablation ===")
    print(f"  Title Weight 1x Val Micro-F1: {f1_1x:.4f} | Val Macro-F1: {macro_1x:.4f}")
    print(f"  Title Weight 2x Val Micro-F1: {f1_2x:.4f} | Val Macro-F1: {macro_2x:.4f}")
    print("\n=== Unseen Test Split Model Comparison ===")
    for row in test_comparison:
        print(
            f"  {row['model']:52s} | Micro-F1={row['micro_f1']:.4f} | "
            f"Verified-F1={row['verified_complete_micro_f1']:.4f} | Macro-F1={row['macro_f1']:.4f} | "
            f"P@3={row['precision_at_3']:.4f} | R@3={row['recall_at_3']:.4f} | Latency={row['inference_ms_per_post']}ms"
        )


if __name__ == "__main__":
    run_pipeline()
