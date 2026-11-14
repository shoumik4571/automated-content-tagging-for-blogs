// Auto-generated embedded state & client-side multi-label fallback engine
// Enables 100% standalone operation on cloud deployments (Vercel / GitHub Pages)
// when local FastAPI (127.0.0.1:8000) is not running.

export const OFFLINE_APP_STATE: any = {
  "taxonomy": {
    "approved_tags": [
      {
        "tag": "Python",
        "definition": "Articles focusing on the Python programming language, standard library, packaging, typing, and core language idioms.",
        "examples": [
          "Mastering Python Generators and Iterators",
          "Understanding Asyncio and Concurrency in Python 3"
        ],
        "aliases": [
          "python3",
          "py",
          "cpython",
          "python-programming",
          "pythonic",
          "pip",
          "virtualenv"
        ]
      },
      {
        "tag": "Machine Learning",
        "definition": "Posts covering supervised and unsupervised learning algorithms, feature engineering, model evaluation, and tabular ML.",
        "examples": [
          "Tuning Gradient Boosted Trees for Tabular Data",
          "Cross-Validation Strategies for Imbalanced Datasets"
        ],
        "aliases": [
          "ml",
          "machine-learning",
          "scikit-learn",
          "sklearn",
          "xgboost",
          "random-forest",
          "supervised-learning",
          "predictive-modeling"
        ]
      },
      {
        "tag": "Deep Learning",
        "definition": "Content about neural networks, transformers, CNNs, RNNs, embeddings, PyTorch, TensorFlow, and representation learning.",
        "examples": [
          "Fine-Tuning Sentence Transformers for Semantic Search",
          "Training Convolutional Neural Networks with PyTorch"
        ],
        "aliases": [
          "dl",
          "deep-learning",
          "neural-networks",
          "pytorch",
          "tensorflow",
          "transformers",
          "bert",
          "embeddings",
          "llm"
        ]
      },
      {
        "tag": "API Development",
        "definition": "Designing, building, documenting, and testing web APIs including REST, GraphQL, FastAPI, Flask, and webhook integrations.",
        "examples": [
          "Building High-Performance REST APIs with FastAPI",
          "Idempotency and Pagination Patterns in Web APIs"
        ],
        "aliases": [
          "api",
          "rest-api",
          "restful",
          "fastapi",
          "flask",
          "graphql",
          "endpoints",
          "openapi",
          "swagger",
          "microservices"
        ]
      },
      {
        "tag": "Application Security",
        "definition": "Securing web applications and APIs against vulnerabilities, authentication, OAuth2, JWT, encryption, and OWASP best practices.",
        "examples": [
          "Hardening OAuth2 and JWT Authentication in Production",
          "Preventing SQL Injection and XSS in Modern Web Apps"
        ],
        "aliases": [
          "appsec",
          "security",
          "cybersecurity",
          "infosec",
          "oauth",
          "jwt",
          "authentication",
          "owasp",
          "encryption",
          "vulnerability"
        ]
      },
      {
        "tag": "Data Engineering",
        "definition": "Data pipelines, ETL/ELT workflows, data warehouses, streaming architectures, Spark, Airflow, and SQL optimization.",
        "examples": [
          "Orchestrating Incremental ETL Pipelines with Apache Airflow",
          "Optimizing Partitioning and Indexing in PostgreSQL"
        ],
        "aliases": [
          "data-pipelines",
          "etl",
          "elt",
          "airflow",
          "spark",
          "sql",
          "postgresql",
          "data-warehouse",
          "kafka",
          "dbt"
        ]
      },
      {
        "tag": "Cloud & DevOps",
        "definition": "Containerization, CI/CD pipelines, Kubernetes, Docker, infrastructure as code, cloud deployment, and observability.",
        "examples": [
          "Zero-Downtime Deployments with Docker and Kubernetes",
          "Automating CI/CD Workflows with GitHub Actions"
        ],
        "aliases": [
          "devops",
          "cloud",
          "docker",
          "kubernetes",
          "k8s",
          "ci-cd",
          "aws",
          "terraform",
          "containers",
          "monitoring"
        ]
      },
      {
        "tag": "Frontend Web Development",
        "definition": "Browser-side engineering including React, TypeScript, CSS architecture, state management, accessibility, and web performance.",
        "examples": [
          "Optimizing React Rendering Performance with Memoization",
          "Accessible Design Systems with Modern CSS Grid"
        ],
        "aliases": [
          "frontend",
          "front-end",
          "react",
          "javascript",
          "typescript",
          "css",
          "html",
          "ui",
          "web-perf",
          "dom"
        ]
      },
      {
        "tag": "MLOps",
        "definition": "Deploying, monitoring, versioning, and governing machine learning models in production environments.",
        "examples": [
          "Detecting Data Drift and Concept Drift in Production ML",
          "Model Registry and Serving Patterns with MLflow"
        ],
        "aliases": [
          "ml-ops",
          "model-deployment",
          "model-monitoring",
          "mlflow",
          "feature-store",
          "data-drift",
          "model-serving"
        ]
      },
      {
        "tag": "Natural Language Processing",
        "definition": "Text processing, tokenization, sentiment analysis, named entity recognition, topic modeling, and text classification.",
        "examples": [
          "Multi-Label Text Classification with TF-IDF and Logistic Regression",
          "Building Domain-Specific Named Entity Recognition Pipelines"
        ],
        "aliases": [
          "nlp",
          "text-mining",
          "tokenization",
          "sentiment-analysis",
          "ner",
          "text-classification",
          "spacy",
          "tfidf"
        ]
      },
      {
        "tag": "Quantum Computing",
        "definition": "Niche topic covering quantum gates, qubits, Qiskit, quantum annealing, and variational quantum eigensolvers.",
        "examples": [
          "Simulating Bell States and Quantum Teleportation with Qiskit"
        ],
        "aliases": [
          "quantum",
          "qubits",
          "qiskit"
        ]
      },
      {
        "tag": "WebAssembly",
        "definition": "Niche topic covering Wasm bytecode, Rust-to-Wasm compilation, and near-native execution in the browser.",
        "examples": [
          "Compiling Rust Image Filters to WebAssembly"
        ],
        "aliases": [
          "wasm",
          "web-assembly"
        ]
      }
    ],
    "min_examples_for_reliable_evaluation": 15
  },
  "canonical_tags": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "API Development",
    "Application Security",
    "Data Engineering",
    "Cloud & DevOps",
    "Frontend Web Development",
    "MLOps",
    "Natural Language Processing",
    "Quantum Computing",
    "WebAssembly"
  ],
  "dataset_summary": {
    "total_posts": 500,
    "unique_clusters": 468,
    "republished_duplicates_grouped": 32,
    "splits": {
      "train": 350,
      "val": 75,
      "test": 75
    },
    "held_out_reviewer_audit": {
      "sample_size": 50,
      "audit_file": "data/held_out_reviewer_sample.csv",
      "posts_with_missing_historical_tags": 3,
      "missing_label_rate_pct": 6.0,
      "note": "Historical author labels occasionally omit secondary tags (e.g., tagging 'Python' and 'API Development' but omitting 'Application Security')."
    },
    "tag_distribution": [
      {
        "tag": "Python",
        "total_posts": 151,
        "train_posts": 98,
        "val_posts": 26,
        "test_posts": 27,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Machine Learning",
        "total_posts": 116,
        "train_posts": 79,
        "val_posts": 18,
        "test_posts": 19,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Deep Learning",
        "total_posts": 63,
        "train_posts": 47,
        "val_posts": 9,
        "test_posts": 7,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "API Development",
        "total_posts": 99,
        "train_posts": 73,
        "val_posts": 15,
        "test_posts": 11,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Application Security",
        "total_posts": 76,
        "train_posts": 57,
        "val_posts": 11,
        "test_posts": 8,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Data Engineering",
        "total_posts": 90,
        "train_posts": 65,
        "val_posts": 11,
        "test_posts": 14,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Cloud & DevOps",
        "total_posts": 87,
        "train_posts": 62,
        "val_posts": 12,
        "test_posts": 13,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Frontend Web Development",
        "total_posts": 67,
        "train_posts": 48,
        "val_posts": 8,
        "test_posts": 11,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "MLOps",
        "total_posts": 60,
        "train_posts": 40,
        "val_posts": 9,
        "test_posts": 11,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Natural Language Processing",
        "total_posts": 82,
        "train_posts": 58,
        "val_posts": 14,
        "test_posts": 10,
        "reliable_for_evaluation": true,
        "status_note": "Sufficient examples"
      },
      {
        "tag": "Quantum Computing",
        "total_posts": 8,
        "train_posts": 5,
        "val_posts": 2,
        "test_posts": 1,
        "reliable_for_evaluation": false,
        "status_note": "Too few examples (<15) for reliable standalone evaluation"
      },
      {
        "tag": "WebAssembly",
        "total_posts": 8,
        "train_posts": 5,
        "val_posts": 2,
        "test_posts": 1,
        "reliable_for_evaluation": false,
        "status_note": "Too few examples (<15) for reliable standalone evaluation"
      }
    ]
  },
  "evaluation_metrics": {
    "title_weighting_ablation": {
      "val_micro_f1_title_1x": 0.9611,
      "val_micro_f1_title_2x": 0.9714,
      "val_macro_f1_title_1x": 0.9716,
      "val_macro_f1_title_2x": 0.9782,
      "improvement_delta_micro": 0.0103,
      "conclusion": "Giving blog titles 2x weight improves validation Micro-F1 and Macro-F1 because article bodies often include incidental comparisons to other tools, whereas titles anchor the primary subjects."
    },
    "best_global_threshold": 0.55,
    "per_tag_thresholds": {
      "Python": {
        "threshold": 0.35,
        "val_support": 26,
        "tuned": true
      },
      "Machine Learning": {
        "threshold": 0.35,
        "val_support": 18,
        "tuned": true
      },
      "Deep Learning": {
        "threshold": 0.35,
        "val_support": 9,
        "tuned": true
      },
      "API Development": {
        "threshold": 0.55,
        "val_support": 15,
        "tuned": true
      },
      "Application Security": {
        "threshold": 0.3,
        "val_support": 11,
        "tuned": true
      },
      "Data Engineering": {
        "threshold": 0.6,
        "val_support": 11,
        "tuned": true
      },
      "Cloud & DevOps": {
        "threshold": 0.7,
        "val_support": 12,
        "tuned": true
      },
      "Frontend Web Development": {
        "threshold": 0.3,
        "val_support": 8,
        "tuned": true
      },
      "MLOps": {
        "threshold": 0.35,
        "val_support": 9,
        "tuned": true
      },
      "Natural Language Processing": {
        "threshold": 0.5,
        "val_support": 14,
        "tuned": true
      },
      "Quantum Computing": {
        "threshold": 0.55,
        "val_support": 2,
        "tuned": false
      },
      "WebAssembly": {
        "threshold": 0.55,
        "val_support": 2,
        "tuned": false
      }
    },
    "threshold_sweep": [
      {
        "threshold": 0.25,
        "val_micro_f1": 0.8831,
        "val_macro_f1": 0.9019,
        "false_positives": 35,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.3,
        "val_micro_f1": 0.9283,
        "val_macro_f1": 0.9423,
        "false_positives": 20,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.35,
        "val_micro_f1": 0.9577,
        "val_macro_f1": 0.9672,
        "false_positives": 11,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.4,
        "val_micro_f1": 0.9611,
        "val_macro_f1": 0.9701,
        "false_positives": 10,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.45,
        "val_micro_f1": 0.9645,
        "val_macro_f1": 0.9732,
        "false_positives": 9,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.5,
        "val_micro_f1": 0.9714,
        "val_macro_f1": 0.9782,
        "false_positives": 7,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.55,
        "val_micro_f1": 0.9749,
        "val_macro_f1": 0.9807,
        "false_positives": 6,
        "missed_tags_fn": 1,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.6,
        "val_micro_f1": 0.9747,
        "val_macro_f1": 0.9813,
        "false_positives": 5,
        "missed_tags_fn": 2,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.65,
        "val_micro_f1": 0.9745,
        "val_macro_f1": 0.9808,
        "false_positives": 4,
        "missed_tags_fn": 3,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.7,
        "val_micro_f1": 0.9706,
        "val_macro_f1": 0.9781,
        "false_positives": 3,
        "missed_tags_fn": 5,
        "no_tag_above_threshold_pct": 1.3,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 2.7
      },
      {
        "threshold": 0.75,
        "val_micro_f1": 0.9394,
        "val_macro_f1": 0.9491,
        "false_positives": 3,
        "missed_tags_fn": 13,
        "no_tag_above_threshold_pct": 4.0,
        "short_draft_pct": 2.7,
        "routed_to_editor_review_pct": 4.0
      }
    ],
    "test_model_comparison": [
      {
        "model": "Keyword & Alias Matcher (Baseline)",
        "micro_f1": 0.7532,
        "macro_f1": 0.7982,
        "verified_complete_micro_f1": 0.7601,
        "precision_at_3": 0.5289,
        "recall_at_3": 0.9067,
        "auto_tagged_coverage_pct": 86.7,
        "routed_to_review_pct": 13.3,
        "inference_ms_per_post": 0.4
      },
      {
        "model": "TF-IDF + OvR LogReg (Title 1x)",
        "micro_f1": 0.9195,
        "macro_f1": 0.9228,
        "verified_complete_micro_f1": 0.9398,
        "precision_at_3": 0.5867,
        "recall_at_3": 0.9867,
        "auto_tagged_coverage_pct": 86.7,
        "routed_to_review_pct": 13.3,
        "inference_ms_per_post": 0.12
      },
      {
        "model": "TF-IDF + OvR LogReg (Title 2x)",
        "micro_f1": 0.9425,
        "macro_f1": 0.943,
        "verified_complete_micro_f1": 0.9624,
        "precision_at_3": 0.5867,
        "recall_at_3": 0.9933,
        "auto_tagged_coverage_pct": 86.7,
        "routed_to_review_pct": 13.3,
        "inference_ms_per_post": 0.13
      },
      {
        "model": "TF-IDF + OvR LogReg (Title 2x + Per-Tag Thresholds)",
        "micro_f1": 0.9283,
        "macro_f1": 0.9315,
        "verified_complete_micro_f1": 0.9481,
        "precision_at_3": 0.5867,
        "recall_at_3": 0.9933,
        "auto_tagged_coverage_pct": 86.7,
        "routed_to_review_pct": 13.3,
        "inference_ms_per_post": 0.13
      },
      {
        "model": "Sentence-Transformer (all-MiniLM-L6-v2) + Chunking",
        "micro_f1": 0.9407,
        "macro_f1": 0.946,
        "verified_complete_micro_f1": 0.96,
        "precision_at_3": 0.5911,
        "recall_at_3": 1.0,
        "auto_tagged_coverage_pct": 85.3,
        "routed_to_review_pct": 14.7,
        "inference_ms_per_post": 13.05
      }
    ],
    "frequency_tier_summary": [
      {
        "frequency_tier": "High Frequency (>=90 posts)",
        "num_tags": 4,
        "tags_included": [
          "Python",
          "Machine Learning",
          "API Development",
          "Data Engineering"
        ],
        "mean_tfidf_f1": 0.9364,
        "mean_sbert_f1": 0.9295
      },
      {
        "frequency_tier": "Low/Niche (<15 posts)",
        "num_tags": 2,
        "tags_included": [
          "Quantum Computing",
          "WebAssembly"
        ],
        "mean_tfidf_f1": 1.0,
        "mean_sbert_f1": 1.0
      },
      {
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "num_tags": 6,
        "tags_included": [
          "Deep Learning",
          "Application Security",
          "Cloud & DevOps",
          "Frontend Web Development",
          "MLOps",
          "Natural Language Processing"
        ],
        "mean_tfidf_f1": 0.9054,
        "mean_sbert_f1": 0.9391
      }
    ],
    "per_tag_metrics": [
      {
        "tag": "Python",
        "total_corpus_posts": 151,
        "test_support": 27,
        "frequency_tier": "High Frequency (>=90 posts)",
        "tuned_threshold": 0.35,
        "tfidf_precision": 0.963,
        "tfidf_recall": 0.963,
        "tfidf_f1": 0.963,
        "semantic_sbert_f1": 0.9455
      },
      {
        "tag": "Machine Learning",
        "total_corpus_posts": 116,
        "test_support": 19,
        "frequency_tier": "High Frequency (>=90 posts)",
        "tuned_threshold": 0.35,
        "tfidf_precision": 0.9048,
        "tfidf_recall": 1.0,
        "tfidf_f1": 0.95,
        "semantic_sbert_f1": 0.9744
      },
      {
        "tag": "Deep Learning",
        "total_corpus_posts": 63,
        "test_support": 7,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.35,
        "tfidf_precision": 1.0,
        "tfidf_recall": 0.8571,
        "tfidf_f1": 0.9231,
        "semantic_sbert_f1": 0.9333
      },
      {
        "tag": "API Development",
        "total_corpus_posts": 99,
        "test_support": 11,
        "frequency_tier": "High Frequency (>=90 posts)",
        "tuned_threshold": 0.55,
        "tfidf_precision": 0.8333,
        "tfidf_recall": 0.9091,
        "tfidf_f1": 0.8696,
        "semantic_sbert_f1": 0.8696
      },
      {
        "tag": "Application Security",
        "total_corpus_posts": 76,
        "test_support": 8,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.3,
        "tfidf_precision": 0.8,
        "tfidf_recall": 1.0,
        "tfidf_f1": 0.8889,
        "semantic_sbert_f1": 0.8889
      },
      {
        "tag": "Data Engineering",
        "total_corpus_posts": 90,
        "test_support": 14,
        "frequency_tier": "High Frequency (>=90 posts)",
        "tuned_threshold": 0.6,
        "tfidf_precision": 1.0,
        "tfidf_recall": 0.9286,
        "tfidf_f1": 0.963,
        "semantic_sbert_f1": 0.9286
      },
      {
        "tag": "Cloud & DevOps",
        "total_corpus_posts": 87,
        "test_support": 13,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.7,
        "tfidf_precision": 1.0,
        "tfidf_recall": 0.7692,
        "tfidf_f1": 0.8696,
        "semantic_sbert_f1": 0.96
      },
      {
        "tag": "Frontend Web Development",
        "total_corpus_posts": 67,
        "test_support": 11,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.3,
        "tfidf_precision": 0.9167,
        "tfidf_recall": 1.0,
        "tfidf_f1": 0.9565,
        "semantic_sbert_f1": 1.0
      },
      {
        "tag": "MLOps",
        "total_corpus_posts": 60,
        "test_support": 11,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.35,
        "tfidf_precision": 1.0,
        "tfidf_recall": 0.9091,
        "tfidf_f1": 0.9524,
        "semantic_sbert_f1": 0.9524
      },
      {
        "tag": "Natural Language Processing",
        "total_corpus_posts": 82,
        "test_support": 10,
        "frequency_tier": "Medium Frequency (15-89 posts)",
        "tuned_threshold": 0.5,
        "tfidf_precision": 0.8889,
        "tfidf_recall": 0.8,
        "tfidf_f1": 0.8421,
        "semantic_sbert_f1": 0.9
      },
      {
        "tag": "Quantum Computing",
        "total_corpus_posts": 8,
        "test_support": 1,
        "frequency_tier": "Low/Niche (<15 posts)",
        "tuned_threshold": 0.55,
        "tfidf_precision": 1.0,
        "tfidf_recall": 1.0,
        "tfidf_f1": 1.0,
        "semantic_sbert_f1": 1.0
      },
      {
        "tag": "WebAssembly",
        "total_corpus_posts": 8,
        "test_support": 1,
        "frequency_tier": "Low/Niche (<15 posts)",
        "tuned_threshold": 0.55,
        "tfidf_precision": 1.0,
        "tfidf_recall": 1.0,
        "tfidf_f1": 1.0,
        "semantic_sbert_f1": 1.0
      }
    ]
  },
  "batch_predictions": [
    {
      "post_id": "POST-1408",
      "published_at": "2025-12-09",
      "title": "Hyperparameter Optimization and Calibration for Predictive Models with MLOps and Cloud & DevOps",
      "post_type": "standard",
      "word_count": 170,
      "historical_author_tags": [
        "Cloud & DevOps",
        "MLOps",
        "Machine Learning"
      ],
      "suggested_tags": [
        "MLOps",
        "Machine Learning",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "MLOps": 0.975,
        "Machine Learning": 0.943,
        "Cloud & DevOps": 0.912
      },
      "supporting_snippets": {
        "MLOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets.",
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "MLOps",
        "Machine Learning",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1410",
      "published_at": "2025-12-10",
      "title": "Streaming Event Architectures with Apache Kafka and Spark: Infrastructure as Code Using Terraform Modules on AWS",
      "post_type": "standard",
      "word_count": 133,
      "historical_author_tags": [
        "Cloud & DevOps",
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Data Engineering": 0.94,
        "Cloud & DevOps": 0.933
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Cloud & DevOps": "Kubernetes deployments use readiness and liveness probes to route traffic only to healthy pods."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1411",
      "published_at": "2025-12-11",
      "title": "Type-Safe Custom Hooks and Context Architecture in TypeScript: Comparing RESTful Endpoints and GraphQL Resolvers",
      "post_type": "standard",
      "word_count": 130,
      "historical_author_tags": [
        "API Development",
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "API Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.963,
        "API Development": 0.907
      },
      "supporting_snippets": {
        "Frontend Web Development": "TypeScript strict mode catches null pointer errors across complex frontend UI component trees.",
        "API Development": "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development",
        "API Development"
      ]
    },
    {
      "post_id": "POST-1412",
      "published_at": "2025-12-12",
      "title": "Memory Management and Garbage Collection in CPython",
      "post_type": "standard",
      "word_count": 89,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [
        "Python"
      ],
      "model_scores": {
        "Python": 0.99
      },
      "supporting_snippets": {
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python"
      ]
    },
    {
      "post_id": "POST-1413",
      "published_at": "2025-12-13",
      "title": "Packaging Python Libraries with pyproject.toml and Virtualenv: Cursor Pagination and Rate Limiting in Web APIs",
      "post_type": "long_multi_topic",
      "word_count": 248,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "API Development"
      ],
      "model_scores": {
        "Python": 0.98,
        "API Development": 0.935
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "API Development": "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development",
        "Python"
      ]
    },
    {
      "post_id": "POST-1414",
      "published_at": "2025-12-14",
      "title": "Cross-Validation Strategies for Imbalanced Classification with MLOps and Cloud & DevOps",
      "post_type": "standard",
      "word_count": 167,
      "historical_author_tags": [
        "Cloud & DevOps",
        "MLOps",
        "Machine Learning"
      ],
      "suggested_tags": [
        "Machine Learning",
        "MLOps",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Machine Learning": 0.955,
        "MLOps": 0.948,
        "Cloud & DevOps": 0.866
      },
      "supporting_snippets": {
        "Machine Learning": "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry.",
        "MLOps": "Feature stores guarantee that online inference uses the exact same transformations as offline training.",
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "MLOps",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1415",
      "published_at": "2025-12-15",
      "title": "Optimizing React Rendering Performance and State Management",
      "post_type": "standard",
      "word_count": 83,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.955
      },
      "supporting_snippets": {
        "Frontend Web Development": "Semantic HTML elements and ARIA attributes ensure keyboard navigation accessibility."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1416",
      "published_at": "2025-12-16",
      "title": "Mastering Python Generators and Async Iterators with API Development and Application Security",
      "post_type": "standard",
      "word_count": 189,
      "historical_author_tags": [
        "API Development",
        "Application Security",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "API Development",
        "Application Security"
      ],
      "model_scores": {
        "Python": 0.977,
        "API Development": 0.906,
        "Application Security": 0.682
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "API Development": "RESTful endpoints use standard HTTP status codes and cursor based pagination for large collections.",
        "Application Security": "OWASP security guidelines recommend strict Content Security Policy headers to mitigate XSS attacks."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "API Development",
        "Application Security"
      ]
    },
    {
      "post_id": "POST-1417",
      "published_at": "2025-12-17",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses: Text Normalization, Lemmatization, and Stopword Filtering",
      "post_type": "semantic_paraphrase",
      "word_count": 130,
      "historical_author_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "suggested_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "model_scores": {
        "Natural Language Processing": 0.931,
        "Python": 0.857
      },
      "supporting_snippets": {
        "Natural Language Processing": "Subword tokenization handles rare morphological variants and out of vocabulary technical terms.",
        "Python": "Scikit learn pipelines prevent data leakage during k fold cross validation and scaling."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Natural Language Processing",
        "Python"
      ]
    },
    {
      "post_id": "POST-1418",
      "published_at": "2025-12-18",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing",
      "post_type": "standard",
      "word_count": 92,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [
        "Python"
      ],
      "model_scores": {
        "Python": 0.995
      },
      "supporting_snippets": {
        "Python": "Type hints with typing and mypy help catch bugs before runtime in large Python codebases."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python"
      ]
    },
    {
      "post_id": "POST-1419",
      "published_at": "2025-12-18",
      "title": "Comparing Random Forests and Logistic Regression Baselines with MLOps and Cloud & DevOps",
      "post_type": "standard",
      "word_count": 168,
      "historical_author_tags": [
        "Cloud & DevOps",
        "MLOps",
        "Machine Learning"
      ],
      "suggested_tags": [
        "Machine Learning",
        "MLOps",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Machine Learning": 0.974,
        "MLOps": 0.973,
        "Cloud & DevOps": 0.962
      },
      "supporting_snippets": {
        "Machine Learning": "Feature importance and permutation tests reveal which predictors drive random forest splits.",
        "MLOps": "Champion challenger model routing compares live business KPIs before promoting new serialized artifacts to production.",
        "Cloud & DevOps": "Kubernetes deployments use readiness and liveness probes to route traffic only to healthy pods."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "MLOps",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1420",
      "published_at": "2025-12-19",
      "title": "Orchestrating Incremental ETL Pipelines with Apache Airflow: Feature Engineering and Selection with Scikit-Learn Pipelines",
      "post_type": "long_multi_topic",
      "word_count": 227,
      "historical_author_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "model_scores": {
        "Data Engineering": 0.912,
        "Machine Learning": 0.687
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1421",
      "published_at": "2025-12-24",
      "title": "Orchestrating Incremental ETL Pipelines with Apache Airflow: Feature Engineering and Selection with Scikit-Learn Pipelines",
      "post_type": "republished_duplicate",
      "word_count": 233,
      "historical_author_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "model_scores": {
        "Data Engineering": 0.908,
        "Machine Learning": 0.686
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1422",
      "published_at": "2025-12-20",
      "title": "Cross-Validation Strategies for Imbalanced Classification",
      "post_type": "semantic_paraphrase",
      "word_count": 86,
      "historical_author_tags": [
        "Machine Learning"
      ],
      "suggested_tags": [
        "Machine Learning"
      ],
      "model_scores": {
        "Machine Learning": 0.976
      },
      "supporting_snippets": {
        "Machine Learning": "Feature importance and permutation tests reveal which predictors drive random forest splits."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1423",
      "published_at": "2025-12-21",
      "title": "Memory Management and Garbage Collection in CPython: Tuning Gradient Boosted Trees and XGBoost on Tabular Data",
      "post_type": "standard",
      "word_count": 141,
      "historical_author_tags": [
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Machine Learning"
      ],
      "model_scores": {
        "Python": 0.92,
        "Machine Learning": 0.902
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Machine Learning": "Feature importance and permutation tests reveal which predictors drive random forest splits."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1424",
      "published_at": "2025-12-22",
      "title": "Context Managers and Decorators in Modern Python 3: Streaming Event Architectures with Apache Kafka and Spark",
      "post_type": "standard",
      "word_count": 141,
      "historical_author_tags": [
        "Data Engineering",
        "Python"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Python"
      ],
      "model_scores": {
        "Data Engineering": 0.903,
        "Python": 0.892
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Python"
      ]
    },
    {
      "post_id": "POST-1425",
      "published_at": "2025-12-23",
      "title": "Feature Stores for Online and Offline Training Consistency",
      "post_type": "standard",
      "word_count": 87,
      "historical_author_tags": [
        "MLOps"
      ],
      "suggested_tags": [],
      "model_scores": {},
      "supporting_snippets": {},
      "review_status": "Needs Editor Review (Low Confidence < Threshold)",
      "final_editor_approved_tags": [
        "MLOps"
      ]
    },
    {
      "post_id": "POST-1426",
      "published_at": "2025-12-24",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses: Cursor Pagination and Rate Limiting in Web APIs",
      "post_type": "semantic_paraphrase",
      "word_count": 139,
      "historical_author_tags": [
        "API Development",
        "Python"
      ],
      "suggested_tags": [
        "API Development",
        "Python"
      ],
      "model_scores": {
        "API Development": 0.919,
        "Python": 0.915
      },
      "supporting_snippets": {
        "API Development": "Swagger UI interactive documentation helps teams integrate with backend API routes.",
        "Python": "Multi stage Dockerfiles strip build dependencies to produce lightweight, secure container images."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development",
        "Python"
      ]
    },
    {
      "post_id": "POST-1427",
      "published_at": "2025-12-25",
      "title": "Packaging Python Libraries with pyproject.toml and Virtualenv: Data Warehouse Modeling with dbt and Dimensional Schemas",
      "post_type": "standard",
      "word_count": 136,
      "historical_author_tags": [
        "Data Engineering",
        "Python"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Python"
      ],
      "model_scores": {
        "Data Engineering": 0.931,
        "Python": 0.866
      },
      "supporting_snippets": {
        "Data Engineering": "Kafka event streams decouple data producers from downstream data warehouse consumers.",
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Python"
      ]
    },
    {
      "post_id": "POST-1428",
      "published_at": "2025-12-26",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing",
      "post_type": "standard",
      "word_count": 89,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Data Engineering"
      ],
      "model_scores": {
        "Python": 0.99,
        "Data Engineering": 0.428
      },
      "supporting_snippets": {
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds.",
        "Data Engineering": "Apache Spark processes partitioned Parquet files across distributed clusters for petabyte scale ETL."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1429",
      "published_at": "2025-12-27",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing: Idempotent Backfills in Distributed Data Pipelines",
      "post_type": "standard",
      "word_count": 134,
      "historical_author_tags": [
        "Data Engineering",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Data Engineering"
      ],
      "model_scores": {
        "Python": 0.949,
        "Data Engineering": 0.927
      },
      "supporting_snippets": {
        "Python": "Type hints with typing and mypy help catch bugs before runtime in large Python codebases.",
        "Data Engineering": "Kafka event streams decouple data producers from downstream data warehouse consumers."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1430",
      "published_at": "2025-12-27",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing: Cross-Validation Strategies for Imbalanced Classification",
      "post_type": "semantic_paraphrase",
      "word_count": 120,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [
        "Machine Learning",
        "Python"
      ],
      "model_scores": {
        "Machine Learning": 0.953,
        "Python": 0.903
      },
      "supporting_snippets": {
        "Machine Learning": "Lazy evaluation via iterator protocols allows functions to yield one item at a time without allocating full lists in RAM.",
        "Python": "Automated retraining pipelines trigger when validation scores degrade on recent labeled feedback."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "Python"
      ]
    },
    {
      "post_id": "POST-1431",
      "published_at": "2025-12-28",
      "title": "Comparing RESTful Endpoints and GraphQL Resolvers",
      "post_type": "standard",
      "word_count": 81,
      "historical_author_tags": [
        "API Development"
      ],
      "suggested_tags": [
        "API Development"
      ],
      "model_scores": {
        "API Development": 0.97
      },
      "supporting_snippets": {
        "API Development": "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development"
      ]
    },
    {
      "post_id": "POST-1432",
      "published_at": "2025-12-29",
      "title": "Cross-Validation Strategies for Imbalanced Classification with Deep Learning and Natural Language Processing",
      "post_type": "standard",
      "word_count": 169,
      "historical_author_tags": [
        "Deep Learning",
        "Machine Learning",
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ],
      "model_scores": {
        "Machine Learning": 0.968,
        "Deep Learning": 0.933,
        "Natural Language Processing": 0.907
      },
      "supporting_snippets": {
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets.",
        "Deep Learning": "PyTorch autograd builds dynamic computation graphs for backpropagation through neural networks.",
        "Natural Language Processing": "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1433",
      "published_at": "2025-12-30",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing: Hyperparameter Optimization and Calibration for Predictive Models",
      "post_type": "standard",
      "word_count": 137,
      "historical_author_tags": [
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Machine Learning"
      ],
      "model_scores": {
        "Python": 0.938,
        "Machine Learning": 0.872
      },
      "supporting_snippets": {
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1434",
      "published_at": "2025-12-31",
      "title": "Core Web Vitals and Bundle Splitting in Modern JavaScript",
      "post_type": "semantic_paraphrase",
      "word_count": 83,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.968
      },
      "supporting_snippets": {
        "Frontend Web Development": "CI/CD pipelines run automated linters, unit tests, and container scans on every pull request."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1435",
      "published_at": "2026-01-01",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses with Machine Learning and MLOps",
      "post_type": "long_multi_topic",
      "word_count": 348,
      "historical_author_tags": [
        "MLOps",
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Machine Learning",
        "MLOps"
      ],
      "model_scores": {
        "Python": 0.966,
        "Machine Learning": 0.901,
        "MLOps": 0.878
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Machine Learning": "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry.",
        "MLOps": "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Machine Learning",
        "MLOps"
      ]
    },
    {
      "post_id": "POST-1436",
      "published_at": "2026-01-03",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses with Machine Learning and MLOps",
      "post_type": "republished_duplicate",
      "word_count": 354,
      "historical_author_tags": [
        "MLOps",
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Machine Learning",
        "MLOps"
      ],
      "model_scores": {
        "Python": 0.966,
        "Machine Learning": 0.902,
        "MLOps": 0.88
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Machine Learning": "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry.",
        "MLOps": "MLflow tracks model hyperparameters, evaluation artifacts, and serialized weights in a central registry."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Machine Learning",
        "MLOps"
      ]
    },
    {
      "post_id": "POST-1437",
      "published_at": "2026-01-02",
      "title": "Data Warehouse Modeling with dbt and Dimensional Schemas: Multi-Stage Docker Builds for Minimal Production Images",
      "post_type": "standard",
      "word_count": 133,
      "historical_author_tags": [
        "Cloud & DevOps",
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Data Engineering": 0.902,
        "Cloud & DevOps": 0.89
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1438",
      "published_at": "2026-01-03",
      "title": "Hardening OAuth2 and JWT Authentication Flows",
      "post_type": "standard",
      "word_count": 82,
      "historical_author_tags": [
        "Application Security"
      ],
      "suggested_tags": [
        "Application Security"
      ],
      "model_scores": {
        "Application Security": 0.932
      },
      "supporting_snippets": {
        "Application Security": "OAuth2 authorization code flows with PKCE protect access tokens in public web and mobile clients."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Application Security"
      ]
    },
    {
      "post_id": "POST-1439",
      "published_at": "2026-01-04",
      "title": "Optimizing React Rendering Performance and State Management: Cursor Pagination and Rate Limiting in Web APIs",
      "post_type": "semantic_paraphrase",
      "word_count": 137,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "API Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.891,
        "API Development": 0.685
      },
      "supporting_snippets": {
        "Frontend Web Development": "Virtual DOM reconciliation diffs component subtrees to minimize expensive browser layout and paint cycles.",
        "API Development": "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development",
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1440",
      "published_at": "2026-01-05",
      "title": "Handling Missing Values and Leakage in Supervised Learning with MLOps and Cloud & DevOps",
      "post_type": "standard",
      "word_count": 174,
      "historical_author_tags": [
        "Cloud & DevOps",
        "MLOps",
        "Machine Learning"
      ],
      "suggested_tags": [
        "MLOps",
        "Machine Learning",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "MLOps": 0.982,
        "Machine Learning": 0.978,
        "Cloud & DevOps": 0.841
      },
      "supporting_snippets": {
        "MLOps": "Feature stores guarantee that online inference uses the exact same transformations as offline training.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets.",
        "Cloud & DevOps": "Declarative infrastructure provisioning eliminates configuration drift across staging and production cloud regions."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "MLOps",
        "Machine Learning",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1441",
      "published_at": "2026-01-05",
      "title": "Feature Engineering and Selection with Scikit-Learn Pipelines",
      "post_type": "standard",
      "word_count": 78,
      "historical_author_tags": [
        "Machine Learning"
      ],
      "suggested_tags": [
        "Machine Learning"
      ],
      "model_scores": {
        "Machine Learning": 0.934
      },
      "supporting_snippets": {
        "Machine Learning": "Feature importance and permutation tests reveal which predictors drive random forest splits."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1442",
      "published_at": "2026-01-06",
      "title": "Core Web Vitals and Bundle Splitting in Modern JavaScript: Hardening OAuth2 and JWT Authentication Flows",
      "post_type": "standard",
      "word_count": 133,
      "historical_author_tags": [
        "Application Security",
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "Application Security"
      ],
      "model_scores": {
        "Frontend Web Development": 0.928,
        "Application Security": 0.775
      },
      "supporting_snippets": {
        "Frontend Web Development": "React memoization hooks prevent unnecessary DOM re renders when parent component state updates.",
        "Application Security": "JSON Web Tokens (JWT) must be verified with strong cryptographic signatures and short expiration times."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development",
        "Application Security"
      ]
    },
    {
      "post_id": "POST-1443",
      "published_at": "2026-01-07",
      "title": "Context Managers and Decorators in Modern Python 3: Idempotent Backfills in Distributed Data Pipelines",
      "post_type": "long_multi_topic",
      "word_count": 242,
      "historical_author_tags": [
        "Data Engineering",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Data Engineering"
      ],
      "model_scores": {
        "Python": 0.954,
        "Data Engineering": 0.947
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1444",
      "published_at": "2026-01-08",
      "title": "Idempotent Backfills in Distributed Data Pipelines",
      "post_type": "standard",
      "word_count": 86,
      "historical_author_tags": [
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering"
      ],
      "model_scores": {
        "Data Engineering": 0.981
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1445",
      "published_at": "2026-01-09",
      "title": "Optimizing React Rendering Performance and State Management: Designing Idempotent REST APIs with FastAPI and Pydantic",
      "post_type": "standard",
      "word_count": 143,
      "historical_author_tags": [
        "API Development",
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "API Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.905,
        "API Development": 0.893
      },
      "supporting_snippets": {
        "Frontend Web Development": "TypeScript strict mode catches null pointer errors across complex frontend UI component trees.",
        "API Development": "FastAPI validates incoming JSON payloads automatically using Pydantic schemas and generates OpenAPI docs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development",
        "API Development"
      ]
    },
    {
      "post_id": "POST-1446",
      "published_at": "2026-01-10",
      "title": "Understanding Self-Attention and Layer Normalization in Neural Networks: Domain-Specific Named Entity Recognition and Tokenization",
      "post_type": "standard",
      "word_count": 133,
      "historical_author_tags": [
        "Deep Learning",
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Natural Language Processing",
        "Deep Learning"
      ],
      "model_scores": {
        "Natural Language Processing": 0.979,
        "Deep Learning": 0.978
      },
      "supporting_snippets": {
        "Natural Language Processing": "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text.",
        "Deep Learning": "PyTorch autograd builds dynamic computation graphs for backpropagation through neural networks."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Natural Language Processing",
        "Deep Learning"
      ]
    },
    {
      "post_id": "POST-1447",
      "published_at": "2026-01-11",
      "title": "Building Asynchronous Webhook Consumers with Flask and FastAPI",
      "post_type": "semantic_paraphrase",
      "word_count": 83,
      "historical_author_tags": [
        "API Development"
      ],
      "suggested_tags": [
        "API Development",
        "Python"
      ],
      "model_scores": {
        "API Development": 0.961,
        "Python": 0.311
      },
      "supporting_snippets": {
        "API Development": "Idempotency keys in HTTP request headers ensure that retrying a network timeout does not duplicate backend state mutations.",
        "Python": "Idempotency keys in HTTP request headers ensure that retrying a network timeout does not duplicate backend state mutations."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development",
        "Python"
      ]
    },
    {
      "post_id": "POST-1448",
      "published_at": "2026-01-12",
      "title": "Memory Management and Garbage Collection in CPython with Machine Learning and MLOps",
      "post_type": "standard",
      "word_count": 169,
      "historical_author_tags": [
        "MLOps",
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ],
      "model_scores": {
        "Python": 0.931,
        "MLOps": 0.917,
        "Machine Learning": 0.889
      },
      "supporting_snippets": {
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds.",
        "MLOps": "Feature stores guarantee that online inference uses the exact same transformations as offline training.",
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1449",
      "published_at": "2026-01-13",
      "title": "Multi-Stage Docker Builds for Minimal Production Images with API Development and Application Security",
      "post_type": "standard",
      "word_count": 176,
      "historical_author_tags": [
        "API Development",
        "Application Security",
        "Cloud & DevOps"
      ],
      "suggested_tags": [
        "Cloud & DevOps",
        "Application Security",
        "API Development"
      ],
      "model_scores": {
        "Cloud & DevOps": 0.942,
        "Application Security": 0.934,
        "API Development": 0.926
      },
      "supporting_snippets": {
        "Cloud & DevOps": "Declarative infrastructure provisioning eliminates configuration drift across staging and production cloud regions.",
        "Application Security": "JSON Web Tokens (JWT) must be verified with strong cryptographic signatures and short expiration times.",
        "API Development": "RESTful endpoints use standard HTTP status codes and cursor based pagination for large collections."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Cloud & DevOps",
        "Application Security",
        "API Development"
      ]
    },
    {
      "post_id": "POST-1450",
      "published_at": "2026-01-14",
      "title": "Automating CI/CD Testing and Release Pipelines with GitHub Actions",
      "post_type": "standard",
      "word_count": 85,
      "historical_author_tags": [
        "Cloud & DevOps"
      ],
      "suggested_tags": [
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Cloud & DevOps": 0.979
      },
      "supporting_snippets": {
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1451",
      "published_at": "2026-01-16",
      "title": "Automating CI/CD Testing and Release Pipelines with GitHub Actions",
      "post_type": "republished_duplicate",
      "word_count": 91,
      "historical_author_tags": [
        "Cloud & DevOps"
      ],
      "suggested_tags": [
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Cloud & DevOps": 0.979
      },
      "supporting_snippets": {
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1452",
      "published_at": "2026-01-14",
      "title": "Hyperparameter Optimization and Calibration for Predictive Models with Deep Learning and Natural Language Processing",
      "post_type": "semantic_paraphrase",
      "word_count": 158,
      "historical_author_tags": [
        "Deep Learning",
        "Machine Learning",
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ],
      "model_scores": {
        "Machine Learning": 0.953,
        "Deep Learning": 0.937,
        "Natural Language Processing": 0.837
      },
      "supporting_snippets": {
        "Machine Learning": "Gradient boosted decision trees like XGBoost excel on structured tabular datasets.",
        "Deep Learning": "Low rank adapters freeze pretrained backbone weights while optimizing small bottleneck matrices during transfer learning.",
        "Natural Language Processing": "Stratified k fold partitioning and isotonic probability calibration improve out of sample generalization on skewed targets."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1453",
      "published_at": "2026-01-15",
      "title": "Memory Management and Garbage Collection in CPython: Domain-Specific Named Entity Recognition and Tokenization",
      "post_type": "standard",
      "word_count": 133,
      "historical_author_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Natural Language Processing"
      ],
      "model_scores": {
        "Python": 0.927,
        "Natural Language Processing": 0.905
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Natural Language Processing": "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1454",
      "published_at": "2026-01-16",
      "title": "Overcoming Vanishing Gradients in Deep Neural Architectures",
      "post_type": "standard",
      "word_count": 87,
      "historical_author_tags": [
        "Deep Learning"
      ],
      "suggested_tags": [
        "Deep Learning"
      ],
      "model_scores": {
        "Deep Learning": 0.899
      },
      "supporting_snippets": {
        "Deep Learning": "PyTorch autograd builds dynamic computation graphs for backpropagation through neural networks."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Deep Learning"
      ]
    },
    {
      "post_id": "POST-1455",
      "published_at": "2026-01-17",
      "title": "Tuning Gradient Boosted Trees and XGBoost on Tabular Data with Deep Learning and Natural Language Processing",
      "post_type": "standard",
      "word_count": 178,
      "historical_author_tags": [
        "Deep Learning",
        "Machine Learning",
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ],
      "model_scores": {
        "Machine Learning": 0.915,
        "Deep Learning": 0.819,
        "Natural Language Processing": 0.72
      },
      "supporting_snippets": {
        "Machine Learning": "Scikit learn pipelines prevent data leakage during k fold cross validation and scaling.",
        "Deep Learning": "PyTorch autograd builds dynamic computation graphs for backpropagation through neural networks.",
        "Natural Language Processing": "Subword tokenization handles rare morphological variants and out of vocabulary technical terms."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1456",
      "published_at": "2026-01-18",
      "title": "Core Web Vitals and Bundle Splitting in Modern JavaScript: Zero-Trust API Gateways and Mutual TLS Encryption",
      "post_type": "semantic_paraphrase",
      "word_count": 115,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "Application Security"
      ],
      "model_scores": {
        "Frontend Web Development": 0.945,
        "Application Security": 0.774
      },
      "supporting_snippets": {
        "Frontend Web Development": "Virtual environments and pip dependencies should be pinned for reproducible Python builds.",
        "Application Security": "Tree shaking and dynamic route level code splitting shrink initial bundle payloads for faster First Contentful Paint."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Application Security",
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1457",
      "published_at": "2026-01-19",
      "title": "Type-Safe Custom Hooks and Context Architecture in TypeScript",
      "post_type": "standard",
      "word_count": 83,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development",
        "Python"
      ],
      "model_scores": {
        "Frontend Web Development": 0.933,
        "Python": 0.367
      },
      "supporting_snippets": {
        "Frontend Web Development": "Semantic HTML elements and ARIA attributes ensure keyboard navigation accessibility.",
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development",
        "Python"
      ]
    },
    {
      "post_id": "POST-1458",
      "published_at": "2026-01-20",
      "title": "Mastering Python Generators and Async Iterators: Building Hybrid Keyword and Semantic Search Pipelines",
      "post_type": "long_multi_topic",
      "word_count": 237,
      "historical_author_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Natural Language Processing"
      ],
      "model_scores": {
        "Python": 0.961,
        "Natural Language Processing": 0.68
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "Natural Language Processing": "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1459",
      "published_at": "2026-01-21",
      "title": "Context Managers and Decorators in Modern Python 3 with API Development and Application Security",
      "post_type": "standard",
      "word_count": 188,
      "historical_author_tags": [
        "API Development",
        "Application Security",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "Application Security",
        "API Development"
      ],
      "model_scores": {
        "Python": 0.948,
        "Application Security": 0.937,
        "API Development": 0.923
      },
      "supporting_snippets": {
        "Python": "Virtual environments and pip dependencies should be pinned for reproducible Python builds.",
        "Application Security": "OAuth2 authorization code flows with PKCE protect access tokens in public web and mobile clients.",
        "API Development": "RESTful endpoints use standard HTTP status codes and cursor based pagination for large collections."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "Application Security",
        "API Development"
      ]
    },
    {
      "post_id": "POST-1460",
      "published_at": "2026-01-22",
      "title": "Secure Password Hashing with Argon2 and CSRF Defense",
      "post_type": "semantic_paraphrase",
      "word_count": 75,
      "historical_author_tags": [
        "Application Security"
      ],
      "suggested_tags": [
        "Application Security"
      ],
      "model_scores": {
        "Application Security": 0.516
      },
      "supporting_snippets": {
        "Application Security": "Zero trust mutual TLS handshakes and least privilege role permissions block lateral movement after perimeter compromise."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Application Security"
      ]
    },
    {
      "post_id": "POST-1461",
      "published_at": "2026-01-23",
      "title": "Data Warehouse Modeling with dbt and Dimensional Schemas: Cross-Validation Strategies for Imbalanced Classification",
      "post_type": "standard",
      "word_count": 136,
      "historical_author_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "suggested_tags": [
        "Machine Learning",
        "Data Engineering"
      ],
      "model_scores": {
        "Machine Learning": 0.847,
        "Data Engineering": 0.75
      },
      "supporting_snippets": {
        "Machine Learning": "Feature importance and permutation tests reveal which predictors drive random forest splits.",
        "Data Engineering": "Kafka event streams decouple data producers from downstream data warehouse consumers."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Machine Learning",
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1462",
      "published_at": "2026-01-23",
      "title": "Context Managers and Decorators in Modern Python 3: Domain-Specific Named Entity Recognition and Tokenization",
      "post_type": "standard",
      "word_count": 140,
      "historical_author_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "suggested_tags": [
        "Natural Language Processing",
        "Python"
      ],
      "model_scores": {
        "Natural Language Processing": 0.926,
        "Python": 0.899
      },
      "supporting_snippets": {
        "Natural Language Processing": "Named Entity Recognition (NER) extracts structured organizations, locations, and product mentions from text.",
        "Python": "Type hints with typing and mypy help catch bugs before runtime in large Python codebases."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Natural Language Processing",
        "Python"
      ]
    },
    {
      "post_id": "POST-1463",
      "published_at": "2026-01-24",
      "title": "Comparing RESTful Endpoints and GraphQL Resolvers",
      "post_type": "standard",
      "word_count": 92,
      "historical_author_tags": [
        "API Development"
      ],
      "suggested_tags": [
        "API Development"
      ],
      "model_scores": {
        "API Development": 0.969
      },
      "supporting_snippets": {
        "API Development": "Swagger UI interactive documentation helps teams integrate with backend API routes."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "API Development"
      ]
    },
    {
      "post_id": "POST-1464",
      "published_at": "2026-01-25",
      "title": "Contrastive Representation Learning and Dense Vector Embeddings: Evaluating Topic Models and Document Similarity Metrics",
      "post_type": "semantic_paraphrase",
      "word_count": 109,
      "historical_author_tags": [
        "Deep Learning"
      ],
      "suggested_tags": [
        "Natural Language Processing",
        "Deep Learning"
      ],
      "model_scores": {
        "Natural Language Processing": 0.908,
        "Deep Learning": 0.903
      },
      "supporting_snippets": {
        "Natural Language Processing": "Byte pair encoding splits rare compound words into frequent morphemes to bound vocabulary dimensionality.",
        "Deep Learning": "Low rank adapters freeze pretrained backbone weights while optimizing small bottleneck matrices during transfer learning."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Deep Learning",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1465",
      "published_at": "2026-01-26",
      "title": "Streaming Event Architectures with Apache Kafka and Spark: Infrastructure as Code Using Terraform Modules on AWS",
      "post_type": "long_multi_topic",
      "word_count": 228,
      "historical_author_tags": [
        "Cloud & DevOps",
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Data Engineering": 0.977,
        "Cloud & DevOps": 0.947
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1466",
      "published_at": "2026-01-27",
      "title": "Streaming Event Architectures with Apache Kafka and Spark: Infrastructure as Code Using Terraform Modules on AWS",
      "post_type": "republished_duplicate",
      "word_count": 234,
      "historical_author_tags": [
        "Cloud & DevOps",
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Data Engineering": 0.975,
        "Cloud & DevOps": 0.946
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts.",
        "Cloud & DevOps": "Terraform state files track cloud infrastructure resources declaratively across AWS environments."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1467",
      "published_at": "2026-01-27",
      "title": "Idempotent Backfills in Distributed Data Pipelines",
      "post_type": "standard",
      "word_count": 81,
      "historical_author_tags": [
        "Data Engineering"
      ],
      "suggested_tags": [
        "Data Engineering"
      ],
      "model_scores": {
        "Data Engineering": 0.985
      },
      "supporting_snippets": {
        "Data Engineering": "Apache Airflow DAGs schedule and monitor complex ETL workflows with retry policies and SLA alerts."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1468",
      "published_at": "2026-01-28",
      "title": "Responsive Layout Engineering with Modern CSS Variables: Auditing Web Applications Against OWASP Top 10 Vulnerabilities",
      "post_type": "standard",
      "word_count": 137,
      "historical_author_tags": [
        "Application Security",
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Application Security",
        "Frontend Web Development"
      ],
      "model_scores": {
        "Application Security": 0.932,
        "Frontend Web Development": 0.903
      },
      "supporting_snippets": {
        "Application Security": "OAuth2 authorization code flows with PKCE protect access tokens in public web and mobile clients.",
        "Frontend Web Development": "TypeScript strict mode catches null pointer errors across complex frontend UI component trees."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Application Security",
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1469",
      "published_at": "2026-01-29",
      "title": "Mastering Python Generators and Async Iterators with Machine Learning and MLOps",
      "post_type": "semantic_paraphrase",
      "word_count": 171,
      "historical_author_tags": [
        "MLOps",
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ],
      "model_scores": {
        "Python": 0.937,
        "MLOps": 0.752,
        "Machine Learning": 0.71
      },
      "supporting_snippets": {
        "Python": "Using Python generators and the yield keyword reduces memory overhead when streaming large files.",
        "MLOps": "Feature stores guarantee that online inference uses the exact same transformations as offline training.",
        "Machine Learning": "Ensemble decision trees partition tabular feature spaces recursively to minimize impurity and bias variance trade offs."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1470",
      "published_at": "2026-01-30",
      "title": "Core Web Vitals and Bundle Splitting in Modern JavaScript",
      "post_type": "standard",
      "word_count": 86,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.98
      },
      "supporting_snippets": {
        "Frontend Web Development": "React memoization hooks prevent unnecessary DOM re renders when parent component state updates."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1471",
      "published_at": "2026-01-31",
      "title": "Memory Management and Garbage Collection in CPython with Machine Learning and MLOps",
      "post_type": "standard",
      "word_count": 169,
      "historical_author_tags": [
        "MLOps",
        "Machine Learning",
        "Python"
      ],
      "suggested_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ],
      "model_scores": {
        "Python": 0.942,
        "MLOps": 0.853,
        "Machine Learning": 0.838
      },
      "supporting_snippets": {
        "Python": "CPython uses reference counting alongside a cyclic garbage collector to manage object lifecycles.",
        "MLOps": "Shadow deployments test candidate models on live traffic without exposing predictions to end users.",
        "Machine Learning": "Scikit learn pipelines prevent data leakage during k fold cross validation and scaling."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Python",
        "MLOps",
        "Machine Learning"
      ]
    },
    {
      "post_id": "POST-1479",
      "published_at": "2026-01-22",
      "title": "Quantum Gate Circuits and Superposition Fundamentals (Part 8)",
      "post_type": "niche_topic",
      "word_count": 82,
      "historical_author_tags": [
        "Python",
        "Quantum Computing"
      ],
      "suggested_tags": [
        "Quantum Computing",
        "Python"
      ],
      "model_scores": {
        "Quantum Computing": 0.988,
        "Python": 0.909
      },
      "supporting_snippets": {
        "Quantum Computing": "Hadamard and CNOT gates entangle two qubits to construct Bell states in Qiskit.",
        "Python": "Type hints with typing and mypy help catch bugs before runtime in large Python codebases."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "Quantum Computing",
        "Python"
      ]
    },
    {
      "post_id": "POST-1487",
      "published_at": "2026-01-22",
      "title": "Compiling Rust Audio and Image Filters to WebAssembly (Part 8)",
      "post_type": "niche_topic",
      "word_count": 91,
      "historical_author_tags": [
        "Python",
        "WebAssembly"
      ],
      "suggested_tags": [
        "WebAssembly",
        "Python"
      ],
      "model_scores": {
        "WebAssembly": 0.988,
        "Python": 0.929
      },
      "supporting_snippets": {
        "WebAssembly": "WebAssembly bytecode executes at near native speed inside a memory safe browser sandbox.",
        "Python": "Using Python generators and the yield keyword reduces memory overhead when streaming large files."
      },
      "review_status": "Auto-Approved (High Confidence)",
      "final_editor_approved_tags": [
        "WebAssembly",
        "Python"
      ]
    },
    {
      "post_id": "POST-1488",
      "published_at": "2025-12-26",
      "title": "WIP: Python FastAPI Notes",
      "post_type": "short_draft",
      "word_count": 9,
      "historical_author_tags": [
        "API Development",
        "Python"
      ],
      "suggested_tags": [
        "Python"
      ],
      "model_scores": {
        "Python": 0.881
      },
      "supporting_snippets": {
        "Python": "TODO: write tutorial on endpoints."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "API Development",
        "Python"
      ]
    },
    {
      "post_id": "POST-1489",
      "published_at": "2026-01-31",
      "title": "Draft: Kubernetes Upgrade",
      "post_type": "short_draft",
      "word_count": 8,
      "historical_author_tags": [
        "Cloud & DevOps"
      ],
      "suggested_tags": [
        "Cloud & DevOps"
      ],
      "model_scores": {
        "Cloud & DevOps": 0.932
      },
      "supporting_snippets": {
        "Cloud & DevOps": "Notes from today's cluster migration."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1490",
      "published_at": "2026-01-18",
      "title": "Untitled Security Memo",
      "post_type": "short_draft",
      "word_count": 7,
      "historical_author_tags": [
        "Application Security"
      ],
      "suggested_tags": [
        "Application Security"
      ],
      "model_scores": {
        "Application Security": 0.703
      },
      "supporting_snippets": {
        "Application Security": "Check JWT expiry settings."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Application Security"
      ]
    },
    {
      "post_id": "POST-1492",
      "published_at": "2026-01-23",
      "title": "React Hook Bug",
      "post_type": "short_draft",
      "word_count": 7,
      "historical_author_tags": [
        "Frontend Web Development"
      ],
      "suggested_tags": [
        "Frontend Web Development"
      ],
      "model_scores": {
        "Frontend Web Development": 0.914
      },
      "supporting_snippets": {
        "Frontend Web Development": "Fix useEffect dependency array."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Frontend Web Development"
      ]
    },
    {
      "post_id": "POST-1493",
      "published_at": "2025-12-31",
      "title": "SQL Index Note",
      "post_type": "short_draft",
      "word_count": 9,
      "historical_author_tags": [
        "Data Engineering"
      ],
      "suggested_tags": [],
      "model_scores": {},
      "supporting_snippets": {},
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Data Engineering"
      ]
    },
    {
      "post_id": "POST-1494",
      "published_at": "2026-01-29",
      "title": "Embeddings test",
      "post_type": "short_draft",
      "word_count": 6,
      "historical_author_tags": [
        "Deep Learning",
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Deep Learning"
      ],
      "model_scores": {
        "Deep Learning": 0.812
      },
      "supporting_snippets": {
        "Deep Learning": "Testing sentence transformer latency."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Deep Learning",
        "Natural Language Processing"
      ]
    },
    {
      "post_id": "POST-1495",
      "published_at": "2025-12-23",
      "title": "MLflow setup",
      "post_type": "short_draft",
      "word_count": 7,
      "historical_author_tags": [
        "MLOps"
      ],
      "suggested_tags": [
        "MLOps"
      ],
      "model_scores": {
        "MLOps": 0.685
      },
      "supporting_snippets": {
        "MLOps": "Track model artifacts in S3."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "MLOps"
      ]
    },
    {
      "post_id": "POST-1496",
      "published_at": "2026-01-26",
      "title": "Empty Draft Placeholder",
      "post_type": "short_draft",
      "word_count": 5,
      "historical_author_tags": [
        "Python"
      ],
      "suggested_tags": [],
      "model_scores": {},
      "supporting_snippets": {},
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Python"
      ]
    },
    {
      "post_id": "POST-1497",
      "published_at": "2025-12-21",
      "title": "API Gateway Draft",
      "post_type": "short_draft",
      "word_count": 7,
      "historical_author_tags": [
        "API Development",
        "Cloud & DevOps"
      ],
      "suggested_tags": [
        "API Development",
        "Application Security"
      ],
      "model_scores": {
        "API Development": 0.863,
        "Application Security": 0.325
      },
      "supporting_snippets": {
        "API Development": "Rate limit configuration notes.",
        "Application Security": "Rate limit configuration notes."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "API Development",
        "Application Security",
        "Cloud & DevOps"
      ]
    },
    {
      "post_id": "POST-1498",
      "published_at": "2026-02-02",
      "title": "NLP Tokenizer",
      "post_type": "short_draft",
      "word_count": 6,
      "historical_author_tags": [
        "Natural Language Processing"
      ],
      "suggested_tags": [
        "Natural Language Processing",
        "Deep Learning"
      ],
      "model_scores": {
        "Natural Language Processing": 0.985,
        "Deep Learning": 0.522
      },
      "supporting_snippets": {
        "Natural Language Processing": "Check subword vocabulary size.",
        "Deep Learning": "Check subword vocabulary size."
      },
      "review_status": "Needs Editor Review (Short Draft < 15 words)",
      "final_editor_approved_tags": [
        "Deep Learning",
        "Natural Language Processing"
      ]
    }
  ],
  "reviewer_sample": [
    {
      "post_id": "POST-1413",
      "split": "test",
      "title": "Packaging Python Libraries with pyproject.toml and Virtualenv: Cursor Pagination and Rate Limiting in Web APIs",
      "raw_author_tags": "[\"Python\"]",
      "normalized_historical_tags": "[\"Python\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Python\"]",
      "missing_or_inconsistent_flag": true,
      "reviewer_audit_note": "Missing secondary tag 'API Development' in historical archive."
    },
    {
      "post_id": "POST-1358",
      "split": "val",
      "title": "Type-Safe Custom Hooks and Context Architecture in TypeScript: Zero-Trust API Gateways and Mutual TLS Encryption",
      "raw_author_tags": "[\"frontend\", \"security\"]",
      "normalized_historical_tags": "[\"Application Security\", \"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"Application Security\", \"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1458",
      "split": "test",
      "title": "Mastering Python Generators and Async Iterators: Building Hybrid Keyword and Semantic Search Pipelines",
      "raw_author_tags": "[\"cpython\", \"ner\"]",
      "normalized_historical_tags": "[\"Natural Language Processing\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Natural Language Processing\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1418",
      "split": "test",
      "title": "Concurrency Patterns with Python Asyncio and Multiprocessing",
      "raw_author_tags": "[\"cpython\"]",
      "normalized_historical_tags": "[\"Python\"]",
      "reviewer_verified_complete_tags": "[\"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1416",
      "split": "test",
      "title": "Mastering Python Generators and Async Iterators with API Development and Application Security",
      "raw_author_tags": "[\"pythonic\", \"flask\", \"Application Security\"]",
      "normalized_historical_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1371",
      "split": "val",
      "title": "Understanding Self-Attention and Layer Normalization in Neural Networks: Handling Negation and Subword Tokenization in Sentiment Analysis",
      "raw_author_tags": "[\"pytorch\", \"ner\"]",
      "normalized_historical_tags": "[\"Deep Learning\", \"Natural Language Processing\"]",
      "reviewer_verified_complete_tags": "[\"Deep Learning\", \"Natural Language Processing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1404",
      "split": "val",
      "title": "Packaging Python Libraries with pyproject.toml and Virtualenv: Feature Engineering and Selection with Scikit-Learn Pipelines",
      "raw_author_tags": "[\"python3\"]",
      "normalized_historical_tags": "[\"Python\"]",
      "reviewer_verified_complete_tags": "[\"Machine Learning\", \"Python\"]",
      "missing_or_inconsistent_flag": true,
      "reviewer_audit_note": "Missing secondary tag 'Machine Learning' in historical archive."
    },
    {
      "post_id": "POST-1491",
      "split": "val",
      "title": "Quick ML thought",
      "raw_author_tags": "[\"Machine Learning\"]",
      "normalized_historical_tags": "[\"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1408",
      "split": "test",
      "title": "Hyperparameter Optimization and Calibration for Predictive Models with MLOps and Cloud & DevOps",
      "raw_author_tags": "[\"ML\", \"model-deployment\", \"k8s\"]",
      "normalized_historical_tags": "[\"Cloud & DevOps\", \"MLOps\", \"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Cloud & DevOps\", \"MLOps\", \"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1422",
      "split": "test",
      "title": "Cross-Validation Strategies for Imbalanced Classification",
      "raw_author_tags": "[\"ML\"]",
      "normalized_historical_tags": "[\"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1450",
      "split": "test",
      "title": "Automating CI/CD Testing and Release Pipelines with GitHub Actions",
      "raw_author_tags": "[\"ci-cd\"]",
      "normalized_historical_tags": "[\"Cloud & DevOps\"]",
      "reviewer_verified_complete_tags": "[\"Cloud & DevOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1352",
      "split": "val",
      "title": "Mastering Python Generators and Async Iterators: Handling Negation and Subword Tokenization in Sentiment Analysis",
      "raw_author_tags": "[\"pythonic\", \"ner\"]",
      "normalized_historical_tags": "[\"Natural Language Processing\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Natural Language Processing\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1376",
      "split": "val",
      "title": "Idempotent Backfills in Distributed Data Pipelines: Handling Missing Values and Leakage in Supervised Learning",
      "raw_author_tags": "[\"spark\", \"scikit-learn\"]",
      "normalized_historical_tags": "[\"Data Engineering\", \"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\", \"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1349",
      "split": "val",
      "title": "Comparing Random Forests and Logistic Regression Baselines with Deep Learning and Natural Language Processing",
      "raw_author_tags": "[\"ML\", \"neural-networks\", \"ner\"]",
      "normalized_historical_tags": "[\"Deep Learning\", \"Machine Learning\", \"Natural Language Processing\"]",
      "reviewer_verified_complete_tags": "[\"Deep Learning\", \"Machine Learning\", \"Natural Language Processing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1359",
      "split": "val",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses: Cross-Validation Strategies for Imbalanced Classification",
      "raw_author_tags": "[\"cpython\", \"sklearn\"]",
      "normalized_historical_tags": "[\"Machine Learning\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Machine Learning\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1396",
      "split": "val",
      "title": "Domain-Specific Named Entity Recognition and Tokenization",
      "raw_author_tags": "[\"spacy\"]",
      "normalized_historical_tags": "[\"Natural Language Processing\"]",
      "reviewer_verified_complete_tags": "[\"Natural Language Processing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1444",
      "split": "test",
      "title": "Idempotent Backfills in Distributed Data Pipelines",
      "raw_author_tags": "[\"spark\"]",
      "normalized_historical_tags": "[\"Data Engineering\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1409",
      "split": "val",
      "title": "Server-Side Rendering and Hydration Patterns in React",
      "raw_author_tags": "[\"Frontend Web Development\"]",
      "normalized_historical_tags": "[\"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1395",
      "split": "val",
      "title": "Memory Management and Garbage Collection in CPython with Machine Learning and MLOps",
      "raw_author_tags": "[\"python3\", \"Machine Learning\", \"mlflow\"]",
      "normalized_historical_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1477",
      "split": "val",
      "title": "Quantum Gate Circuits and Superposition Fundamentals (Part 6)",
      "raw_author_tags": "[\"qiskit\", \"py\"]",
      "normalized_historical_tags": "[\"Python\", \"Quantum Computing\"]",
      "reviewer_verified_complete_tags": "[\"Python\", \"Quantum Computing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1369",
      "split": "val",
      "title": "Observability with Prometheus Metrics and Distributed Tracing with API Development and Application Security",
      "raw_author_tags": "[\"k8s\", \"fastapi\", \"appsec\"]",
      "normalized_historical_tags": "[\"API Development\", \"Application Security\", \"Cloud & DevOps\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Application Security\", \"Cloud & DevOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1467",
      "split": "test",
      "title": "Idempotent Backfills in Distributed Data Pipelines",
      "raw_author_tags": "[\"spark\"]",
      "normalized_historical_tags": "[\"Data Engineering\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1366",
      "split": "val",
      "title": "Context Managers and Decorators in Modern Python 3: Domain-Specific Named Entity Recognition and Tokenization",
      "raw_author_tags": "[\"py\", \"nlp\"]",
      "normalized_historical_tags": "[\"Natural Language Processing\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Natural Language Processing\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1468",
      "split": "test",
      "title": "Responsive Layout Engineering with Modern CSS Variables: Auditing Web Applications Against OWASP Top 10 Vulnerabilities",
      "raw_author_tags": "[\"css\", \"owasp\"]",
      "normalized_historical_tags": "[\"Application Security\", \"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"Application Security\", \"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1471",
      "split": "test",
      "title": "Memory Management and Garbage Collection in CPython with Machine Learning and MLOps",
      "raw_author_tags": "[\"py\", \"scikit-learn\", \"ml-ops\"]",
      "normalized_historical_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1495",
      "split": "test",
      "title": "MLflow setup",
      "raw_author_tags": "[\"MLOps\"]",
      "normalized_historical_tags": "[\"MLOps\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1448",
      "split": "test",
      "title": "Memory Management and Garbage Collection in CPython with Machine Learning and MLOps",
      "raw_author_tags": "[\"py\", \"sklearn\", \"mlflow\"]",
      "normalized_historical_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\", \"Machine Learning\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1493",
      "split": "test",
      "title": "SQL Index Note",
      "raw_author_tags": "[\"Data Engineering\"]",
      "normalized_historical_tags": "[\"Data Engineering\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1385",
      "split": "val",
      "title": "Core Web Vitals and Bundle Splitting in Modern JavaScript: Building Asynchronous Webhook Consumers with Flask and FastAPI",
      "raw_author_tags": "[\"css\", \"rest-api\"]",
      "normalized_historical_tags": "[\"API Development\", \"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1370",
      "split": "val",
      "title": "Evaluating Topic Models and Document Similarity Metrics",
      "raw_author_tags": "[\"Natural Language Processing\"]",
      "normalized_historical_tags": "[\"Natural Language Processing\"]",
      "reviewer_verified_complete_tags": "[\"Natural Language Processing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1362",
      "split": "val",
      "title": "Orchestrating Incremental ETL Pipelines with Apache Airflow: Comparing Random Forests and Logistic Regression Baselines",
      "raw_author_tags": "[\"Data Engineering\"]",
      "normalized_historical_tags": "[\"Data Engineering\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\", \"Machine Learning\"]",
      "missing_or_inconsistent_flag": true,
      "reviewer_audit_note": "Missing secondary tag 'Machine Learning' in historical archive."
    },
    {
      "post_id": "POST-1355",
      "split": "val",
      "title": "Packaging Python Libraries with pyproject.toml and Virtualenv with API Development and Application Security",
      "raw_author_tags": "[\"pythonic\", \"fastapi\", \"security\"]",
      "normalized_historical_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1405",
      "split": "val",
      "title": "Automated Retraining Pipelines and Model Governance",
      "raw_author_tags": "[\"model-deployment\"]",
      "normalized_historical_tags": "[\"MLOps\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1351",
      "split": "val",
      "title": "Training Convolutional Neural Networks with Mixed Precision",
      "raw_author_tags": "[\"transformers\"]",
      "normalized_historical_tags": "[\"Deep Learning\"]",
      "reviewer_verified_complete_tags": "[\"Deep Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1382",
      "split": "val",
      "title": "Mastering Python Generators and Async Iterators: Orchestrating Incremental ETL Pipelines with Apache Airflow",
      "raw_author_tags": "[\"python3\", \"spark\"]",
      "normalized_historical_tags": "[\"Data Engineering\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1496",
      "split": "test",
      "title": "Empty Draft Placeholder",
      "raw_author_tags": "[\"Python\"]",
      "normalized_historical_tags": "[\"Python\"]",
      "reviewer_verified_complete_tags": "[\"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1391",
      "split": "val",
      "title": "Memory Management and Garbage Collection in CPython with API Development and Application Security",
      "raw_author_tags": "[\"cpython\", \"rest-api\", \"owasp\"]",
      "normalized_historical_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Application Security\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1367",
      "split": "val",
      "title": "Multi-Stage Docker Builds for Minimal Production Images",
      "raw_author_tags": "[\"docker\"]",
      "normalized_historical_tags": "[\"Cloud & DevOps\"]",
      "reviewer_verified_complete_tags": "[\"Cloud & DevOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1344",
      "split": "val",
      "title": "Mastering Python Generators and Async Iterators",
      "raw_author_tags": "[\"pythonic\"]",
      "normalized_historical_tags": "[\"Python\"]",
      "reviewer_verified_complete_tags": "[\"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1372",
      "split": "val",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses: Streaming Event Architectures with Apache Kafka and Spark",
      "raw_author_tags": "[\"python3\", \"etl\"]",
      "normalized_historical_tags": "[\"Data Engineering\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1492",
      "split": "test",
      "title": "React Hook Bug",
      "raw_author_tags": "[\"Frontend Web Development\"]",
      "normalized_historical_tags": "[\"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1425",
      "split": "test",
      "title": "Feature Stores for Online and Offline Training Consistency",
      "raw_author_tags": "[\"data-drift\"]",
      "normalized_historical_tags": "[\"MLOps\"]",
      "reviewer_verified_complete_tags": "[\"MLOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1426",
      "split": "test",
      "title": "Writing Clean Pythonic Code with Type Hints and Dataclasses: Cursor Pagination and Rate Limiting in Web APIs",
      "raw_author_tags": "[\"pythonic\", \"graphql\"]",
      "normalized_historical_tags": "[\"API Development\", \"Python\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Python\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1356",
      "split": "val",
      "title": "Comparing Random Forests and Logistic Regression Baselines with MLOps and Cloud & DevOps",
      "raw_author_tags": "[\"scikit-learn\", \"data-drift\", \"kubernetes\"]",
      "normalized_historical_tags": "[\"Cloud & DevOps\", \"MLOps\", \"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Cloud & DevOps\", \"MLOps\", \"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1350",
      "split": "val",
      "title": "Handling Missing Values and Leakage in Supervised Learning with Deep Learning and Natural Language Processing",
      "raw_author_tags": "[\"sklearn\", \"transformers\", \"ner\"]",
      "normalized_historical_tags": "[\"Deep Learning\", \"Machine Learning\", \"Natural Language Processing\"]",
      "reviewer_verified_complete_tags": "[\"Deep Learning\", \"Machine Learning\", \"Natural Language Processing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1421",
      "split": "test",
      "title": "Orchestrating Incremental ETL Pipelines with Apache Airflow: Feature Engineering and Selection with Scikit-Learn Pipelines",
      "raw_author_tags": "[\"Data Engineering\", \"scikit-learn\"]",
      "normalized_historical_tags": "[\"Data Engineering\", \"Machine Learning\"]",
      "reviewer_verified_complete_tags": "[\"Data Engineering\", \"Machine Learning\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1478",
      "split": "val",
      "title": "Quantum Gate Circuits and Superposition Fundamentals (Part 7)",
      "raw_author_tags": "[\"quantum\", \"py\"]",
      "normalized_historical_tags": "[\"Python\", \"Quantum Computing\"]",
      "reviewer_verified_complete_tags": "[\"Python\", \"Quantum Computing\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1487",
      "split": "test",
      "title": "Compiling Rust Audio and Image Filters to WebAssembly (Part 8)",
      "raw_author_tags": "[\"web-assembly\", \"py\"]",
      "normalized_historical_tags": "[\"Python\", \"WebAssembly\"]",
      "reviewer_verified_complete_tags": "[\"Python\", \"WebAssembly\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1415",
      "split": "test",
      "title": "Optimizing React Rendering Performance and State Management",
      "raw_author_tags": "[\"css\"]",
      "normalized_historical_tags": "[\"Frontend Web Development\"]",
      "reviewer_verified_complete_tags": "[\"Frontend Web Development\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    },
    {
      "post_id": "POST-1449",
      "split": "test",
      "title": "Multi-Stage Docker Builds for Minimal Production Images with API Development and Application Security",
      "raw_author_tags": "[\"kubernetes\", \"graphql\", \"appsec\"]",
      "normalized_historical_tags": "[\"API Development\", \"Application Security\", \"Cloud & DevOps\"]",
      "reviewer_verified_complete_tags": "[\"API Development\", \"Application Security\", \"Cloud & DevOps\"]",
      "missing_or_inconsistent_flag": false,
      "reviewer_audit_note": "Historical tags consistent with taxonomy after alias normalization."
    }
  ],
  "feedback_log": [
    {
      "timestamp": "2026-11-14T16:40:12",
      "post_id": "POST-1433",
      "title": "Designing Idempotent REST APIs with FastAPI and Pydantic with Python and Application Security",
      "word_count": 69,
      "model_used": "sbert",
      "suggested_tags": [
        "API Development",
        "Python",
        "Application Security"
      ],
      "accepted_tags": [
        "API Development",
        "Python",
        "Application Security"
      ],
      "rejected_tags": [],
      "added_missing_tags": [],
      "final_editor_approved_tags": [
        "API Development",
        "Python",
        "Application Security"
      ],
      "flagged_for_review": false,
      "editor_notes": "Confirmed Application Security tag which was missing from historical author tags."
    },
    {
      "timestamp": "2026-11-14T16:42:05",
      "post_id": "POST-1488",
      "title": "WIP: Python FastAPI Notes",
      "word_count": 10,
      "model_used": "sbert",
      "suggested_tags": [],
      "accepted_tags": [],
      "rejected_tags": [],
      "added_missing_tags": [
        "Python",
        "API Development"
      ],
      "final_editor_approved_tags": [
        "Python",
        "API Development"
      ],
      "flagged_for_review": true,
      "editor_notes": "Short stub draft (<15 words) routed to review; assigned provisional tags manually."
    },
    {
      "timestamp": "2026-11-14T16:45:19",
      "post_id": "POST-1420",
      "title": "Orchestrating Incremental ETL Pipelines with Apache Airflow: Tuning Gradient Boosted Trees and XGBoost on Tabular Data",
      "word_count": 176,
      "model_used": "sbert",
      "suggested_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "accepted_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "rejected_tags": [],
      "added_missing_tags": [],
      "final_editor_approved_tags": [
        "Data Engineering",
        "Machine Learning"
      ],
      "flagged_for_review": false,
      "editor_notes": "Long multi-topic article; chunk pooling captured both ETL and XGBoost sections accurately."
    }
  ]
};

const SEMANTIC_VOCAB: Record<string, string[]> = {
  "Python": ["python", "cpython", "pytest", "asyncio", "pydantic", "typing", "virtualenv", "pip", "uv", "poetry", "gil", "fastapi", "flask", "django", "decorator", "comprehension"],
  "Machine Learning": ["machine learning", "ml", "scikit-learn", "sklearn", "xgboost", "lightgbm", "gradient boosting", "hyperparameter", "cross-validation", "random forest", "logistic regression", "f1", "roc-auc", "classification", "feature engineering"],
  "Deep Learning": ["deep learning", "neural network", "pytorch", "tensorflow", "backpropagation", "cnn", "gpu", "cuda", "lora", "fine-tuning", "weights", "activations", "gradient", "layer"],
  "API Development": ["api", "rest", "restful", "graphql", "grpc", "endpoint", "webhook", "openapi", "swagger", "rate limit", "idempotency", "pagination", "microservice", "http", "json", "payload"],
  "Application Security": ["security", "oauth", "oauth2", "jwt", "owasp", "csrf", "xss", "sql injection", "mtls", "encryption", "zero-trust", "authentication", "authorization", "rbac", "token", "secret", "vulnerability"],
  "Data Engineering": ["data engineering", "etl", "elt", "spark", "pyspark", "kafka", "airflow", "dbt", "snowflake", "parquet", "iceberg", "data warehouse", "lakehouse", "streaming", "pipeline", "ingestion"],
  "Cloud & DevOps": ["cloud", "devops", "kubernetes", "k8s", "docker", "terraform", "aws", "gcp", "ci/cd", "github actions", "helm", "prometheus", "autoscaling", "container", "cluster", "infrastructure"],
  "Frontend Web Development": ["frontend", "react", "nextjs", "next.js", "typescript", "tailwind", "css", "dom", "hydration", "ssr", "web vitals", "accessibility", "browser", "component", "ui"],
  "MLOps": ["mlops", "model serving", "mlflow", "feature store", "drift", "data drift", "concept drift", "triton", "onnx", "model registry", "canary", "monitoring", "inference latency", "retraining"],
  "Natural Language Processing": ["nlp", "natural language", "embedding", "sentence-transformers", "minilm", "tokenizer", "rag", "vector search", "semantic", "llm", "cosine similarity", "chunking", "text classification", "transformer"],
  "Quantum Computing": ["quantum", "qubit", "qiskit", "superposition", "entanglement", "quantum circuit", "hadamard", "cnot", "nisq", "variational quantum", "vqe", "bloch sphere"],
  "WebAssembly": ["webassembly", "wasm", "wasi", "wasm-bindgen", "rust", "linear memory", "bytecode", "sandbox", "near-native", "browser runtime"]
};

const PER_TAG_THRESHOLDS: Record<string, number> = {
  "Python": 0.45,
  "Machine Learning": 0.45,
  "Deep Learning": 0.50,
  "API Development": 0.45,
  "Application Security": 0.45,
  "Data Engineering": 0.50,
  "Cloud & DevOps": 0.45,
  "Frontend Web Development": 0.50,
  "MLOps": 0.50,
  "Natural Language Processing": 0.45,
  "Quantum Computing": 0.45,
  "WebAssembly": 0.45
};

export function cleanClientText(raw: string): string {
  let s = raw || "";
  s = s.replace(/<(nav|footer|aside)[\s\S]*?<\/\1>/gi, " ");
  s = s.replace(/<div[^>]*class=["'][^"']*(?:tag-widget|newsletter-cta|cookie-banner|breadcrumbs)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, " ");
  s = s.replace(/^---[\s\S]*?---/m, " ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function runClientPrediction(req: {
  title: string;
  body: string;
  model_engine: string;
  use_per_tag_thresholds: boolean;
  global_threshold: number;
  max_suggestions: number;
  min_words: number;
}) {
  const cleanTitle = (req.title || "").trim();
  const cleanBody = cleanClientText(req.body || "");
  const rawChars = (req.body || "").length;
  const cleanChars = cleanBody.length;
  const removedChars = Math.max(0, rawChars - cleanChars);
  const combined = `${cleanTitle} ${cleanBody}`.trim();
  const words = combined ? combined.split(/\s+/) : [];
  const wordCount = words.length;

  // Chunk into 60-word windows with 15-word overlap (stride 45)
  const bodyWords = cleanBody ? cleanBody.split(/\s+/) : [];
  const chunks: string[] = [];
  if (bodyWords.length > 0) {
    for (let i = 0; i < bodyWords.length; i += 45) {
      chunks.push(bodyWords.slice(i, i + 60).join(" "));
      if (i + 60 >= bodyWords.length) break;
    }
  }

  const canonicalTags: string[] = OFFLINE_APP_STATE.canonical_tags;
  const taxonomyList: any[] = OFFLINE_APP_STATE.taxonomy?.approved_tags || [];
  const taxMap: Record<string, any> = {};
  for (const item of taxonomyList) {
    taxMap[item.tag] = item;
  }

  const titleLower = cleanTitle.toLowerCase();
  const bodyLower = cleanBody.toLowerCase();
  const fullLower = `${titleLower} ${bodyLower}`;
  const sentences = cleanBody
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 16);

  const scored = canonicalTags.map((tag) => {
    const meta = taxMap[tag] || { aliases: [] };
    const aliases: string[] = [tag.toLowerCase(), ...(meta.aliases || []).map((a: string) => a.toLowerCase())];
    const semTerms: string[] = [...aliases, ...(SEMANTIC_VOCAB[tag] || [])];

    let titleHits = 0;
    let bodyHits = 0;
    let aliasHits = 0;
    const matchedTerms: string[] = [];

    for (const a of aliases) {
      if (a && fullLower.includes(a)) aliasHits += 1;
    }
    for (const term of semTerms) {
      if (!term) continue;
      if (titleLower.includes(term)) {
        titleHits += 1;
        if (!matchedTerms.includes(term)) matchedTerms.push(term);
      }
      if (bodyLower.includes(term)) {
        bodyHits += 1;
        if (!matchedTerms.includes(term)) matchedTerms.push(term);
      }
    }

    const kwScore = aliasHits > 0 ? Math.min(0.94, 0.36 + aliasHits * 0.22) : 0.02;
    const tfidfScore = (titleHits > 0 || bodyHits > 0) ? Math.min(0.98, 0.28 + titleHits * 0.28 + bodyHits * 0.15) : 0.03;
    const sbertScore = (titleHits > 0 || bodyHits > 0) ? Math.min(0.99, 0.31 + titleHits * 0.26 + bodyHits * 0.16) : 0.05;

    const activeScore =
      req.model_engine === "keyword"
        ? kwScore
        : req.model_engine === "tfidf"
          ? tfidfScore
          : sbertScore;

    const thVal = req.use_per_tag_thresholds
      ? (PER_TAG_THRESHOLDS[tag] ?? req.global_threshold)
      : req.global_threshold;

    let snippet = "Matched primarily via title terms.";
    for (const sent of sentences) {
      const sLow = sent.toLowerCase();
      if (matchedTerms.some((t) => sLow.includes(t))) {
        snippet = sent;
        break;
      }
    }

    return {
      tag,
      score: Number(activeScore.toFixed(4)),
      threshold: Number(thVal.toFixed(2)),
      passed: activeScore >= thVal && wordCount >= req.min_words,
      snippet,
      sbert_score: Number(sbertScore.toFixed(4)),
      tfidf_score: Number(tfidfScore.toFixed(4)),
      kw_score: Number(kwScore.toFixed(4)),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const passing = scored.filter((s) => s.passed).slice(0, req.max_suggestions);
  const suggestedTags = wordCount >= req.min_words ? passing.map((p) => p.tag) : [];

  let reviewStatus = "Auto-Approved (High Confidence)";
  let flagged = false;
  if (wordCount < req.min_words) {
    reviewStatus = `Needs Editor Review (Short Draft: ${wordCount} words < ${req.min_words} min)`;
    flagged = true;
  } else if (suggestedTags.length === 0) {
    reviewStatus = "Needs Editor Review (No tag met confidence threshold)";
    flagged = true;
  }

  const topCandidates = scored.slice(0, 5).map((item, idx) => ({
    rank: idx + 1,
    tag: item.tag,
    score: item.score,
    threshold: item.threshold,
    passed: suggestedTags.includes(item.tag),
    snippet: item.snippet,
    sbert_score: item.sbert_score,
    tfidf_score: item.tfidf_score,
    kw_score: item.kw_score,
  }));

  return {
    clean_title: cleanTitle,
    clean_body: cleanBody,
    word_count: wordCount,
    removed_boilerplate_chars: removedChars,
    chunks,
    suggested_tags: suggestedTags,
    review_status: reviewStatus,
    flagged_for_review: flagged,
    top_candidates: topCandidates,
  };
}
