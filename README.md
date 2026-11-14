# Project 1: Automated Content Tagging for Blogs

An end-to-end multi-label machine learning system and editorial review application that reads blog titles and article bodies (Plain Text, Markdown, or HTML), strips navigation/footers/boilerplate, suggests up to **5 approved tags** from a canonical taxonomy with confidence scores and supporting text snippets, routes short (`< 15 words`) or uncertain predictions to editor review, and exports final editor-approved tag assignments in **CSV** and **JSON**.

---

## Complete Deliverables Checklist

| Deliverable | File Path | Description |
| :--- | :--- | :--- |
| **1. Documented Tag Taxonomy & Alias Map** | `data/taxonomy.json` | 12 canonical tags, definitions, example titles, and 86 mapped aliases (e.g., `ML` $\rightarrow$ `Machine Learning`, `py` $\rightarrow$ `Python`, `k8s` $\rightarrow$ `Cloud & DevOps`). |
| **1b. Reproducible Data Preparation Script & Labeled Dataset** | `src/prepare_data.py`<br>`data/blog_posts_dataset.csv`<br>`data/dataset_summary.json`<br>`data/held_out_reviewer_sample.csv` | Strips HTML/Markdown boilerplate, groups republished duplicates into 468 clusters before temporal splitting (`350 train / 75 val / 75 test`), flags niche tags (`<15` examples), and audits 50 held-out posts for missing/inconsistent historical labels. |
| **2. Training & Evaluation Code (Keyword, TF-IDF, Semantic)** | `src/train_and_evaluate.py`<br>`Blog_Tagging_Pipeline.ipynb` | Implements `KeywordAliasMatcher`, `TfidfOvRModel` (`1x` vs `2x` title weighting), and `SemanticChunkEmbeddingModel` (`SentenceTransformer("all-MiniLM-L6-v2")` with 60-word overlapping chunking), plus validation threshold tuning and unseen test evaluation. |
| **3. Working Tagging Demo & Batch CSV/JSON Exports** | `talverin-ui/` + `src/api_server.py`<br>`app.py`<br>`outputs/batch_tag_predictions.csv`<br>`outputs/batch_tag_predictions.json`<br>`outputs/editor_feedback_log.json` | Interactive **Talverin Next.js 15 Studio (`:3000`)** + **FastAPI Server (`:8000`)** + **Streamlit App (`app.py`)**, plus exported batch predictions with post IDs, suggested tags, scores, review status, and final editor-approved tags. |
| **4. Evaluation Report & Visual Charts** | `REPORT.md`<br>`outputs/evaluation_metrics.json`<br>`outputs/model_comparison.png`<br>`outputs/threshold_tradeoff.png`<br>`outputs/per_tag_f1.png` | Detailed comparison of Micro-F1, Verified Complete Micro-F1, Macro-F1, Precision@3, Recall@3, inference latency, metrics by tag frequency tier, threshold trade-offs, and concrete examples of false positives, missed tags, short drafts, niche topics, and long multi-topic articles. |

---

## Reproducible Commands

### 1. Data Preparation & Taxonomy/Reviewer Audit
```bash
/Users/shoumikaggarwal/.gemini/antigravity/scratch/persevex_venv/bin/python src/prepare_data.py
```

### 2. Model Training, Threshold Tuning & Unseen Evaluation
```bash
/Users/shoumikaggarwal/.gemini/antigravity/scratch/persevex_venv/bin/python src/train_and_evaluate.py
```

### 3. Launch the Talverin Next.js 15 Studio (`:3000`) + FastAPI Backend (`:8000`)
```bash
./start_talverin_studio.sh
```

### 4. Alternative: Launch the Streamlit Prototype (`:8501`)
```bash
/Users/shoumikaggarwal/.gemini/antigravity/scratch/persevex_venv/bin/streamlit run app.py
```

---

## Technical Documentation of Core Algorithms

### 1. How Long-Article Chunk Representations Are Combined (`SemanticChunkEmbeddingModel`)
1. Long cleaned article bodies are split into overlapping chunks of **`chunk_size_words = 60` words** with an overlap stride of **`15` words** (`step = 45` words).
2. The cleaned title and each body chunk $\mathbf{c}_1, \dots, \mathbf{c}_K$ are encoded into 384-dimensional $L_2$-normalized embeddings using pretrained **`SentenceTransformer("all-MiniLM-L6-v2")`**.
3. Chunk embeddings are combined via **Hybrid Mean + Max Pooling**:
   $$\mathbf{v}_{\text{body}} = 0.70 \cdot \frac{1}{K}\sum_{k=1}^K \mathbf{c}_k + 0.30 \cdot \max_{k=1..K} \mathbf{c}_k$$
   *Why:* Global average pooling alone dilutes secondary topics that appear in a single section of a long multi-subject tutorial, whereas combining 70% mean pooling with 30% element-wise max pooling preserves peak section-level semantic signals.
4. The final document representation concatenates $[\mathbf{v}_{\text{title}} \;\|\; \mathbf{v}_{\text{body}}] \in \mathbb{R}^{768}$ and feeds a multi-label One-vs-Rest classifier.

### 2. How Supporting Text Snippets Are Selected (`extract_supporting_snippet`)
For each suggested tag, the cleaned article body is segmented into sentences and each sentence $s$ is scored against the tag's taxonomy entry:
$$\text{SnippetScore}(s, t) = 2.0 \times \bigl|\{\text{alias} \in \text{Aliases}(t) : \text{alias} \in s\}\bigr| + 0.5 \times \bigl|\{\text{kw} \in \text{Definition}(t) : \text{kw} \in s\}\bigr|$$
The highest-scoring sentence (up to 190 characters) is surfaced in the editorial review interface so editors can immediately verify why a tag was suggested.
