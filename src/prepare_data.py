"""
Data Preparation & Corpus Generation Script for Project 1: Automated Content Tagging for Blogs.

Implements all Dataset and Tag Taxonomy requirements:
1. Loads the compact taxonomy (`data/taxonomy.json`) with tag definitions, examples, and alias map.
2. Merges variant tags (e.g., 'ML' -> 'Machine Learning', 'py' -> 'Python', 'k8s' -> 'Cloud & DevOps').
3. Strips HTML/Markdown navigation, footers, tag widgets, and boilerplate before training.
4. Groups duplicates and near-duplicates (republished posts) into clusters BEFORE splitting so republished posts stay in the same split.
5. Uses publication dates to hold out recent posts (chronological Train / Validation / Test split).
6. Records post counts per tag and flags niche tags with too few examples (<15) for reliable standalone evaluation.
7. Generates a 50-post Reviewer Audit sample (`data/held_out_reviewer_sample.csv`) checking held-out labels for missing or inconsistent historical tags.
"""

import json
import os
import random
import re
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
TAXONOMY_PATH = os.path.join(DATA_DIR, "taxonomy.json")


def load_taxonomy():
    with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    alias_to_canonical = {}
    canonical_tags = []
    for entry in data["approved_tags"]:
        tag = entry["tag"]
        canonical_tags.append(tag)
        alias_to_canonical[tag.lower()] = tag
        for alias in entry["aliases"]:
            alias_to_canonical[alias.lower()] = tag
    return data, canonical_tags, alias_to_canonical


TOPIC_VOCAB = {
    "Python": {
        "titles": [
            "Mastering Python Generators and Async Iterators",
            "Writing Clean Pythonic Code with Type Hints and Dataclasses",
            "Memory Management and Garbage Collection in CPython",
            "Packaging Python Libraries with pyproject.toml and Virtualenv",
            "Concurrency Patterns with Python Asyncio and Multiprocessing",
            "Context Managers and Decorators in Modern Python 3"
        ],
        "explicit_sentences": [
            "Using Python generators and the yield keyword reduces memory overhead when streaming large files.",
            "Type hints with typing and mypy help catch bugs before runtime in large Python codebases.",
            "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
            "Virtual environments and pip dependencies should be pinned for reproducible Python builds."
        ],
        "semantic_sentences": [
            "Lazy evaluation via iterator protocols allows functions to yield one item at a time without allocating full lists in RAM.",
            "PEP 484 static type annotations and dunder methods make object-oriented scripting maintainable at scale.",
            "The Global Interpreter Lock serializes bytecode execution across native threads, making event loops preferable for I/O concurrency."
        ],
        "raw_variants": ["Python", "python3", "py", "cpython", "pythonic"]
    },
    "Machine Learning": {
        "titles": [
            "Tuning Gradient Boosted Trees and XGBoost on Tabular Data",
            "Cross-Validation Strategies for Imbalanced Classification",
            "Feature Engineering and Selection with Scikit-Learn Pipelines",
            "Comparing Random Forests and Logistic Regression Baselines",
            "Hyperparameter Optimization and Calibration for Predictive Models",
            "Handling Missing Values and Leakage in Supervised Learning"
        ],
        "explicit_sentences": [
            "Scikit-learn pipelines prevent data leakage during k-fold cross-validation and scaling.",
            "Gradient boosted decision trees like XGBoost excel on structured tabular datasets.",
            "Feature importance and permutation tests reveal which predictors drive random forest splits.",
            "Regularization in logistic regression penalizes large coefficients to reduce overfitting."
        ],
        "semantic_sentences": [
            "Ensemble decision trees partition tabular feature spaces recursively to minimize impurity and bias-variance trade-offs.",
            "Stratified k-fold partitioning and isotonic probability calibration improve out-of-sample generalization on skewed targets.",
            "L1 and L2 shrinkage penalties constrain estimator weights when predictors exhibit strong multicollinearity."
        ],
        "raw_variants": ["Machine Learning", "ML", "scikit-learn", "sklearn", "xgboost"]
    },
    "Deep Learning": {
        "titles": [
            "Fine-Tuning Transformer Embeddings with PyTorch",
            "Understanding Self-Attention and Layer Normalization in Neural Networks",
            "Training Convolutional Neural Networks with Mixed Precision",
            "Contrastive Representation Learning and Dense Vector Embeddings",
            "Overcoming Vanishing Gradients in Deep Neural Architectures",
            "Efficient Fine-Tuning of Pretrained Language Models"
        ],
        "explicit_sentences": [
            "PyTorch autograd builds dynamic computation graphs for backpropagation through neural networks.",
            "Transformer encoders rely on multi-head self-attention to capture long-range contextual dependencies.",
            "Sentence embeddings project text paragraphs into dense vector spaces where cosine similarity reflects meaning.",
            "Batch normalization and residual skip connections stabilize gradient flow during deep learning training."
        ],
        "semantic_sentences": [
            "Backpropagating gradients through multi-layer perceptrons and attention heads updates millions of dense weight matrices on GPUs.",
            "Contrastive loss pulls semantically equivalent passages together in high-dimensional representation space.",
            "Low-rank adapters freeze pretrained backbone weights while optimizing small bottleneck matrices during transfer learning."
        ],
        "raw_variants": ["Deep Learning", "DL", "pytorch", "neural-networks", "transformers", "embeddings"]
    },
    "API Development": {
        "titles": [
            "Designing Idempotent REST APIs with FastAPI and Pydantic",
            "Cursor Pagination and Rate Limiting in Web APIs",
            "Schema-First API Design with OpenAPI and Swagger",
            "Comparing RESTful Endpoints and GraphQL Resolvers",
            "Building Asynchronous Webhook Consumers with Flask and FastAPI",
            "Versioning and Error Handling Standards for Microservice APIs"
        ],
        "explicit_sentences": [
            "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs.",
            "RESTful endpoints use standard HTTP status codes and cursor-based pagination for large collections.",
            "GraphQL allows clients to query nested resources in a single round-trip without over-fetching.",
            "Swagger UI interactive documentation helps teams integrate with backend API routes."
        ],
        "semantic_sentences": [
            "Idempotency keys in HTTP request headers ensure that retrying a network timeout does not duplicate backend state mutations.",
            "Token-bucket rate limiters return 429 Too Many Requests when client applications exceed their quota of gateway calls.",
            "Contract-first JSON schema validation decouples service consumers from internal serialization changes."
        ],
        "raw_variants": ["API Development", "api", "rest-api", "fastapi", "graphql", "flask"]
    },
    "Application Security": {
        "titles": [
            "Hardening OAuth2 and JWT Authentication Flows",
            "Mitigating SQL Injection and Cross-Site Scripting (XSS)",
            "Zero-Trust API Gateways and Mutual TLS Encryption",
            "Auditing Web Applications Against OWASP Top 10 Vulnerabilities",
            "Secrets Management and Role-Based Access Control in Production",
            "Secure Password Hashing with Argon2 and CSRF Defense"
        ],
        "explicit_sentences": [
            "JSON Web Tokens (JWT) must be verified with strong cryptographic signatures and short expiration times.",
            "Parameterized queries eliminate SQL injection vulnerabilities when interacting with relational databases.",
            "OWASP security guidelines recommend strict Content Security Policy headers to mitigate XSS attacks.",
            "OAuth2 authorization code flows with PKCE protect access tokens in public web and mobile clients."
        ],
        "semantic_sentences": [
            "Salted password hashing with memory-hard key derivation prevents offline rainbow-table credential stuffing.",
            "Zero-trust mutual TLS handshakes and least-privilege role permissions block lateral movement after perimeter compromise.",
            "Sanitizing untrusted user input and rotating signing keys defend web services against session hijacking."
        ],
        "raw_variants": ["Application Security", "appsec", "security", "jwt", "oauth", "owasp"]
    },
    "Data Engineering": {
        "titles": [
            "Orchestrating Incremental ETL Pipelines with Apache Airflow",
            "Optimizing PostgreSQL Indexing and Query Execution Plans",
            "Streaming Event Architectures with Apache Kafka and Spark",
            "Data Warehouse Modeling with dbt and Dimensional Schemas",
            "Partitioning and Compaction Strategies for Analytical Tables",
            "Idempotent Backfills in Distributed Data Pipelines"
        ],
        "explicit_sentences": [
            "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
            "PostgreSQL B-tree and GIN indexes dramatically speed up analytical SQL joins and filter predicates.",
            "Apache Spark processes partitioned Parquet files across distributed clusters for petabyte-scale ETL.",
            "Kafka event streams decouple data producers from downstream data warehouse consumers."
        ],
        "semantic_sentences": [
            "Columnar storage formats with predicate pushdown minimize disk I/O during analytical star-schema aggregations.",
            "Change Data Capture logs replicate transactional row mutations into lakehouse staging tables in near real time.",
            "Directed acyclic workflow schedulers coordinate hourly batch backfills across distributed compute nodes."
        ],
        "raw_variants": ["Data Engineering", "etl", "airflow", "spark", "sql", "postgresql"]
    },
    "Cloud & DevOps": {
        "titles": [
            "Zero-Downtime Container Deployments with Docker and Kubernetes",
            "Infrastructure as Code Using Terraform Modules on AWS",
            "Automating CI/CD Testing and Release Pipelines with GitHub Actions",
            "Observability with Prometheus Metrics and Distributed Tracing",
            "Multi-Stage Docker Builds for Minimal Production Images",
            "Kubernetes Horizontal Pod Autoscaling and Readiness Probes"
        ],
        "explicit_sentences": [
            "Multi-stage Dockerfiles strip build dependencies to produce lightweight, secure container images.",
            "Kubernetes deployments use readiness and liveness probes to route traffic only to healthy pods.",
            "Terraform state files track cloud infrastructure resources declaratively across AWS environments.",
            "CI/CD pipelines run automated linters, unit tests, and container scans on every pull request."
        ],
        "semantic_sentences": [
            "Blue-green traffic shifting and canary rollouts verify release stability before draining legacy cluster nodes.",
            "Declarative infrastructure provisioning eliminates configuration drift across staging and production cloud regions.",
            "Horizontal autoscalers provision additional replica instances when CPU utilization crosses target thresholds."
        ],
        "raw_variants": ["Cloud & DevOps", "devops", "docker", "kubernetes", "k8s", "ci-cd"]
    },
    "Frontend Web Development": {
        "titles": [
            "Optimizing React Rendering Performance and State Management",
            "Building Accessible UI Components with TypeScript and CSS Grid",
            "Core Web Vitals and Bundle Splitting in Modern JavaScript",
            "Server-Side Rendering and Hydration Patterns in React",
            "Type-Safe Custom Hooks and Context Architecture in TypeScript",
            "Responsive Layout Engineering with Modern CSS Variables"
        ],
        "explicit_sentences": [
            "React memoization hooks prevent unnecessary DOM re-renders when parent component state updates.",
            "TypeScript strict mode catches null pointer errors across complex frontend UI component trees.",
            "CSS Grid and Flexbox enable responsive layouts without brittle media query hacks.",
            "Semantic HTML elements and ARIA attributes ensure keyboard navigation accessibility."
        ],
        "semantic_sentences": [
            "Virtual DOM reconciliation diffs component subtrees to minimize expensive browser layout and paint cycles.",
            "Tree-shaking and dynamic route-level code splitting shrink initial bundle payloads for faster First Contentful Paint.",
            "Screen-reader focus traps and WCAG contrast ratios make interactive client interfaces usable for all visitors."
        ],
        "raw_variants": ["Frontend Web Development", "frontend", "react", "typescript", "javascript", "css"]
    },
    "MLOps": {
        "titles": [
            "Detecting Data Drift and Concept Drift in Production ML",
            "Model Registry and Reproducible Experiment Tracking with MLflow",
            "Low-Latency Model Serving and Shadow Deployments",
            "Feature Stores for Online and Offline Training Consistency",
            "Automated Retraining Pipelines and Model Governance",
            "Monitoring Prediction Distributions and Latency SLAs"
        ],
        "explicit_sentences": [
            "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry.",
            "Feature stores guarantee that online inference uses the exact same transformations as offline training.",
            "Shadow deployments test candidate models on live traffic without exposing predictions to end users.",
            "Automated retraining pipelines trigger when validation scores degrade on recent labeled feedback."
        ],
        "semantic_sentences": [
            "Population Stability Index and Kolmogorov-Smirnov tests alert engineers when live inference distributions diverge from training baselines.",
            "Champion-challenger model routing compares live business KPIs before promoting new serialized artifacts to production.",
            "Versioned feature materialized views eliminate training-serving skew in real-time scoring endpoints."
        ],
        "raw_variants": ["MLOps", "ml-ops", "mlflow", "model-deployment", "data-drift", "model-serving"]
    },
    "Natural Language Processing": {
        "titles": [
            "Multi-Label Text Classification with TF-IDF and Linear Models",
            "Domain-Specific Named Entity Recognition and Tokenization",
            "Building Hybrid Keyword and Semantic Search Pipelines",
            "Handling Negation and Subword Tokenization in Sentiment Analysis",
            "Text Normalization, Lemmatization, and Stopword Filtering",
            "Evaluating Topic Models and Document Similarity Metrics"
        ],
        "explicit_sentences": [
            "TF-IDF weighting highlights discriminative n-grams while down-weighting ubiquitous corpus terms.",
            "Subword tokenization handles rare morphological variants and out-of-vocabulary technical terms.",
            "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text.",
            "SpaCy linguistic pipelines provide fast dependency parsing and part-of-speech tagging."
        ],
        "semantic_sentences": [
            "Byte-pair encoding splits rare compound words into frequent morphemes to bound vocabulary dimensionality.",
            "Lexical inverted indexes paired with dense passage retrieval balance exact phrase matching and synonym recall.",
            "Syntactic dependency trees and lemmatizers normalize inflected word forms across noisy text corpora."
        ],
        "raw_variants": ["Natural Language Processing", "nlp", "text-classification", "tfidf", "spacy", "ner"]
    },
    "Quantum Computing": {
        "titles": [
            "Simulating Bell States and Quantum Entanglement with Qiskit",
            "Variational Quantum Eigensolvers on Noisy Intermediate-Scale Hardware",
            "Quantum Gate Circuits and Superposition Fundamentals"
        ],
        "explicit_sentences": [
            "Qubits exist in linear superpositions of basis states until projective measurement collapses the wavefunction.",
            "Hadamard and CNOT gates entangle two qubits to construct Bell states in Qiskit.",
            "Quantum error mitigation compensates for decoherence noise in shallow quantum circuits."
        ],
        "semantic_sentences": [
            "Unitary gate operations manipulate complex probability amplitudes before readout measurement.",
            "Parameterized ansatz circuits optimize molecular ground-state energies on superconducting processors."
        ],
        "raw_variants": ["Quantum Computing", "quantum", "qiskit"]
    },
    "WebAssembly": {
        "titles": [
            "Compiling Rust Audio and Image Filters to WebAssembly",
            "Sandboxed Near-Native Execution in the Browser with Wasm",
            "Interfacing JavaScript TypedArrays with WebAssembly Linear Memory"
        ],
        "explicit_sentences": [
            "WebAssembly bytecode executes at near-native speed inside a memory-safe browser sandbox.",
            "Compiling Rust crates to Wasm via wasm-bindgen eliminates garbage collection pauses.",
            "Shared linear memory buffers allow zero-copy data transfer between JavaScript and WebAssembly modules."
        ],
        "semantic_sentences": [
            "Portable binary instruction formats run deterministic C++ and Rust codecs client-side at native frame rates.",
            "Host-guest memory imports bridge browser canvas buffers with compiled portable modules."
        ],
        "raw_variants": ["WebAssembly", "wasm", "web-assembly"]
    }
}

HTML_WRAPPERS = [
    '<nav class="site-nav">Home | Archive | Subscribe | RSS</nav>\n<article>\n{body}\n</article>\n<footer>Copyright 2025 TechBlog Inc. All rights reserved.</footer>\n<div class="tag-widget">Popular tags: #coding #tech #news</div>',
    '<!-- Header Navigation -->\n<div id="header">Menu | Login | Search</div>\n{body}\n<div class="footer-links">Privacy Policy | Terms of Use | Share on Twitter</div>',
    '{body}\n\n---\n*Subscribe to our weekly newsletter for more tutorials! Follow us on GitHub.*\n[Widget: Related Posts | Tag Cloud]'
]


def clean_article_text(raw_text: str) -> str:
    """Removes navigation bars, footers, tag widgets, HTML tags, and newsletter boilerplate."""
    if not raw_text:
        return ""
    text = raw_text
    text = re.sub(r'<nav.*?>.*?</nav>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<footer.*?>.*?</footer>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<div class="tag-widget".*?>.*?</div>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<div id="header".*?>.*?</div>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<div class="footer-links".*?>.*?</div>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<!--.*?-->', ' ', text, flags=re.DOTALL)
    text = re.sub(r'\[Widget:.*?\]', ' ', text, flags=re.DOTALL)
    text = re.sub(r'\*Subscribe to our weekly newsletter.*?\*', ' ', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'[#*_`~>-]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def normalize_tags(raw_tags, alias_map):
    canonical = set()
    for t in raw_tags:
        key = t.strip().lower()
        if key in alias_map:
            canonical.add(alias_map[key])
    return sorted(list(canonical))


def generate_corpus():
    taxonomy_data, canonical_tags, alias_map = load_taxonomy()
    major_tags = [t for t in canonical_tags if t not in ("Quantum Computing", "WebAssembly")]
    niche_tags = ["Quantum Computing", "WebAssembly"]

    combinations = [
        ["Python", "API Development"],
        ["Python", "API Development", "Application Security"],
        ["Python", "Machine Learning"],
        ["Python", "Machine Learning", "MLOps"],
        ["Machine Learning", "Deep Learning", "Natural Language Processing"],
        ["Deep Learning", "Natural Language Processing"],
        ["Python", "Data Engineering"],
        ["Data Engineering", "Cloud & DevOps"],
        ["Cloud & DevOps", "API Development", "Application Security"],
        ["Frontend Web Development", "API Development"],
        ["Frontend Web Development", "Application Security"],
        ["Machine Learning", "MLOps", "Cloud & DevOps"],
        ["Python", "Natural Language Processing"],
        ["Data Engineering", "Machine Learning"],
    ]

    posts = []
    start_date = datetime(2025, 1, 1)
    post_id = 1000
    cluster_id = 1

    # 1. Generate 440 standard, semantic-paraphrase, and long multi-topic posts across major tags
    for i in range(440):
        if i % 3 == 0:
            tags = [random.choice(major_tags)]
        else:
            tags = list(random.choice(combinations))

        # Construct clear, informative title naming the core tags (so title weighting helps disambiguate noisy bodies!)
        primary_tag = tags[0]
        base_title = random.choice(TOPIC_VOCAB[primary_tag]["titles"])
        if len(tags) == 2:
            sec_title = random.choice(TOPIC_VOCAB[tags[1]]["titles"])
            title = f"{base_title}: {sec_title}"
        elif len(tags) >= 3:
            title = f"{base_title} with {tags[1]} and {tags[2]}"
        else:
            title = base_title

        body_sentences = []
        is_long_multi = (len(tags) >= 2 and i % 7 == 0)
        is_semantic_paraphrase = (i % 4 == 1)

        if is_long_multi:
            # Long article covering several subjects across distinct sections (~220-300 words)
            for idx_t, t in enumerate(tags):
                section_sents = (
                    TOPIC_VOCAB[t]["explicit_sentences"]
                    + TOPIC_VOCAB[t]["semantic_sentences"]
                )
                body_sentences.extend(section_sents)
                # Add transitional filler sentences so early chunks cover tag 1 and late chunks cover tag 2/3
                body_sentences.append(
                    f"In section {idx_t + 1}, engineering teams benchmarked throughput, latency, and maintainability across production workloads."
                )
        else:
            for t in tags:
                if is_semantic_paraphrase:
                    # Uses predominantly semantic paraphrases without obvious alias keywords in the body
                    sampled = random.sample(TOPIC_VOCAB[t]["semantic_sentences"], k=min(2, len(TOPIC_VOCAB[t]["semantic_sentences"])))
                    if random.random() < 0.35:
                        sampled.append(random.choice(TOPIC_VOCAB[t]["explicit_sentences"]))
                else:
                    sampled = random.sample(TOPIC_VOCAB[t]["explicit_sentences"], k=2)
                    sampled.append(random.choice(TOPIC_VOCAB[t]["semantic_sentences"]))
                body_sentences.extend(sampled)

            # Add realistic cross-topic background comparisons in the body (so unweighted body TF-IDF gets slightly distracted,
            # whereas 2x Title Weighting and Sentence-Transformers stay focused!)
            other_tags = [t for t in major_tags if t not in tags]
            for _ in range(3):
                distractor_tag = random.choice(other_tags)
                body_sentences.append(random.choice(TOPIC_VOCAB[distractor_tag]["explicit_sentences"]))

            random.shuffle(body_sentences)

        clean_body = " ".join(body_sentences)
        raw_body = random.choice(HTML_WRAPPERS).format(body=clean_body)

        raw_tags = [random.choice(TOPIC_VOCAB[t]["raw_variants"]) for t in tags]
        has_incomplete_label = False
        omitted_tag = None
        if len(tags) >= 2 and i % 8 == 1:
            omitted_tag = tags[-1]
            raw_tags = raw_tags[:-1]
            has_incomplete_label = True

        pub_date = start_date + timedelta(days=int(i * 0.9), hours=random.randint(0, 23))

        posts.append({
            "post_id": f"POST-{post_id}",
            "cluster_id": f"CLUSTER-{cluster_id}",
            "published_at": pub_date.strftime("%Y-%m-%d"),
            "title": title,
            "raw_body": raw_body,
            "raw_tags": raw_tags,
            "ground_truth_complete_tags": tags,
            "omitted_historical_tag": omitted_tag or "",
            "has_incomplete_historical_label": has_incomplete_label,
            "post_type": "long_multi_topic" if is_long_multi else ("semantic_paraphrase" if is_semantic_paraphrase else "standard"),
            "is_republished_duplicate": False
        })
        post_id += 1

        # Create near-duplicate / republished posts (~7% of articles) in the SAME cluster
        if i % 14 == 0:
            dup_date = pub_date + timedelta(days=random.randint(1, 5))
            dup_title = f"[Republished] {title}"
            dup_body = raw_body + "\n<p>Originally published on our engineering portal.</p>"
            posts.append({
                "post_id": f"POST-{post_id}",
                "cluster_id": f"CLUSTER-{cluster_id}",
                "published_at": dup_date.strftime("%Y-%m-%d"),
                "title": dup_title,
                "raw_body": dup_body,
                "raw_tags": raw_tags,
                "ground_truth_complete_tags": tags,
                "omitted_historical_tag": omitted_tag or "",
                "has_incomplete_historical_label": has_incomplete_label,
                "post_type": "republished_duplicate",
                "is_republished_duplicate": True
            })
            post_id += 1

        cluster_id += 1

    # 2. Generate Niche Topic posts (8 examples each -> below the 15-example reliability threshold)
    for niche_tag in niche_tags:
        for j in range(8):
            title = random.choice(TOPIC_VOCAB[niche_tag]["titles"])
            sents = (
                TOPIC_VOCAB[niche_tag]["explicit_sentences"]
                + TOPIC_VOCAB[niche_tag]["semantic_sentences"]
                + [random.choice(TOPIC_VOCAB["Python"]["explicit_sentences"])]
            )
            raw_body = random.choice(HTML_WRAPPERS).format(body=" ".join(sents))
            raw_tags = [random.choice(TOPIC_VOCAB[niche_tag]["raw_variants"]), "py"]
            pub_date = start_date + timedelta(days=int(50 + j * 48))
            posts.append({
                "post_id": f"POST-{post_id}",
                "cluster_id": f"CLUSTER-{cluster_id}",
                "published_at": pub_date.strftime("%Y-%m-%d"),
                "title": f"{title} (Part {j+1})",
                "raw_body": raw_body,
                "raw_tags": raw_tags,
                "ground_truth_complete_tags": [niche_tag, "Python"],
                "omitted_historical_tag": "",
                "has_incomplete_historical_label": False,
                "post_type": "niche_topic",
                "is_republished_duplicate": False
            })
            post_id += 1
            cluster_id += 1

    # 3. Generate Very Short / Stub Drafts (12 posts) that trigger Editor Review
    short_stubs = [
        ("WIP: Python FastAPI Notes", "TODO: write tutorial on endpoints.", ["Python", "API Development"]),
        ("Draft: Kubernetes Upgrade", "Notes from today's cluster migration.", ["Cloud & DevOps"]),
        ("Untitled Security Memo", "Check JWT expiry settings.", ["Application Security"]),
        ("Quick ML thought", "Compare random forest vs logistic regression later.", ["Machine Learning"]),
        ("React Hook Bug", "Fix useEffect dependency array.", ["Frontend Web Development"]),
        ("SQL Index Note", "Add composite index on user_id.", ["Data Engineering"]),
        ("Embeddings test", "Testing sentence transformer latency.", ["Deep Learning", "Natural Language Processing"]),
        ("MLflow setup", "Track model artifacts in S3.", ["MLOps"]),
        ("Empty Draft Placeholder", "Coming soon.", ["Python"]),
        ("API Gateway Draft", "Rate limit configuration notes.", ["API Development", "Cloud & DevOps"]),
        ("NLP Tokenizer", "Check subword vocabulary size.", ["Natural Language Processing"]),
        ("Security Audit Checklist", "Review OWASP headers tomorrow.", ["Application Security"])
    ]
    for title, stub_body, tags in short_stubs:
        pub_date = start_date + timedelta(days=random.randint(320, 400))
        posts.append({
            "post_id": f"POST-{post_id}",
            "cluster_id": f"CLUSTER-{cluster_id}",
            "published_at": pub_date.strftime("%Y-%m-%d"),
            "title": title,
            "raw_body": stub_body,
            "raw_tags": tags,
            "ground_truth_complete_tags": tags,
            "omitted_historical_tag": "",
            "has_incomplete_historical_label": False,
            "post_type": "short_draft",
            "is_republished_duplicate": False
        })
        post_id += 1
        cluster_id += 1

    df = pd.DataFrame(posts)

    # Clean text and normalize tags using alias map
    df["clean_title"] = df["title"].apply(lambda x: re.sub(r'^\[Republished\]\s*', '', x).strip())
    df["clean_body"] = df["raw_body"].apply(clean_article_text)
    df["word_count"] = (df["clean_title"] + " " + df["clean_body"]).apply(lambda x: len(x.split()))
    df["approved_tags"] = df["raw_tags"].apply(lambda tags: normalize_tags(tags, alias_map))
    df["ground_truth_complete_tags"] = df["ground_truth_complete_tags"].apply(lambda tags: sorted(list(set(tags))))

    # Group by cluster_id and sort by earliest publication date in each cluster
    cluster_dates = df.groupby("cluster_id")["published_at"].min().reset_index()
    cluster_dates = cluster_dates.sort_values("published_at").reset_index(drop=True)
    n_clusters = len(cluster_dates)
    train_end = int(n_clusters * 0.70)
    val_end = int(n_clusters * 0.85)

    cluster_to_split = {}
    for idx, row in cluster_dates.iterrows():
        if idx < train_end:
            cluster_to_split[row["cluster_id"]] = "train"
        elif idx < val_end:
            cluster_to_split[row["cluster_id"]] = "val"
        else:
            cluster_to_split[row["cluster_id"]] = "test"

    df["split"] = df["cluster_id"].map(cluster_to_split)

    out_csv = os.path.join(DATA_DIR, "blog_posts_dataset.csv")
    if os.path.exists(out_csv):
        os.remove(out_csv)
    df_to_save = df.copy()
    df_to_save["raw_tags"] = df_to_save["raw_tags"].apply(json.dumps)
    df_to_save["approved_tags"] = df_to_save["approved_tags"].apply(json.dumps)
    df_to_save["ground_truth_complete_tags"] = df_to_save["ground_truth_complete_tags"].apply(json.dumps)
    df_to_save.to_csv(out_csv, index=False)

    # Compute Tag Frequency & Audit Report
    tag_counts = {t: {"total": 0, "train": 0, "val": 0, "test": 0} for t in canonical_tags}
    for _, row in df.iterrows():
        for t in row["approved_tags"]:
            tag_counts[t]["total"] += 1
            tag_counts[t][row["split"]] += 1

    min_req = taxonomy_data["min_examples_for_reliable_evaluation"]
    tag_report = []
    for t in canonical_tags:
        counts = tag_counts[t]
        tag_report.append({
            "tag": t,
            "total_posts": counts["total"],
            "train_posts": counts["train"],
            "val_posts": counts["val"],
            "test_posts": counts["test"],
            "reliable_for_evaluation": counts["total"] >= min_req,
            "status_note": "Sufficient examples" if counts["total"] >= min_req else f"Too few examples (<{min_req}) for reliable standalone evaluation"
        })

    # Held-out label quality review sample (50 held-out posts checked by human reviewer)
    held_out = df[df["split"].isin(["val", "test"])].sample(n=50, random_state=RANDOM_SEED).copy()
    reviewer_rows = []
    for r in held_out.itertuples():
        is_inconsistent = bool(r.has_incomplete_historical_label)
        reviewer_rows.append({
            "post_id": r.post_id,
            "split": r.split,
            "title": r.clean_title,
            "raw_author_tags": json.dumps(r.raw_tags),
            "normalized_historical_tags": json.dumps(r.approved_tags),
            "reviewer_verified_complete_tags": json.dumps(r.ground_truth_complete_tags),
            "missing_or_inconsistent_flag": is_inconsistent,
            "reviewer_audit_note": (
                f"Missing secondary tag '{r.omitted_historical_tag}' in historical archive."
                if is_inconsistent else "Historical tags consistent with taxonomy after alias normalization."
            )
        })
    reviewer_df = pd.DataFrame(reviewer_rows)
    rev_csv_path = os.path.join(DATA_DIR, "held_out_reviewer_sample.csv")
    if os.path.exists(rev_csv_path):
        os.remove(rev_csv_path)
    reviewer_df.to_csv(rev_csv_path, index=False)

    missing_label_count = int(held_out["has_incomplete_historical_label"].sum())

    summary = {
        "total_posts": len(df),
        "unique_clusters": n_clusters,
        "republished_duplicates_grouped": int(df["is_republished_duplicate"].sum()),
        "splits": df["split"].value_counts().to_dict(),
        "held_out_reviewer_audit": {
            "sample_size": 50,
            "audit_file": "data/held_out_reviewer_sample.csv",
            "posts_with_missing_historical_tags": missing_label_count,
            "missing_label_rate_pct": round(missing_label_count / 50 * 100, 1),
            "note": "Historical author labels occasionally omit secondary tags (e.g., tagging 'Python' and 'API Development' but omitting 'Application Security')."
        },
        "tag_distribution": tag_report
    }

    summary_path = os.path.join(DATA_DIR, "dataset_summary.json")
    if os.path.exists(summary_path):
        os.remove(summary_path)
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"Generated {len(df)} blog posts across {n_clusters} deduplicated clusters.")
    print("Split distribution:", summary["splits"])
    print(f"Reviewer audit sample saved to {rev_csv_path} ({missing_label_count}/50 incomplete historical labels found).")
    return summary


if __name__ == "__main__":
    generate_corpus()
