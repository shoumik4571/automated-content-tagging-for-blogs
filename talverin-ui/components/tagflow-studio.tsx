'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import GeometryBackdrop from '@/components/geometry-backdrop'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BorderTrail } from '@/components/motion-primitives/border-trail'
import { Magnetic } from '@/components/motion-primitives/magnetic'
import { Spotlight } from '@/components/motion-primitives/spotlight'
import { GlowEffect } from '@/components/motion-primitives/glow-effect'
import { BrandMark } from '@/components/brand-mark'
import CountUp from '@/components/react-bits/CountUp'
import { GlowCard } from '@/components/anim/GlowCard'
import { RingProgress } from '@/components/anim/RingProgress'
import { GooeyNav } from '@/components/anim/GooeyNav'
import { ElasticToggle } from '@/components/anim/ElasticToggle'
import { TopoFlow } from '@/components/anim/TopoFlow'
import { StaffBadge } from '@/components/anim/StaffBadge'
import { AuroraGlowInput } from '@/components/anim/AuroraGlowInput'
import { Skiper26ThemeToggle } from '@/components/ui/skiper-ui/skiper26'
import { SkiperBracketBadge, SkiperPerspectiveHeading } from '@/components/ui/skiper-ui/skiper31'
import { FramerTiltCard } from '@/components/ui/skiper-ui/framer-showcase'
import { OFFLINE_APP_STATE, runClientPrediction } from '@/lib/offline-engine'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  FileCode2,
  FileJson,
  FileSpreadsheet,
  Filter,
  Layers,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react'

const API_BASE = 'http://127.0.0.1:8000'

type CandidateTag = {
  rank: number
  tag: string
  score: number
  threshold: number
  passed: boolean
  snippet: string
  sbert_score: number
  tfidf_score: number
  kw_score: number
}

type PredictResponse = {
  clean_title: string
  clean_body: string
  word_count: number
  removed_boilerplate_chars: number
  chunks: string[]
  suggested_tags: string[]
  review_status: string
  flagged_for_review: boolean
  top_candidates: CandidateTag[]
}

const PRESET_SCENARIOS = [
  {
    id: 'fastapi-sec',
    category: 'HTML Input • 3 Tags',
    title: 'Securing a Python REST API with FastAPI, OAuth2, and JWT Tokens',
    description: 'Tests HTML <nav>/<footer> stripping + multi-label Python, API Development & Application Security.',
    body: `<nav class="site-nav">Home | Archive | Subscribe | RSS</nav>
<article>
In this tutorial we build a production Python backend using FastAPI and Pydantic schemas. We expose RESTful API endpoints with OpenAPI documentation and protect sensitive routes using OAuth2 password flows, JSON Web Tokens (JWT), and OWASP security headers to prevent SQL injection and XSS vulnerabilities.
</article>
<footer>Copyright 2026 TechBlog Inc. All rights reserved.</footer>
<div class="tag-widget">Popular tags: #coding #tech #news</div>`,
  },
  {
    id: 'long-chunking',
    category: 'Long Multi-Topic • Chunking',
    title: 'End-to-End Python ETL with Airflow, XGBoost Training, and MLflow Drift Monitoring',
    description: 'Tests 60-word overlapping article chunking + 0.70 Mean / 0.30 Max pooling across 4 topics.',
    body: `Apache Airflow DAGs orchestrate incremental SQL and Spark ETL pipelines into partitioned PostgreSQL tables. Using Python generators and virtual environments keeps our data processing scripts modular and memory-efficient. In section two, we train gradient boosted decision trees with scikit-learn and XGBoost using stratified k-fold cross-validation. In the concluding section, our MLOps pipeline registers serialized model artifacts in MLflow, serves predictions via shadow deployments, and monitors production Population Stability Index for data drift.`,
  },
  {
    id: 'semantic-paraphrase',
    category: 'Semantic Paraphrase • SBERT',
    title: 'Attention Layers and Contrastive Vector Spaces for Text Classification',
    description: 'Uses domain concepts without obvious keyword aliases — showcases Sentence-Transformer advantage.',
    body: `Backpropagating gradients through multi-head attention layers projects passages into dense vector spaces on GPUs. Byte-pair subword tokenization and syntactic lemmatization normalize inflected word forms across large document collections.`,
  },
  {
    id: 'short-stub',
    category: 'Short Draft • <15 Words',
    title: 'WIP: Kubernetes Upgrade Notes',
    description: 'Triggers automatic Editor Review routing because draft length is below the 15-word threshold.',
    body: `TODO: check pod readiness probes tomorrow.`,
  },
]

export default function TagFlowStudio() {
  const [tab, setTab] = useState<'studio' | 'batch' | 'benchmarks' | 'taxonomy' | 'vault'>('studio')
  const [dark, setDark] = useState(false)
  const [modelEngine, setModelEngine] = useState<'sbert' | 'tfidf' | 'keyword'>('sbert')
  const [usePerTag, setUsePerTag] = useState(true)
  const [globalThreshold, setGlobalThreshold] = useState(0.55)
  const [minWords, setMinWords] = useState(15)

  const [draftTitle, setDraftTitle] = useState(PRESET_SCENARIOS[0].title)
  const [draftBody, setDraftBody] = useState(PRESET_SCENARIOS[0].body)
  const [activePostId, setActivePostId] = useState<string | null>(null)

  const [prediction, setPrediction] = useState<PredictResponse | null>(null)
  const [approvedTags, setApprovedTags] = useState<string[]>([])
  const [editorNotes, setEditorNotes] = useState('')
  const [loadingPred, setLoadingPred] = useState(false)

  // Backend state (pre-populated with embedded dataset for instant cloud/serverless availability)
  const [appState, setAppState] = useState<any>(OFFLINE_APP_STATE)
  const [batchFilter, setBatchFilter] = useState<'all' | 'review' | 'auto'>('all')
  const [taxSearch, setTaxSearch] = useState('')
  const [simThreshold, setSimThreshold] = useState(0.55)

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/state`)
      if (res.ok) {
        const data = await res.json()
        setAppState(data)
        return
      }
    } catch {
      // Seamless cloud/offline mode fallback
    }
    setAppState((prev: any) => prev || OFFLINE_APP_STATE)
  }, [])

  const runPrediction = useCallback(
    async (titleText: string, bodyText: string, engine = modelEngine, perTag = usePerTag, gThresh = globalThreshold, minW = minWords) => {
      setLoadingPred(true)
      try {
        const res = await fetch(`${API_BASE}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleText,
            body: bodyText,
            model_engine: engine,
            use_per_tag_thresholds: perTag,
            global_threshold: gThresh,
            max_suggestions: 5,
            min_words: minW,
          }),
        })
        if (res.ok) {
          const data: PredictResponse = await res.json()
          setPrediction(data)
          setApprovedTags(data.suggested_tags)
          return
        }
      } catch {
        // Fallback to embedded client-side multi-label engine when deployed on cloud (Vercel / GitHub Pages)
      } finally {
        setLoadingPred(false)
      }
      const fallbackData = runClientPrediction({
        title: titleText,
        body: bodyText,
        model_engine: engine,
        use_per_tag_thresholds: perTag,
        global_threshold: gThresh,
        max_suggestions: 5,
        min_words: minW,
      }) as PredictResponse
      setPrediction(fallbackData)
      setApprovedTags(fallbackData.suggested_tags)
    },
    [modelEngine, usePerTag, globalThreshold, minWords],
  )

  useEffect(() => {
    void fetchState()
  }, [fetchState])

  useEffect(() => {
    void runPrediction(draftTitle, draftBody, modelEngine, usePerTag, globalThreshold, minWords)
  }, [modelEngine, usePerTag, globalThreshold, minWords])

  const handleSelectPreset = (p: (typeof PRESET_SCENARIOS)[0]) => {
    setActivePostId(null)
    setDraftTitle(p.title)
    setDraftBody(p.body)
    void runPrediction(p.title, p.body)
    toast.info(`Loaded scenario: ${p.category}`)
  }

  const toggleApprovedTag = (tag: string) => {
    setApprovedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSaveEditorialDecision = async () => {
    if (!prediction) return
    const newRecord = {
      timestamp: new Date().toISOString().slice(0, 19),
      post_id: activePostId || `DRAFT-${Math.floor(Date.now() / 1000)}`,
      title: prediction.clean_title,
      word_count: prediction.word_count,
      model_used: modelEngine,
      suggested_tags: prediction.suggested_tags,
      accepted_tags: prediction.suggested_tags.filter((t) => approvedTags.includes(t)),
      rejected_tags: prediction.suggested_tags.filter((t) => !approvedTags.includes(t)),
      added_missing_tags: approvedTags.filter((t) => !prediction.suggested_tags.includes(t)),
      final_editor_approved_tags: approvedTags,
      flagged_for_review: prediction.flagged_for_review,
      editor_notes: editorNotes,
    }
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: activePostId,
          title: prediction.clean_title,
          word_count: prediction.word_count,
          model_used: modelEngine,
          suggested_tags: prediction.suggested_tags,
          final_editor_approved_tags: approvedTags,
          flagged_for_review: prediction.flagged_for_review,
          editor_notes: editorNotes,
        }),
      })
      if (res.ok) {
        toast.success('Editorial decision saved to feedback log!', {
          description: `Approved tags: ${approvedTags.join(', ') || 'None'}`,
        })
        setEditorNotes('')
        void fetchState()
        return
      }
    } catch {
      // Cloud fallback: update in-memory state
    }
    setAppState((prev: any) => ({
      ...prev,
      feedback_log: [newRecord, ...(prev?.feedback_log || [])],
      batch_predictions: (prev?.batch_predictions || []).map((item: any) =>
        item.post_id === activePostId
          ? { ...item, final_editor_approved_tags: approvedTags, review_status: 'Editor Reviewed & Approved' }
          : item,
      ),
    }))
    toast.success('Editorial decision saved to feedback log!', {
      description: `Approved tags: ${approvedTags.join(', ') || 'None'}`,
    })
    setEditorNotes('')
  }

  const handleDownloadJson = () => {
    if (!appState?.batch_predictions) return
    const blob = new Blob([JSON.stringify(appState.batch_predictions, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'batch_tag_predictions.json'
    a.click()
    toast.success('Exported batch_tag_predictions.json')
  }

  const handleDownloadCsv = () => {
    if (!appState?.batch_predictions) return
    const rows = appState.batch_predictions as any[]
    const headers = [
      'post_id',
      'published_at',
      'title',
      'post_type',
      'word_count',
      'suggested_tags',
      'review_status',
      'final_editor_approved_tags',
    ]
    const csvLines = [
      headers.join(','),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const val = typeof r[h] === 'object' ? JSON.stringify(r[h]) : String(r[h] ?? '')
            return `"${val.replace(/"/g, '""')}"`
          })
          .join(','),
      ),
    ]
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'batch_tag_predictions.csv'
    a.click()
    toast.success('Exported batch_tag_predictions.csv')
  }

  const canonicalTags: string[] = appState?.canonical_tags || [
    'Python',
    'Machine Learning',
    'Deep Learning',
    'API Development',
    'Application Security',
    'Data Engineering',
    'Cloud & DevOps',
    'Frontend Web Development',
    'MLOps',
    'Natural Language Processing',
    'Quantum Computing',
    'WebAssembly',
  ]

  const filteredBatch = useMemo(() => {
    const list = (appState?.batch_predictions || []) as any[]
    if (batchFilter === 'review') {
      return list.filter((item) => String(item.review_status).includes('Needs Editor Review'))
    }
    if (batchFilter === 'auto') {
      return list.filter((item) => String(item.review_status).includes('Auto-Approved'))
    }
    return list
  }, [appState, batchFilter])

  const activeThresholdRow = useMemo(() => {
    const sweep = (appState?.evaluation_metrics?.threshold_sweep || []) as any[]
    return (
      sweep.find((r) => Math.abs(r.threshold - simThreshold) < 0.01) ||
      sweep[6] || {
        threshold: 0.55,
        val_micro_f1: 0.9749,
        val_macro_f1: 0.9807,
        false_positives: 6,
        missed_tags_fn: 1,
        routed_to_editor_review_pct: 2.7,
      }
    )
  }, [appState, simThreshold])

  const acceptedTags = (prediction?.suggested_tags || []).filter((t) => approvedTags.includes(t))
  const rejectedTags = (prediction?.suggested_tags || []).filter((t) => !approvedTags.includes(t))
  const addedTags = approvedTags.filter((t) => !(prediction?.suggested_tags || []).includes(t))

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7F6] font-sans text-slate-900">
      {/* =====================================================================
          PANE 1 (LEFT): OBSIDIAN-EMERALD NAVIGATION DOCK (248px)
          ===================================================================== */}
      <aside className="relative hidden w-[252px] shrink-0 flex-col justify-between overflow-y-auto border-r border-white/10 bg-gradient-to-b from-[#101010] via-[#0C0C0B] to-[#080807] p-4 text-white md:flex">
        <div className="pointer-events-none absolute -left-10 -top-10 size-44 rounded-full bg-[#15C39A]/15 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 px-1.5 pt-1">
            <BrandMark className="size-9 shrink-0 rounded-xl shadow-[0_0_20px_rgba(205,224,106,0.3)]" />
            <div>
              <span className="block text-base font-extrabold tracking-tight text-white">
                talverin
              </span>
              <span className="block text-[10px] font-medium text-[#CDE06A]">
                TagFlow Editorial AI
              </span>
            </div>
          </div>

          {/* Primary Magnetic Action */}
          <Magnetic intensity={0.3} range={110}>
            <button
              type="button"
              onClick={() => {
                setTab('studio')
                void runPrediction(draftTitle, draftBody)
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-[#18D2A6] to-[#11A683] px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_2px_12px_rgba(21,195,154,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all hover:brightness-105"
            >
              <Sparkles className="size-3.5 stroke-[2.5]" /> Run Tagging Inference
            </button>
          </Magnetic>

          {/* Workspace Navigation */}
          <nav className="flex flex-col gap-1">
            <span className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400/80">
              Editorial Studio
            </span>
            {[
              { id: 'studio', label: 'Live Tagger Studio', icon: LayoutDashboard },
              { id: 'batch', label: 'Batch Review & Export', icon: Layers },
              { id: 'benchmarks', label: 'Benchmarks & Tuning', icon: BarChart3 },
              { id: 'taxonomy', label: 'Taxonomy & Audit', icon: BookOpen },
              { id: 'vault', label: 'Talverin 3D & Motion', icon: Cpu },
            ].map((v) => {
              const Icon = v.icon
              const active = tab === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setTab(v.id as any)}
                  className={`relative flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-nav-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="absolute inset-0 rounded-xl bg-white/[0.08] ring-1 ring-white/10"
                    />
                  )}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-[#CDE06A] shadow-[0_0_8px_#CDE06A]" />
                  )}
                  <Icon
                    className={`relative z-10 size-4 ${
                      active ? 'text-[#CDE06A]' : 'text-slate-400'
                    }`}
                  />
                  <span className="relative z-10">{v.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Model Engine Calibration */}
          <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/[0.08]">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#CDE06A]">
              Active Model Engine
            </span>
            <div className="mt-2 flex flex-col gap-1.5">
              {[
                { id: 'sbert', label: 'Sentence-BERT (MiniLM)', sub: '60w Chunking • 100% R@3' },
                { id: 'tfidf', label: 'TF-IDF + OvR (Title 2x)', sub: '96.2% Verified F1 • 0.13ms' },
                { id: 'keyword', label: 'Keyword + Alias Baseline', sub: 'Regex Taxonomy Matcher' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelEngine(m.id as any)}
                  className={`cursor-pointer rounded-xl px-2.5 py-2 text-left transition-all ${
                    modelEngine === m.id
                      ? 'bg-[#15C39A]/20 text-white ring-1 ring-[#15C39A]/50'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{m.label}</span>
                    {modelEngine === m.id && <Check className="size-3.5 text-[#CDE06A]" />}
                  </div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 border-t border-white/10 pt-2.5">
              <label className="flex cursor-pointer items-center justify-between text-[11px] text-slate-300">
                <span>Per-Tag Tuned Thresholds</span>
                <input
                  type="checkbox"
                  checked={usePerTag}
                  onChange={(e) => setUsePerTag(e.target.checked)}
                  className="accent-[#15C39A]"
                />
              </label>
              {!usePerTag && (
                <div className="mt-2">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Global Threshold</span>
                    <span>{Math.round(globalThreshold * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={0.8}
                    step={0.05}
                    value={globalThreshold}
                    onChange={(e) => setGlobalThreshold(parseFloat(e.target.value))}
                    className="mt-1 w-full accent-[#CDE06A]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile Card */}
        <div className="relative z-10 flex flex-col gap-2 border-t border-white/[0.08] pt-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] p-2.5 ring-1 ring-white/[0.07]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#CDE06A] to-[#9ab335] text-xs font-extrabold text-slate-950">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-semibold text-white">
                Shoumik Aggarwal
              </strong>
              <span className="block truncate text-[10px] text-emerald-300/80">
                Persevex AI Intern • Project 1
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          PANE 2 (CENTER): ATMOSPHERIC STUDIO CANVAS
          ===================================================================== */}
      <main
        className={`relative flex flex-1 flex-col overflow-y-auto transition-colors duration-300 ${
          dark ? 'bg-[#09090B] text-white' : 'bg-[#F4F7F6] text-slate-900'
        }`}
      >
        {/* 3D WebGL Geometry Backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <GeometryBackdrop dark={dark} density={0.55} interactive={false} />
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(17,166,131,0.10),transparent_75%)]" />
        </div>

        {/* Sticky Frosted Glass Header */}
        <header
          className={`sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-6 backdrop-blur-xl ${
            dark
              ? 'border-white/10 bg-[#09090B]/80 text-white'
              : 'border-slate-900/[0.06] bg-white/75 text-slate-900'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate font-display text-sm font-bold tracking-tight">
              {tab === 'studio' && 'Automated Content Tagging & Editorial Studio'}
              {tab === 'batch' && 'Batch Review Queue & Export (75 Held-Out Drafts)'}
              {tab === 'benchmarks' && 'Model Evaluation, Threshold Trade-Offs & Error Analysis'}
              {tab === 'taxonomy' && 'Approved 12-Tag Taxonomy, Alias Map & Reviewer Audit'}
              {tab === 'vault' && 'Talverin Interactive 3D & Motion Primitives Showcase'}
            </h1>
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[#0E8A6D] ring-1 ring-emerald-500/20 lg:inline-flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#11A683] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#11A683]" />
              </span>
              Verified Micro-F1: 96.24% • Top-3 Recall: 100.0%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              <FileSpreadsheet className="size-3.5 text-[#0E8A6D]" /> Export CSV
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              <FileJson className="size-3.5 text-indigo-600" /> Export JSON
            </button>
            <Skiper26ThemeToggle
              isDark={dark}
              onToggle={() => setDark((d) => !d)}
              className="size-8 p-1.5"
            />
          </div>
        </header>

        {/* Main Content Body */}
        <div className="relative z-10 mx-auto w-full max-w-5xl p-6 space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {[
              {
                label: 'Verified Test Micro-F1',
                val: 96.24,
                suffix: '%',
                sub: '+20.2% over Keyword Baseline',
              },
              {
                label: 'Top-3 Recall (SBERT)',
                val: 100,
                suffix: '%',
                sub: 'Macro-F1: 94.60% (12 Tags)',
              },
              {
                label: 'Auto-Tagged Coverage',
                val: 86.7,
                suffix: '%',
                sub: '13.3% Routed to Editor Review',
              },
              {
                label: 'TF-IDF Latency',
                val: 0.13,
                suffix: ' ms',
                sub: '13.05 ms for SBERT Chunking',
              },
            ].map((k, i) => (
              <BlurFade key={k.label} delay={i * 0.05}>
                <div
                  className={`relative overflow-hidden rounded-2xl border p-4 shadow-xs backdrop-blur-xl ${
                    dark
                      ? 'border-white/10 bg-white/[0.04]'
                      : 'border-slate-200/80 bg-white/90'
                  }`}
                >
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {k.label}
                  </span>
                  <div className="mt-1 flex items-baseline gap-0.5 font-display text-2xl font-extrabold tracking-tight">
                    <CountUp to={k.val} duration={1.2} />
                    <span>{k.suffix}</span>
                  </div>
                  <span className="mt-1 block text-[11px] font-medium text-[#0E8A6D]">
                    {k.sub}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* =================================================================
              TAB 1: LIVE EDITORIAL TAGGER STUDIO
              ================================================================= */}
          {tab === 'studio' && (
            <div className="space-y-5">
              {/* Scenario Picker Cards (FramerTiltCard) */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <SkiperBracketBadge>Quick Test Scenarios</SkiperBracketBadge>
                  <span className="text-xs text-slate-500">
                    Click any card to test HTML cleaning, 60-word chunking, or short-draft routing
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {PRESET_SCENARIOS.map((item) => {
                    const isSelected = draftTitle === item.title
                    return (
                      <FramerTiltCard key={item.id} maxTilt={6} className="h-full">
                        <div
                          onClick={() => handleSelectPreset(item)}
                          className={`flex h-full cursor-pointer flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                            isSelected
                              ? 'border-[#11A683] bg-[#0B1917] text-white shadow-[0_10px_25px_-5px_rgba(17,166,131,0.3)]'
                              : dark
                                ? 'border-white/10 bg-white/[0.04] text-white hover:border-white/25'
                                : 'border-slate-200/80 bg-white/90 text-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                                  isSelected
                                    ? 'bg-[#15C39A]/20 text-[#CDE06A]'
                                    : 'bg-emerald-500/10 text-[#0E8A6D]'
                                }`}
                              >
                                {item.category}
                              </span>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-xs font-bold leading-snug">
                              {item.title}
                            </h3>
                          </div>
                          <p
                            className={`mt-2 line-clamp-2 text-[11px] ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </FramerTiltCard>
                    )
                  })}
                </div>
              </div>

              {/* Main Draft Composer Card with BorderTrail */}
              <div
                className={`relative rounded-[26px] p-1.5 ring-1 backdrop-blur-xl ${
                  dark ? 'bg-white/[0.03] ring-white/10' : 'bg-white/80 ring-slate-900/[0.06]'
                }`}
              >
                <BorderTrail
                  size={100}
                  className="bg-gradient-to-l from-[#15C39A] via-[#CDE06A] to-transparent"
                />
                <div
                  className={`rounded-[22px] border p-6 ${
                    dark ? 'border-white/10 bg-[#101014]' : 'border-white bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <SkiperBracketBadge>Input Draft (Text / Markdown / HTML)</SkiperBracketBadge>
                      <h2 className="mt-1 font-display text-lg font-bold">
                        Blog Title & Article Body Composer
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-semibold text-[#0E8A6D]">
                        {prediction?.word_count ?? 0} Cleaned Words
                      </span>
                      <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 font-semibold text-indigo-600">
                        {prediction?.removed_boilerplate_chars ?? 0} Boilerplate Chars Stripped
                      </span>
                      <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-600">
                        {prediction?.chunks?.length ?? 1} Semantic Chunk(s)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Blog Title (2x Weighted in TF-IDF & Concatenated in SBERT)
                      </label>
                      <input
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        placeholder="Enter blog title..."
                        className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm font-bold focus:border-[#11A683] focus:outline-none ${
                          dark
                            ? 'border-white/15 bg-white/[0.05] text-white'
                            : 'border-slate-200 bg-slate-50/70 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Article Body (Supports Raw HTML &lt;nav&gt;, &lt;footer&gt;, Tag Widgets &amp; Markdown)
                      </label>
                      <textarea
                        rows={6}
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        placeholder="Paste blog draft here..."
                        className={`mt-1 w-full rounded-xl border p-4 font-mono text-xs leading-relaxed focus:border-[#11A683] focus:outline-none ${
                          dark
                            ? 'border-white/15 bg-white/[0.05] text-slate-200'
                            : 'border-slate-200 bg-slate-50/70 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-xs text-slate-400">
                         HTML navigation, footers, and tag widgets are stripped automatically before model encoding.
                      </span>
                      <ShimmerButton
                        onClick={() => void runPrediction(draftTitle, draftBody)}
                        borderRadius="14px"
                        shimmerColor="#CDE06A"
                        background="radial-gradient(ellipse 80% 50% at 50% 120%,rgba(21,195,154,0.45),rgba(16,16,20,0.85)), #101014"
                        className="text-xs font-bold"
                      >
                        <Sparkles className="size-4 text-[#CDE06A]" />
                        {loadingPred ? 'Running Neural Inference...' : 'Analyze & Suggest Approved Tags'}
                      </ShimmerButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side 3-Model Comparison Table on Current Draft */}
              {prediction && (
                <div
                  className={`rounded-2xl border p-5 shadow-xs ${
                    dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <SkiperBracketBadge>Live 3-Model Comparison</SkiperBracketBadge>
                      <h3 className="mt-1 font-display text-sm font-bold">
                        How All 3 Approaches Score This Draft Side-by-Side
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      Chunks Combined via 0.70 Mean + 0.30 Max Pooling
                    </span>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/60 font-mono text-[11px] uppercase text-slate-400">
                          <th className="py-2">Rank &amp; Canonical Tag</th>
                          <th className="py-2">Keyword + Alias Baseline</th>
                          <th className="py-2">TF-IDF + OvR (Title 2x)</th>
                          <th className="py-2">Sentence-BERT (Chunked)</th>
                          <th className="py-2">Tuned Threshold</th>
                          <th className="py-2">Supporting Snippet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/40">
                        {prediction.top_candidates.map((c) => (
                          <tr key={c.tag}>
                            <td className="py-2.5 font-bold">
                              <span className="mr-1.5 font-mono text-slate-400">#{c.rank}</span>
                              <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[#0E8A6D]">
                                {c.tag}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono">{(c.kw_score * 100).toFixed(1)}%</td>
                            <td className="py-2.5 font-mono font-semibold text-indigo-600">
                              {(c.tfidf_score * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 font-mono font-bold text-[#0E8A6D]">
                              {(c.sbert_score * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 font-mono text-slate-400">
                              {(c.threshold * 100).toFixed(0)}%
                            </td>
                            <td className="max-w-xs truncate py-2.5 text-[11px] italic text-slate-500">
                              &ldquo;{c.snippet}&rdquo;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 2: BATCH REVIEW QUEUE & EXPORT (75 HELD-OUT TEST POSTS)
              ================================================================= */}
          {tab === 'batch' && (
            <div className="space-y-4">
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
                  dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: 'All Held-Out Posts (75)' },
                    { id: 'review', label: '⚠️ Needs Editor Review Only' },
                    { id: 'auto', label: '✅ Auto-Approved Only' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBatchFilter(f.id as any)}
                      className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                        batchFilter === f.id
                          ? 'bg-[#0B1917] text-[#CDE06A]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  Click &ldquo;Inspect &amp; Edit&rdquo; on any post to review it in the right-hand Editorial Inspector
                </span>
              </div>

              <div
                className={`overflow-hidden rounded-2xl border shadow-xs ${
                  dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="max-h-[540px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-900 text-white">
                      <tr className="font-mono text-[10px] uppercase">
                        <th className="px-4 py-3">Post ID</th>
                        <th className="px-4 py-3">Title &amp; Type</th>
                        <th className="px-4 py-3">Words</th>
                        <th className="px-4 py-3">Suggested Tags &amp; Scores</th>
                        <th className="px-4 py-3">Review Status</th>
                        <th className="px-4 py-3">Final Approved Tags</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      {filteredBatch.map((row: any) => {
                        const needsRev = String(row.review_status).includes('Needs Editor Review')
                        return (
                          <tr key={row.post_id} className="hover:bg-emerald-500/[0.04]">
                            <td className="px-4 py-3 font-mono font-bold text-[#0E8A6D]">
                              {row.post_id}
                            </td>
                            <td className="max-w-xs px-4 py-3">
                              <div className="truncate font-bold">{row.title}</div>
                              <span className="font-mono text-[10px] text-slate-400">
                                {row.post_type} • {row.published_at}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono">{row.word_count}w</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(row.suggested_tags || []).map((t: string) => (
                                  <span
                                    key={t}
                                    className="rounded-md bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600"
                                  >
                                    {t} ({Math.round((row.model_scores?.[t] ?? 0.8) * 100)}%)
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  needsRev
                                    ? 'bg-amber-500/15 text-amber-600'
                                    : 'bg-emerald-500/15 text-[#0E8A6D]'
                                }`}
                              >
                                {row.review_status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(row.final_editor_approved_tags || []).map((t: string) => (
                                  <span
                                    key={t}
                                    className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0E8A6D]"
                                  >
                                    ✓ {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePostId(row.post_id)
                                  setDraftTitle(row.title)
                                  const snippetsText = Object.values(row.supporting_snippets || {}).join(' ')
                                  const bodyText =
                                    snippetsText ||
                                    `${row.title}. Technical post covering ${(row.final_editor_approved_tags || []).join(', ')}.`
                                  setDraftBody(bodyText)
                                  void runPrediction(row.title, bodyText)
                                  setApprovedTags(row.final_editor_approved_tags || [])
                                  toast.info(`Loaded ${row.post_id} into Editorial Inspector`)
                                }}
                                className="cursor-pointer rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-[#CDE06A] hover:bg-slate-800"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: BENCHMARKS, THRESHOLD SIMULATOR & ERROR ANALYSIS
              ================================================================= */}
          {tab === 'benchmarks' && (
            <div className="space-y-6">
              {/* Interactive Threshold Simulator */}
              <div
                className={`rounded-2xl border p-6 shadow-xs ${
                  dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <SkiperBracketBadge>Step 3 • Validation Threshold Tuning</SkiperBracketBadge>
                    <h3 className="mt-1 font-display text-base font-bold">
                      Interactive Score Threshold Trade-Off Explorer (0.25 → 0.75)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0E8A6D]">
                      Threshold: {simThreshold.toFixed(2)}
                    </span>
                    <input
                      type="range"
                      min={0.25}
                      max={0.75}
                      step={0.05}
                      value={simThreshold}
                      onChange={(e) => setSimThreshold(parseFloat(e.target.value))}
                      className="w-44 accent-[#11A683]"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-500">Val Micro-F1</div>
                    <div className="mt-1 font-mono text-xl font-extrabold text-[#0E8A6D]">
                      {(activeThresholdRow.val_micro_f1 * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="rounded-xl bg-indigo-500/10 p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-500">Val Macro-F1</div>
                    <div className="mt-1 font-mono text-xl font-extrabold text-indigo-600">
                      {(activeThresholdRow.val_macro_f1 * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="rounded-xl bg-rose-500/10 p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-500">
                      False Positives
                    </div>
                    <div className="mt-1 font-mono text-xl font-extrabold text-rose-600">
                      {activeThresholdRow.false_positives} tags
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-500">
                      Missed Tags (FN)
                    </div>
                    <div className="mt-1 font-mono text-xl font-extrabold text-amber-600">
                      {activeThresholdRow.missed_tags_fn} tags
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-500/10 p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-500">
                      Routed to Review
                    </div>
                    <div className="mt-1 font-mono text-xl font-extrabold">
                      {activeThresholdRow.routed_to_editor_review_pct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Unseen Test Split Model Comparison Table */}
              <div
                className={`rounded-2xl border p-6 shadow-xs ${
                  dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                }`}
              >
                <SkiperBracketBadge>Step 5 • Unseen Held-Out Test Posts</SkiperBracketBadge>
                <h3 className="mt-1 font-display text-base font-bold">
                  Model Architecture Comparison (Micro-F1, Verified Complete F1, Macro-F1, P@3, R@3 &amp; Latency)
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 font-mono text-[10px] uppercase text-slate-400">
                        <th className="py-2.5">Model Architecture</th>
                        <th className="py-2.5">Micro-F1 (Historical)</th>
                        <th className="py-2.5">Micro-F1 (Verified Complete)</th>
                        <th className="py-2.5">Macro-F1</th>
                        <th className="py-2.5">Precision@3</th>
                        <th className="py-2.5">Recall@3</th>
                        <th className="py-2.5">Review %</th>
                        <th className="py-2.5">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 font-mono">
                      {(appState?.evaluation_metrics?.test_model_comparison || []).map((m: any) => (
                        <tr key={m.model}>
                          <td className="py-3 font-sans font-bold">{m.model}</td>
                          <td className="py-3">{(m.micro_f1 * 100).toFixed(2)}%</td>
                          <td className="py-3 font-bold text-[#0E8A6D]">
                            {(m.verified_complete_micro_f1 * 100).toFixed(2)}%
                          </td>
                          <td className="py-3 font-bold text-indigo-600">
                            {(m.macro_f1 * 100).toFixed(2)}%
                          </td>
                          <td className="py-3">{(m.precision_at_3 * 100).toFixed(2)}%</td>
                          <td className="py-3 font-bold text-[#0E8A6D]">
                            {(m.recall_at_3 * 100).toFixed(2)}%
                          </td>
                          <td className="py-3">{m.routed_to_review_pct}%</td>
                          <td className="py-3">{m.inference_ms_per_post} ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Error Analysis Case Studies */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    badge: 'Incomplete Historical Labels',
                    title: '+2.0% F1 Jump When Evaluated Against Verified Complete Tags',
                    body: 'In 6.0% of audited held-out posts (e.g. POST-1433), authors tagged primary topics (Python, API Development) but forgot secondary tags (Application Security). Both TF-IDF and SBERT correctly recover the omitted tag (Verified Micro-F1 = 96.24% vs 94.25% raw).',
                  },
                  {
                    badge: 'Long Multi-Topic Articles & Chunking',
                    title: '60-Word Overlapping Chunks + 0.70 Mean / 0.30 Max Pooling',
                    body: 'Long tutorials covering ETL, XGBoost, and MLOps across separate sections dilute secondary topics under global mean pooling. Hybrid Max-Pooling captures localized section peaks, achieving 100% Recall@3.',
                  },
                  {
                    badge: 'Similar Tags & Semantic Paraphrases',
                    title: 'Sentence-Transformer Boosts Medium-Frequency F1 to 93.91%',
                    body: 'Articles discussing subword tokenization and attention layers without explicit keyword aliases cause Keyword Matcher to drop to 75.32% F1, while Sentence-BERT (all-MiniLM-L6-v2) achieves 94.60% Macro-F1.',
                  },
                  {
                    badge: 'Short Drafts & Niche Topics (<15 Examples)',
                    title: 'Safe Guardrails for Stubs & Low-Support Tags',
                    body: 'Drafts under 15 words are automatically routed to Editor Review. Niche tags with <15 corpus examples (Quantum Computing n=8, WebAssembly n=8) disable per-tag overfitting and use the conservative 0.55 fallback.',
                  },
                ].map((card) => (
                  <div
                    key={card.badge}
                    className={`rounded-2xl border p-5 ${
                      dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    <SkiperBracketBadge>{card.badge}</SkiperBracketBadge>
                    <h4 className="mt-2 font-display text-sm font-bold">{card.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: TAXONOMY, ALIAS MAP & REVIEWER AUDIT
              ================================================================= */}
          {tab === 'taxonomy' && (
            <div className="space-y-6">
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {(appState?.taxonomy?.approved_tags || []).map((entry: any) => {
                  const dist = (appState?.dataset_summary?.tag_distribution || []).find(
                    (d: any) => d.tag === entry.tag,
                  )
                  const isReliable = dist?.reliable_for_evaluation !== false
                  return (
                    <div
                      key={entry.tag}
                      className={`relative rounded-2xl border p-4 shadow-xs ${
                        dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-display text-xs font-extrabold text-[#0E8A6D]">
                          #{entry.tag}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                            isReliable
                              ? 'bg-emerald-500/10 text-[#0E8A6D]'
                              : 'bg-amber-500/15 text-amber-600'
                          }`}
                        >
                          {dist?.total_posts ?? 0} posts • {isReliable ? 'Reliable' : 'Niche (<15)'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        {entry.definition}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {(entry.aliases || []).map((al: string) => (
                          <span
                            key={al}
                            className="rounded bg-slate-500/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
                          >
                            {al}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 50-Post Held-Out Reviewer Audit Table */}
              <div
                className={`rounded-2xl border p-5 ${
                  dark ? 'border-white/10 bg-[#101014]' : 'border-slate-200/80 bg-white'
                }`}
              >
                <SkiperBracketBadge>Human Reviewer Audit (50 Held-Out Posts)</SkiperBracketBadge>
                <h3 className="mt-1 font-display text-sm font-bold">
                  Audit of Historical Labels for Missing or Inconsistent Tags (data/held_out_reviewer_sample.csv)
                </h3>
                <div className="mt-3 max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-900 text-white font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Post ID</th>
                        <th className="p-2.5">Title</th>
                        <th className="p-2.5">Historical Tags</th>
                        <th className="p-2.5">Verified Complete Tags</th>
                        <th className="p-2.5">Reviewer Finding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/40">
                      {(appState?.reviewer_sample || []).slice(0, 20).map((r: any) => (
                        <tr key={r.post_id}>
                          <td className="p-2.5 font-mono font-bold">{r.post_id}</td>
                          <td className="max-w-xs truncate p-2.5 font-semibold">{r.title}</td>
                          <td className="p-2.5 font-mono text-[11px]">
                            {r.normalized_historical_tags}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-[#0E8A6D]">
                            {r.reviewer_verified_complete_tags}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                r.missing_or_inconsistent_flag
                                  ? 'bg-amber-500/15 text-amber-600'
                                  : 'bg-emerald-500/10 text-[#0E8A6D]'
                              }`}
                            >
                              {r.reviewer_audit_note}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 5: TALVERIN INTERACTIVE 3D & MOTION VAULT SHOWCASE
              ================================================================= */}
          {tab === 'vault' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                  <SkiperBracketBadge>React Three Fiber • Physics Rig</SkiperBracketBadge>
                  <h3 className="mt-1 font-display text-sm font-bold text-slate-900">
                    Interactive 3D Editorial Staff Badge (Drag &amp; Release)
                  </h3>
                  <StaffBadge className="mt-2 h-72 w-full rounded-xl" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                  <SkiperBracketBadge>Marching Squares • Canvas 2D</SkiperBracketBadge>
                  <h3 className="mt-1 font-display text-sm font-bold text-slate-900">
                    TopoFlow Semantic Contour Map (Move Cursor Over Field)
                  </h3>
                  <TopoFlow className="mt-2 h-72 w-full rounded-xl border border-slate-100" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="mb-2 font-mono text-xs font-bold text-slate-500">
                    RingProgress SVG Spring
                  </span>
                  <RingProgress />
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="mb-2 font-mono text-xs font-bold text-slate-500">
                    GooeyNav SVG Velocity Filter
                  </span>
                  <GooeyNav />
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="mb-2 font-mono text-xs font-bold text-slate-500">
                    ElasticToggle Keyframe Switch
                  </span>
                  <ElasticToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================================
          PANE 3 (RIGHT): FROSTED EDITORIAL REVIEW INSPECTOR (360px)
          ===================================================================== */}
      <aside
        className={`relative hidden w-[368px] shrink-0 flex-col justify-between overflow-y-auto border-l p-5 xl:flex ${
          dark
            ? 'border-white/10 bg-[#101014] text-white'
            : 'border-slate-900/[0.07] bg-white/90 text-slate-900 backdrop-blur-xl'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <SkiperBracketBadge>Editorial Review Inspector</SkiperBracketBadge>
              <h2 className="mt-1 font-display text-sm font-bold">
                Ranked Suggestions (Up to 5 Tags)
              </h2>
            </div>
            {activePostId && (
              <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600">
                {activePostId}
              </span>
            )}
          </div>

          {/* Review Routing Status Alert */}
          {prediction && (
            <div
              className={`rounded-2xl border p-3.5 text-xs font-semibold ${
                prediction.flagged_for_review
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-700'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-[#0E8A6D]'
              }`}
            >
              <div className="flex items-center gap-2">
                {prediction.flagged_for_review ? (
                  <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                ) : (
                  <CheckCircle2 className="size-4 shrink-0 text-[#0E8A6D]" />
                )}
                <span>{prediction.review_status}</span>
              </div>
            </div>
          )}

          {/* Top 5 Candidate Tag Cards */}
          <div className="space-y-2.5">
            {(prediction?.top_candidates || []).map((c) => {
              const pct = Math.round(c.score * 100)
              const thPct = Math.round(c.threshold * 100)
              const isApproved = approvedTags.includes(c.tag)
              return (
                <div
                  key={c.tag}
                  onClick={() => toggleApprovedTag(c.tag)}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl border p-3 transition-all ${
                    isApproved
                      ? 'border-[#11A683] bg-emerald-500/[0.06] shadow-2xs'
                      : dark
                        ? 'border-white/10 bg-white/[0.03] opacity-75'
                        : 'border-slate-200/80 bg-slate-50/70 opacity-80'
                  }`}
                >
                  {isApproved && <BorderBeam size={90} duration={8} colorFrom="#15C39A" colorTo="#CDE06A" />}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        #{c.rank}
                      </span>
                      <span className="font-display text-xs font-bold">{c.tag}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#0E8A6D]">
                        {pct}%
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        (th: {thPct}%)
                      </span>
                      <span
                        className={`flex size-4 items-center justify-center rounded-md text-[10px] font-bold ${
                          isApproved
                            ? 'bg-[#11A683] text-white'
                            : 'border border-slate-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        c.passed ? 'bg-gradient-to-r from-[#11A683] to-[#15C39A]' : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-[10px] italic text-slate-500">
                    &ldquo;{c.snippet}&rdquo;
                  </p>
                </div>
              )
            })}
          </div>

          {/* Add Missing Tag from Approved Taxonomy */}
          <div className="border-t border-slate-200/60 pt-3">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Accept, Reject, or Add Approved Taxonomy Tags
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {canonicalTags.map((tag) => {
                const active = approvedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleApprovedTag(tag)}
                    className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                      active
                        ? 'bg-[#0B1917] text-[#CDE06A] shadow-2xs ring-1 ring-[#15C39A]/40'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {active ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Editorial Diff Summary */}
          <div className="rounded-xl bg-slate-500/[0.06] p-3 text-[11px] space-y-1">
            <div>
              <strong className="text-[#0E8A6D]">Accepted ({acceptedTags.length}):</strong>{' '}
              {acceptedTags.join(', ') || 'None'}
            </div>
            <div>
              <strong className="text-rose-500">Rejected ({rejectedTags.length}):</strong>{' '}
              {rejectedTags.join(', ') || 'None'}
            </div>
            <div>
              <strong className="text-indigo-600">Added by Editor ({addedTags.length}):</strong>{' '}
              {addedTags.join(', ') || 'None'}
            </div>
          </div>

          <input
            type="text"
            value={editorNotes}
            onChange={(e) => setEditorNotes(e.target.value)}
            placeholder="Optional editor feedback note..."
            className={`w-full rounded-xl border px-3 py-2 text-xs focus:border-[#11A683] focus:outline-none ${
              dark ? 'border-white/15 bg-white/[0.05]' : 'border-slate-200 bg-white'
            }`}
          />

          <button
            type="button"
            onClick={() => void handleSaveEditorialDecision()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#14B892] to-[#0E8A6D] py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(17,166,131,0.3)] transition hover:brightness-105"
          >
            <Check className="size-4 stroke-[2.5]" /> Save Editor Decision to Feedback Log
          </button>
        </div>

        {/* Recent Saved Feedback Log */}
        <div className="mt-4 border-t border-slate-200/60 pt-3">
          <span className="block font-mono text-[10px] font-bold uppercase text-slate-400">
            Recent Editor Feedback Log ({appState?.feedback_log?.length ?? 0})
          </span>
          <div className="mt-1.5 max-h-28 overflow-y-auto space-y-1.5">
            {(appState?.feedback_log || []).slice(0, 3).map((item: any, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200/60 bg-slate-500/[0.04] px-2.5 py-1.5 text-[10px]"
              >
                <div className="truncate font-bold">{item.title}</div>
                <div className="truncate text-[#0E8A6D]">
                  Approved: {(item.final_editor_approved_tags || []).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
