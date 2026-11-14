"""
Interactive Editor-Facing Studio for Project 1: Automated Content Tagging for Blogs.
Run with:
    streamlit run app.py
"""

import json
import os
import re
import sys
import pickle
from datetime import datetime
import numpy as np
import pandas as pd
import streamlit as st

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, "src"))

from prepare_data import clean_article_text
from train_and_evaluate import (
    KeywordAliasMatcher,
    TfidfOvRModel,
    SemanticChunkEmbeddingModel,
    extract_supporting_snippet,
)

# Register model classes on __main__ so pickle.load works seamlessly under Streamlit
main_mod = sys.modules.get("__main__")
if main_mod is not None:
    setattr(main_mod, "KeywordAliasMatcher", KeywordAliasMatcher)
    setattr(main_mod, "TfidfOvRModel", TfidfOvRModel)
    setattr(main_mod, "SemanticChunkEmbeddingModel", SemanticChunkEmbeddingModel)

DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
FEEDBACK_PATH = os.path.join(OUTPUT_DIR, "editor_feedback_log.json")

st.set_page_config(
    page_title="TagFlow AI — Editorial Content Tagging Studio",
    page_icon="🏷️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Modern SaaS Styling
st.markdown(
    """
    <style>
    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 2.5rem;
        max-width: 1380px;
    }
    .hero-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
        border-radius: 16px;
        padding: 24px 30px;
        color: #ffffff;
        margin-bottom: 20px;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.35);
        border: 1px solid rgba(255,255,255,0.12);
    }
    .hero-title {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
    }
    .hero-sub {
        font-size: 0.96rem;
        color: #cbd5e1;
        margin: 0;
        line-height: 1.5;
    }
    .kpi-card {
        background: rgba(30, 41, 59, 0.65);
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 12px;
    }
    .kpi-label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #94a3b8;
        font-weight: 600;
    }
    .kpi-value {
        font-size: 1.55rem;
        font-weight: 800;
        color: #f8fafc;
        margin-top: 2px;
    }
    .kpi-sub {
        font-size: 0.76rem;
        color: #38bdf8;
        margin-top: 2px;
    }
    .tag-card {
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-left: 5px solid #10b981;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 11px;
    }
    .tag-card-muted {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid rgba(148, 163, 184, 0.14);
        border-left: 5px solid #64748b;
        border-radius: 12px;
        padding: 12px 16px;
        margin-bottom: 10px;
        opacity: 0.85;
    }
    .tag-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }
    .tag-pill {
        display: inline-block;
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.4);
        border-radius: 999px;
        padding: 3px 12px;
        font-size: 0.88rem;
        font-weight: 700;
    }
    .score-badge {
        font-family: monospace;
        font-size: 0.85rem;
        padding: 2px 9px;
        border-radius: 6px;
        background: rgba(16, 185, 129, 0.18);
        color: #34d399;
        font-weight: 700;
    }
    .score-badge-low {
        font-family: monospace;
        font-size: 0.83rem;
        padding: 2px 9px;
        border-radius: 6px;
        background: rgba(100, 116, 139, 0.25);
        color: #cbd5e1;
    }
    .progress-track {
        width: 100%;
        height: 7px;
        background: rgba(51, 65, 85, 0.7);
        border-radius: 99px;
        overflow: hidden;
        margin: 6px 0 8px 0;
    }
    .snippet-box {
        font-size: 0.84rem;
        color: #cbd5e1;
        background: rgba(30, 41, 59, 0.65);
        padding: 8px 11px;
        border-radius: 8px;
        border-left: 3px solid #38bdf8;
        margin-top: 4px;
    }
    .status-banner-ok {
        background: rgba(16, 185, 129, 0.14);
        border: 1px solid rgba(16, 185, 129, 0.45);
        color: #6ee7b7;
        padding: 12px 16px;
        border-radius: 10px;
        font-weight: 600;
        margin-bottom: 14px;
    }
    .status-banner-warn {
        background: rgba(245, 158, 11, 0.16);
        border: 1px solid rgba(245, 158, 11, 0.5);
        color: #fcd34d;
        padding: 12px 16px;
        border-radius: 10px;
        font-weight: 600;
        margin-bottom: 14px;
    }
    </style>
    """,
    unsafe_allow_html=True
)


class _ModelUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name in ("KeywordAliasMatcher", "TfidfOvRModel", "SemanticChunkEmbeddingModel"):
            return {
                "KeywordAliasMatcher": KeywordAliasMatcher,
                "TfidfOvRModel": TfidfOvRModel,
                "SemanticChunkEmbeddingModel": SemanticChunkEmbeddingModel,
            }[name]
        return super().find_class(module, name)


@st.cache_resource
def load_bundle():
    with open(os.path.join(OUTPUT_DIR, "trained_models.pkl"), "rb") as f:
        return _ModelUnpickler(f).load()


@st.cache_data
def load_static_files():
    with open(os.path.join(DATA_DIR, "dataset_summary.json"), "r", encoding="utf-8") as f:
        ds_summary = json.load(f)
    with open(os.path.join(OUTPUT_DIR, "evaluation_metrics.json"), "r", encoding="utf-8") as f:
        eval_metrics = json.load(f)
    with open(os.path.join(OUTPUT_DIR, "batch_tag_predictions.json"), "r", encoding="utf-8") as f:
        batch_preds = json.load(f)
    rev_df = pd.read_csv(os.path.join(DATA_DIR, "held_out_reviewer_sample.csv"))
    return ds_summary, eval_metrics, batch_preds, rev_df


bundle = load_bundle()
taxonomy_data = bundle["taxonomy_data"]
canonical_tags = bundle["canonical_tags"]
ds_summary, eval_metrics, batch_preds, rev_df = load_static_files()

# Sidebar Control Panel
with st.sidebar:
    st.markdown("### ⚙️ Model & Threshold Controls")
    model_choice = st.radio(
        "Active Prediction Engine:",
        [
            "Sentence-Transformer (all-MiniLM-L6-v2) + Chunking",
            "TF-IDF + OvR LogReg (Title 2x Weight)",
            "Keyword & Alias Matcher (Baseline)"
        ],
        index=0
    )
    use_per_tag = st.toggle("Use Tuned Per-Tag Thresholds", value=True)
    custom_threshold = st.slider(
        "Global Confidence Threshold:",
        min_value=0.20,
        max_value=0.80,
        value=float(bundle["global_threshold"]),
        step=0.05,
        disabled=use_per_tag
    )
    max_suggestions = st.slider("Max Tag Suggestions:", min_value=1, max_value=5, value=5)
    min_words_for_auto = st.number_input("Min Words Before Auto-Tagging:", min_value=5, max_value=40, value=15)

    st.markdown("---")
    st.markdown("### 📌 System Architecture")
    st.caption(
        "- **Taxonomy:** 12 Canonical Tags + 86 Aliases\n"
        "- **Deduplication:** 468 Content Clusters\n"
        "- **Chronological Split:** 350 Train / 75 Val / 75 Test\n"
        "- **Chunking:** 60-word window (15-word stride) + `0.7 Mean + 0.3 Max` pooling"
    )

# Hero Header
st.markdown(
    """
    <div class="hero-banner">
        <div class="hero-title">🏷️ TagFlow AI — Automated Blog Content Tagging & Editorial Studio</div>
        <div class="hero-sub">
            Multi-label NLP pipeline combining <b>Alias-Aware Keyword Matching</b>, <b>Title-Weighted TF-IDF + OvR Logistic Regression</b>,
            and <b>Pretrained Sentence-Transformer (all-MiniLM-L6-v2) Chunk Embeddings</b> with human-in-the-loop editorial review.
        </div>
    </div>
    """,
    unsafe_allow_html=True
)

# Top KPI Ribbon
k1, k2, k3, k4 = st.columns(4)
with k1:
    st.markdown(
        """
        <div class="kpi-card">
            <div class="kpi-label">Verified Test Micro-F1</div>
            <div class="kpi-value">96.24%</div>
            <div class="kpi-sub">+20.2% over Keyword Baseline</div>
        </div>
        """,
        unsafe_allow_html=True
    )
with k2:
    st.markdown(
        """
        <div class="kpi-card">
            <div class="kpi-label">Top-3 Recall (Sentence-BERT)</div>
            <div class="kpi-value">100.0%</div>
            <div class="kpi-value" style="display:none"></div>
            <div class="kpi-sub">Macro-F1: 94.60% across 12 tags</div>
        </div>
        """,
        unsafe_allow_html=True
    )
with k3:
    st.markdown(
        """
        <div class="kpi-card">
            <div class="kpi-label">Auto-Tagged Coverage</div>
            <div class="kpi-value">86.7%</div>
            <div class="kpi-sub">13.3% routed to Editor Review</div>
        </div>
        """,
        unsafe_allow_html=True
    )
with k4:
    st.markdown(
        """
        <div class="kpi-card">
            <div class="kpi-label">Inference Latency</div>
            <div class="kpi-value">0.13 ms</div>
            <div class="kpi-sub">TF-IDF (13.0 ms for SBERT Chunking)</div>
        </div>
        """,
        unsafe_allow_html=True
    )

SAMPLE_DRAFTS = {
    "🔐 Python FastAPI + OAuth2 & JWT Security (HTML Input)": (
        "Securing a Python REST API with FastAPI, OAuth2, and JWT Tokens",
        "<nav class=\"site-nav\">Home | Archive | Subscribe | RSS</nav>\n"
        "<article>\n"
        "In this tutorial we build a production Python backend using FastAPI and Pydantic schemas. "
        "We expose RESTful API endpoints with OpenAPI documentation and protect sensitive routes using OAuth2 password flows, "
        "JSON Web Tokens (JWT), and OWASP security headers to prevent SQL injection and XSS vulnerabilities.\n"
        "</article>\n"
        "<footer>Copyright 2026 TechBlog Inc. All rights reserved.</footer>\n"
        "<div class=\"tag-widget\">Popular tags: #coding #tech #news</div>"
    ),
    "📚 Long Multi-Topic Article: Python ETL, XGBoost & MLOps (Tests Chunking)": (
        "End-to-End Python ETL with Airflow, XGBoost Training, and MLflow Drift Monitoring",
        "Apache Airflow DAGs orchestrate incremental SQL and Spark ETL pipelines into partitioned PostgreSQL tables. "
        "Using Python generators and virtual environments keeps our data processing scripts modular and memory-efficient. "
        "In section two, we train gradient boosted decision trees with scikit-learn and XGBoost using stratified k-fold cross-validation. "
        "In the concluding section, our MLOps pipeline registers serialized model artifacts in MLflow, serves predictions via shadow deployments, "
        "and monitors production Population Stability Index for data drift."
    ),
    "🧠 Semantic Paraphrase Draft: Deep Learning & NLP (No Explicit Keywords)": (
        "Attention Layers and Contrastive Vector Spaces for Text Classification",
        "Backpropagating gradients through multi-head attention layers projects passages into dense vector spaces on GPUs. "
        "Byte-pair subword tokenization and syntactic lemmatization normalize inflected word forms across large document collections."
    ),
    "⚛️ Niche Topic Draft: Quantum Computing with Qiskit (<15 Corpus Examples)": (
        "Simulating Bell States and Quantum Entanglement with Qiskit",
        "Qubits exist in linear superpositions of basis states until projective measurement collapses the wavefunction. "
        "Hadamard and CNOT gates entangle two qubits to construct Bell states in Python and Qiskit while mitigating decoherence noise."
    ),
    "⚠️ Short Stub Draft (<15 Words — Routes to Editor Review)": (
        "WIP: Kubernetes Upgrade Notes",
        "TODO: check pod readiness probes tomorrow."
    )
}

tab1, tab2, tab3, tab4 = st.tabs([
    "✍️ Live Editorial Tagger Studio",
    "📦 Batch Review Workbench & Export",
    "📊 Model Benchmarks & Threshold Simulator",
    "📚 Taxonomy, Alias Map & Reviewer Audit"
])

with tab1:
    col_in, col_out = st.columns([1.08, 1.12], gap="large")

    with col_in:
        st.markdown("#### 📝 1. Article Draft Input (Plain Text, Markdown, or Raw HTML)")
        preset_key = st.selectbox("Load Example Draft Scenario:", list(SAMPLE_DRAFTS.keys()))
        default_title, default_body = SAMPLE_DRAFTS[preset_key]

        draft_title = st.text_input("Blog Post Title:", value=default_title)
        draft_body = st.text_area("Article Body (HTML / Markdown / Text):", value=default_body, height=230)

        clean_t = draft_title.strip()
        clean_b = clean_article_text(draft_body)
        raw_chars = len(draft_body or "")
        clean_chars = len(clean_b or "")
        removed_chars = max(0, raw_chars - clean_chars)
        word_count = len((clean_t + " " + clean_b).split()) if (clean_t or clean_b) else 0
        chunks = bundle["sem_model"].split_into_chunks(clean_b) if clean_b else []

        m1, m2, m3 = st.columns(3)
        m1.metric("Cleaned Word Count", f"{word_count} words")
        m2.metric("Boilerplate Removed", f"{removed_chars} chars")
        m3.metric("Semantic Chunks", f"{len(chunks)} chunk(s)")

        with st.expander("🧹 Inspect Cleaned Text & Semantic Chunks Sent to Model"):
            st.markdown(f"**Cleaned Title:** `{clean_t}`")
            st.markdown(f"**Cleaned Body:** {clean_b}")
            if len(chunks) > 1:
                st.markdown("**60-Word Overlapping Chunks (`0.70 Mean + 0.30 Max` Pooling):**")
                for c_idx, ch in enumerate(chunks, 1):
                    st.caption(f"**Chunk #{c_idx}:** {ch}")

    with col_out:
        st.markdown("#### 🎯 2. Ranked Tag Suggestions & Editorial Workflow")
        if not clean_t and not clean_b:
            st.info("Enter a blog title and body on the left to generate ranked tag suggestions.")
        else:
            # Compute probabilities across all 3 models so we can also offer instant side-by-side comparison
            probs_sbert = bundle["sem_model"].predict_proba([clean_t], [clean_b])[0]
            probs_tfidf = bundle["tfidf_model"].predict_proba([clean_t], [clean_b])[0]
            probs_kw = bundle["kw_model"].predict_proba([clean_t], [clean_b])[0]

            if "Sentence-Transformer" in model_choice:
                probs = probs_sbert
                thresh_vec = bundle.get("sem_per_tag_thresholds", bundle["per_tag_thresholds"]) if use_per_tag else np.full(len(canonical_tags), custom_threshold)
            elif "TF-IDF" in model_choice:
                probs = probs_tfidf
                thresh_vec = bundle["per_tag_thresholds"] if use_per_tag else np.full(len(canonical_tags), custom_threshold)
            else:
                probs = probs_kw
                thresh_vec = np.full(len(canonical_tags), 0.45 if use_per_tag else custom_threshold)

            passing_idx = np.where(probs >= thresh_vec)[0]
            ranked_idx = passing_idx[np.argsort(probs[passing_idx])[::-1][:max_suggestions]]
            suggested_tags = [canonical_tags[i] for i in ranked_idx] if word_count >= min_words_for_auto else []

            if word_count < min_words_for_auto:
                st.markdown(
                    f'<div class="status-banner-warn">⚠️ <b>Flagged for Editor Review:</b> Draft contains too little text '
                    f'({word_count} words &lt; {min_words_for_auto}-word minimum threshold).</div>',
                    unsafe_allow_html=True
                )
                review_flag = True
            elif len(suggested_tags) == 0:
                st.markdown(
                    '<div class="status-banner-warn">⚠️ <b>Flagged for Editor Review:</b> No approved tag met the confidence threshold.</div>',
                    unsafe_allow_html=True
                )
                review_flag = True
            else:
                st.markdown(
                    f'<div class="status-banner-ok">✅ <b>Auto-Tagging Ready ({len(suggested_tags)} Approved Tags Matched)</b> — '
                    f'Engine: {model_choice.split(" (")[0]}</div>',
                    unsafe_allow_html=True
                )
                review_flag = False

            top5_indices = np.argsort(probs)[::-1][:5]
            for rank_num, idx in enumerate(top5_indices, 1):
                tag_name = canonical_tags[idx]
                score = float(probs[idx])
                req_th = float(thresh_vec[idx])
                passed = (score >= req_th) and (word_count >= min_words_for_auto) and (tag_name in suggested_tags)
                pct = int(round(score * 100))
                th_pct = int(round(req_th * 100))
                snippet = extract_supporting_snippet(clean_b, tag_name, taxonomy_data)
                card_cls = "tag-card" if passed else "tag-card-muted"
                badge_cls = "score-badge" if passed else "score-badge-low"
                status_txt = "SUGGESTED" if passed else "BELOW THRESHOLD"
                bar_color = "#10b981" if passed else "#64748b"

                st.markdown(
                    f"""
                    <div class="{card_cls}">
                        <div class="tag-header">
                            <div>
                                <span style="color:#94a3b8;font-weight:700;margin-right:6px;">#{rank_num}</span>
                                <span class="tag-pill">#{tag_name}</span>
                            </div>
                            <span class="{badge_cls}">{pct}% conf (thresh: {th_pct}%) · {status_txt}</span>
                        </div>
                        <div class="progress-track">
                            <div style="width:{min(100, pct)}%;height:100%;background:{bar_color};border-radius:99px;"></div>
                        </div>
                        <div class="snippet-box">
                            <b>Supporting Evidence:</b> "{snippet or 'Matched via title terminology.'}"
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

            with st.expander("📊 Compare All 3 Models Side-by-Side on This Draft"):
                comp_rows = []
                for idx in top5_indices:
                    t_name = canonical_tags[idx]
                    comp_rows.append({
                        "Approved Tag": t_name,
                        "Keyword Baseline": f"{probs_kw[idx]*100:.1f}%",
                        "TF-IDF + OvR (Title 2x)": f"{probs_tfidf[idx]*100:.1f}%",
                        "Sentence-Transformer (SBERT)": f"{probs_sbert[idx]*100:.1f}%",
                        "Tuned Threshold": f"{bundle['per_tag_thresholds'][idx]*100:.0f}%"
                    })
                st.table(pd.DataFrame(comp_rows))

            st.markdown("#### 👩‍💻 3. Editorial Decision & Feedback Loop")
            final_tags = st.multiselect(
                "Accept, Reject, or Add Missing Tags from Approved Taxonomy:",
                options=canonical_tags,
                default=suggested_tags
            )
            accepted = [t for t in suggested_tags if t in final_tags]
            rejected = [t for t in suggested_tags if t not in final_tags]
            added = [t for t in final_tags if t not in suggested_tags]

            d1, d2, d3 = st.columns(3)
            d1.caption(f"🟢 **Accepted:** {', '.join(accepted) if accepted else 'None'}")
            d2.caption(f"🔴 **Rejected:** {', '.join(rejected) if rejected else 'None'}")
            d3.caption(f"➕ **Added by Editor:** {', '.join(added) if added else 'None'}")

            editor_notes = st.text_input("Editorial Review Note (optional):", placeholder="e.g., Verified tags for publication")
            if st.button("💾 Approve Tags & Save to Feedback Log", type="primary", use_container_width=True):
                record = {
                    "timestamp": datetime.now().isoformat(timespec="seconds"),
                    "title": clean_t,
                    "word_count": word_count,
                    "model_used": model_choice,
                    "suggested_tags": suggested_tags,
                    "accepted_tags": accepted,
                    "rejected_tags": rejected,
                    "added_missing_tags": added,
                    "final_editor_approved_tags": final_tags,
                    "flagged_for_review": review_flag,
                    "editor_notes": editor_notes
                }
                existing = []
                if os.path.exists(FEEDBACK_PATH):
                    with open(FEEDBACK_PATH, "r", encoding="utf-8") as f:
                        existing = json.load(f)
                existing.append(record)
                with open(FEEDBACK_PATH, "w", encoding="utf-8") as f:
                    json.dump(existing, f, indent=2)
                st.success(f"Saved decision to `outputs/editor_feedback_log.json`! ({len(existing)} total reviews logged)")

with tab2:
    st.markdown("#### 📦 Batch Editorial Review Queue & Export (`75 Held-Out Test Posts`)")
    batch_df = pd.DataFrame(batch_preds)
    auto_cnt = int((~batch_df["review_status"].str.contains("Needs Editor Review")).sum())
    rev_cnt = int(batch_df["review_status"].str.contains("Needs Editor Review").sum())

    b1, b2, b3 = st.columns(3)
    b1.metric("Total Unseen Batch Posts", f"{len(batch_df)} posts")
    b2.metric("Auto-Approved Posts", f"{auto_cnt} posts ({auto_cnt/len(batch_df)*100:.1f}%)")
    b3.metric("Routed to Editor Review", f"{rev_cnt} posts ({rev_cnt/len(batch_df)*100:.1f}%)")

    filter_status = st.radio(
        "Filter Queue:",
        ["All Batch Posts (75)", "⚠️ Needs Editor Review Only", "✅ Auto-Approved Only"],
        horizontal=True
    )
    if "Needs Editor Review" in filter_status:
        view_df = batch_df[batch_df["review_status"].str.contains("Needs Editor Review")].copy()
    elif "Auto-Approved" in filter_status:
        view_df = batch_df[batch_df["review_status"].str.contains("Auto-Approved")].copy()
    else:
        view_df = batch_df.copy()

    st.dataframe(
        view_df[["post_id", "published_at", "title", "post_type", "word_count", "suggested_tags", "model_scores", "review_status", "final_editor_approved_tags"]],
        use_container_width=True,
        height=350
    )

    c_dl1, c_dl2 = st.columns(2)
    with c_dl1:
        st.download_button(
            "⬇️ Export Batch Tag Assignments (JSON)",
            data=json.dumps(batch_preds, indent=2),
            file_name="batch_tag_predictions.json",
            mime="application/json",
            use_container_width=True
        )
    with c_dl2:
        csv_bytes = pd.read_csv(os.path.join(OUTPUT_DIR, "batch_tag_predictions.csv")).to_csv(index=False).encode("utf-8")
        st.download_button(
            "⬇️ Export Batch Tag Assignments (CSV)",
            data=csv_bytes,
            file_name="batch_tag_predictions.csv",
            mime="text/csv",
            use_container_width=True
        )

with tab3:
    st.markdown("#### 📊 Unseen Test Split Model Comparison")
    st.dataframe(pd.DataFrame(eval_metrics["test_model_comparison"]), use_container_width=True)

    st.markdown("#### 🎚️ Interactive Validation Threshold Trade-Off Explorer")
    sweep_df = pd.DataFrame(eval_metrics["threshold_sweep"])
    selected_th_row = st.select_slider(
        "Slide Threshold to Inspect Validation Quality vs. Review Routing Trade-Off:",
        options=list(sweep_df["threshold"].values),
        value=float(eval_metrics["best_global_threshold"])
    )
    row_match = sweep_df[sweep_df["threshold"] == selected_th_row].iloc[0]
    t1, t2, t3, t4, t5 = st.columns(5)
    t1.metric("Val Micro-F1", f"{row_match['val_micro_f1']:.4f}")
    t2.metric("Val Macro-F1", f"{row_match['val_macro_f1']:.4f}")
    t3.metric("False Positives", f"{int(row_match['false_positives'])}")
    t4.metric("Missed Tags (FN)", f"{int(row_match['missed_tags_fn'])}")
    t5.metric("% Routed to Review", f"{row_match['routed_to_editor_review_pct']:.1f}%")

    ch1, ch2 = st.columns(2)
    with ch1:
        st.image(os.path.join(OUTPUT_DIR, "model_comparison.png"), caption="Model Comparison on Unseen Test Posts", use_container_width=True)
    with ch2:
        st.image(os.path.join(OUTPUT_DIR, "threshold_tradeoff.png"), caption="Validation Threshold Trade-Off Curve", use_container_width=True)

    st.image(os.path.join(OUTPUT_DIR, "per_tag_f1.png"), caption="Per-Tag F1 Performance by Tag Frequency Tier", use_container_width=True)

    st.markdown("#### 📈 Metrics Grouped by Tag Frequency Tier")
    st.table(pd.DataFrame(eval_metrics["frequency_tier_summary"]))

with tab4:
    st.markdown("#### 📚 Approved 12-Tag Taxonomy, Definitions, Examples & Alias Map")
    tax_dist = {r["tag"]: r for r in ds_summary["tag_distribution"]}
    tax_rows = []
    for e in taxonomy_data["approved_tags"]:
        t_info = tax_dist.get(e["tag"], {})
        tax_rows.append({
            "Canonical Tag": e["tag"],
            "Definition": e["definition"],
            "Mapped Aliases": ", ".join(e["aliases"]),
            "Total Posts": t_info.get("total_posts", 0),
            "Evaluation Status": t_info.get("status_note", "")
        })
    st.dataframe(pd.DataFrame(tax_rows), use_container_width=True, height=450)

    st.markdown("#### 🔍 Human Reviewer Audit of 50 Held-Out Posts (`data/held_out_reviewer_sample.csv`)")
    st.caption("Highlights posts where historical author tags omitted a valid secondary tag covered in the article text.")
    st.dataframe(rev_df, use_container_width=True, height=300)
