import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ArchitectureKey = 'sagescan' | 'oie' | 'querymind';

type ArchitectureStage = {
  title: string;
  outcome: string;
  stack: string;
};

type ArchitectureSummary = {
  eyebrow: string;
  title: string;
  description: string;
  focus: string;
  stageLabel: string;
  desktopNote: string;
  mobileHighlights: { label: string; value: string }[];
  stages: ArchitectureStage[];
  decision: string;
};

type CombinedDesignDecision = {
  q: string;
  a: string;
};

type CombinedDesignCard = {
  id: ArchitectureKey;
  title: string;
  subtitle: string;
  githubUrl: string;
  metrics: string[];
  decisions: CombinedDesignDecision[];
  tradeoffs: string;
  whatIdDoDiff: string;
};

const ARCHITECTURE_SUMMARIES: Record<ArchitectureKey, ArchitectureSummary> = {
  sagescan: {
    eyebrow: 'CLI Tool · Data Quality · Go + Python',
    title: 'SageScan',
    description: 'Production-grade CLI data quality validator — 125,547 rows/sec, drift detection, published to PyPI.',
    focus: 'Production-grade CLI data quality validator — 125,547 rows/sec, drift detection, published to PyPI.',
    stageLabel: 'Pipeline flow',
    desktopNote: 'Open on desktop for the full architecture diagram.',
    mobileHighlights: [
      { label: 'Problem', value: 'Catch bad data before it reaches production.' },
      { label: 'Approach', value: 'Go CLI + Python checks + JSON bridge.' },
      { label: 'Outcome', value: '125,547 rows/sec throughput, 100% drift detection accuracy.' }
    ],
    stages: [
      { title: 'Input', outcome: 'YAML Rules Config', stack: 'Go + Cobra' },
      { title: 'Bridge', outcome: 'JSON Bridge (stdin/stdout)', stack: 'stdin/stdout' },
      { title: 'Validation', outcome: 'Python Engine (main.py) + 17 types of Validators', stack: 'Pandas + Pydantic' },
      { title: 'Output', outcome: 'CLI Report / JSON Output (--fail-fast)', stack: 'CLI / JSON' }
    ],
    decision: 'Go gives single-binary distribution and instant startup — no virtualenv friction in CI. Python owns the statistical logic.'
  },
  oie: {
    eyebrow: 'AIOps workflow',
    title: 'OI-Engine',
    description: 'An incident triage system that filters noisy logs, routes real signals through CrewAI, and produces actionable summaries instead of page spam.',
    focus: 'Fast statistical filtering, then deeper LLM analysis only when needed.',
    stageLabel: 'Incident path',
    desktopNote: 'Open on desktop for the full architecture diagram.',
    mobileHighlights: [
      { label: 'Problem', value: 'Too many noisy infra alerts.' },
      { label: 'Approach', value: 'Fast filter first, CrewAI second, confidence gating last.' },
      { label: 'Outcome', value: 'Cleaner incidents and fewer false pages.' }
    ],
    stages: [
      { title: 'Ingest', outcome: 'FastAPI receives logs and request context', stack: 'FastAPI + Redis' },
      { title: 'Filter', outcome: 'Cheap anomaly checks cut obvious noise early', stack: 'Z-score / heuristics' },
      { title: 'Orchestrate', outcome: 'CrewAI delegates report, fix, analysis, and root cause work', stack: 'CrewAI + LLM' },
      { title: 'Persist', outcome: 'Incidents and embeddings are stored for reuse', stack: 'Postgres + pgvector' }
    ],
    decision: 'Use confidence gating so alerts stay useful and false pages stay low.'
  },
  querymind: {
    eyebrow: 'NL-to-SQL · Data Warehouse · RAG',
    title: 'QueryMind-DW',
    description: 'End-to-end data warehouse with an LLM SQL agent — ask in plain English, get validated SQL + results.',
    focus: 'End-to-end data warehouse with an LLM SQL agent — ask in plain English, get validated SQL + results.',
    stageLabel: 'Data path',
    desktopNote: 'Open on desktop for the full architecture diagram.',
    mobileHighlights: [
      { label: 'Problem', value: 'Plain-English analytics without broken SQL.' },
      { label: 'Approach', value: 'Kafka, dbt, RAG, SQL validation, Redis cache.' },
      { label: 'Outcome', value: 'Fresh answers with lower cost and safe execution.' }
    ],
    stages: [
      { title: 'Ingest', outcome: 'Kafka Ingest → MinIO Data Lake', stack: 'Kafka + MinIO' },
      { title: 'Transform', outcome: 'dbt Transforms (SCD Type 2 → Facts → Marts)', stack: 'dbt + DuckDB/Postgres' },
      { title: 'Query', outcome: 'RAG Schema Retriever → GPT-4 SQL Generator', stack: 'RAG + GPT-4' },
      { title: 'Serve', outcome: 'SQL Safety Validator → Redis Cache Layer', stack: 'SQL validation + Redis' }
    ],
    decision: 'Prefer RAG over fine-tuning so schema changes do not stale the assistant.'
  }
};

const DESIGN_DECISION_CARDS: Record<ArchitectureKey, CombinedDesignCard> = {
  sagescan: {
    id: 'sagescan',
    title: 'SageScan',
    subtitle: 'CLI Tool · Data Quality · Go + Python · PyPI',
    githubUrl: 'github.com/abhishek09827/SageScan',
    metrics: ['Throughput: 125,547 rows/sec', 'Drift detection: 100% accuracy at ≥1σ shift', 'Peak memory: 599MB', 'Validator types: 17'],
    decisions: [
      { q: 'WHY Go CLI + Python engine?', a: 'Go gives single-binary distribution and instant startup — no virtualenv friction in CI. Python owns the statistical logic. JSON over stdin/stdout bridges them at ~20ms.' },
      { q: 'WHY 17 validator types including drift?', a: 'Schema checks alone miss real failures. A column can be non-null and still have a drifted distribution. KS test and PSI catch what regex never could.' },
      { q: 'WHY make AI layer optional?', a: 'Core validation must be deterministic and offline-capable. No API key = still fully functional. AI is a productivity layer, not a dependency.' },
      { q: 'WHY send only column stats to GPT-4?', a: 'PII stays local. Only aggregates (mean, std, null%) go to the model. Privacy-first by design — safe for financial and healthcare data pipelines.' }
    ],
    tradeoffs: 'Single binary vs rich ecosystem —\nGo binary is fast but Python statistical ecosystem lives in a subprocess. JSON bridge adds ~20ms per call overhead.\nDeterministic vs AI-generated rules —\nGPT-4 rule generation is convenient but output must be reviewed before committing. Never auto-apply generated rules to production.',
    whatIdDoDiff: 'Add a Polars backend as opt-in. Pandas is 10-50x slower on large files. Already on the roadmap for v1.1 — would push throughput well past 500K rows/sec.'
  },
  oie: {
    id: 'oie',
    title: 'OI-Engine',
    subtitle: 'Turn noisy infra logs into actionable incidents with a fast filter, CrewAI orchestration, and confidence gating.',
    githubUrl: 'github.com/abhishek09827/Operational-Intelligence-Engine',
    metrics: ['<5s to JIRA ticket', '~60% fewer false pages', 'Mistral 7B + CrewAI'],
    decisions: [
      { q: 'WHY two-stage detection instead of LLM-only?', a: 'LLMs are slow and expensive. Z-score runs in microseconds and filters most of the noise. Only genuine anomaly candidates reach the LLM.' },
      { q: 'WHY confidence threshold at 0.75 before paging?', a: 'Alert fatigue is an engineering culture problem. A threshold dropped false positive pages by about 60%. Engineers trust alerts they receive.' },
      { q: 'WHY Mistral 7B over GPT-4?', a: 'Self-hostable. No log data leaves the network. In an ops context, data residency matters, and Mistral 7B performs well on classification tasks.' },
      { q: 'WHY feedback loop back to context store?', a: 'Static models go stale. Every incident an engineer resolves becomes a future few-shot example. The system gets smarter with each production event.' }
    ],
    tradeoffs: '30s windows vs sub-minute spikes - Tumbling windows miss anomalies shorter than the window. Sliding windows would catch more but cost 3x compute.\nMistral 7B vs GPT-4 accuracy - GPT-4 gives better root cause explanations. Mistral is faster and private. I chose privacy plus speed.',
    whatIdDoDiff: 'Add a graph correlation layer. Right now each service is analyzed independently. Cascading failures would be caught much earlier with a dependency graph overlay.'
  },
  querymind: {
    id: 'querymind',
    title: 'QueryMind-DW',
    subtitle: 'NL-to-SQL · Data Warehouse · RAG · LLM',
    githubUrl: 'github.com/abhishek09827/QueryMind-DW',
    metrics: ['NL-to-SQL accuracy: 75%', 'Cache hit latency: 1.0ms', 'Cache hit rate: 20%', 'Destructive queries blocked: 8'],
    decisions: [
      { q: 'WHY RAG over fine-tuning?', a: 'Schemas change weekly. RAG always retrieves current metadata — zero retraining overhead.' },
      { q: 'WHY Redis cache on NL-to-SQL?', a: '20% of queries repeat. Cache hit drops latency from 14,912ms to 1ms — 14,912x faster response and zero LLM spend on repeated questions.' },
      { q: 'WHY SQL safety validator?', a: 'LLMs don\'t distinguish read vs write intent. Validator intercepted 8 DROP/DELETE/TRUNCATE attempts before any reached Postgres.' },
      { q: 'WHY dbt for transforms?', a: 'Version-controlled SQL transformations with SCD Type 2 for slowly changing dimensions — lineage and rollback built in.' }
    ],
    tradeoffs: 'Accuracy vs Coverage —\n75% accuracy on 6-query benchmark is honest. Wider benchmark would likely show lower accuracy on highly ambiguous natural language queries.\nCache hit rate vs Freshness —\n20% hit rate is real. TTL must be tuned against schema update frequency to avoid stale results.',
    whatIdDoDiff: 'Add a query rewriter step before RAG retrieval. Ambiguous phrasings degrade schema lookup quality. Rewriting to canonical form first would push accuracy meaningfully above 75%.'
  }
};

const useCompactViewport = (query = '(max-width: 900px)') => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
};

const MobileArchitectureSummary: React.FC<{ summary: ArchitectureSummary, isCompact?: boolean }> = ({ summary, isCompact = true }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', flexShrink: 0, width: isCompact ? 'auto' : '320px', overflowY: 'auto' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{summary.eyebrow}</div>
        <div style={{ color: 'var(--text)', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>{summary.title}</div>
        <div style={{ color: 'var(--text)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>{summary.description}</div>
        <div style={{ color: 'var(--cyan)', fontSize: '12px', lineHeight: 1.6, borderLeft: '2px solid var(--cyan)', paddingLeft: '10px' }}>{summary.focus}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{summary.stageLabel}</div>
        {summary.mobileHighlights.map((item) => (
          <div key={item.label} style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'var(--cyan)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: 1.55 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.04)', padding: '14px' }}>
        <div style={{ color: 'var(--cyan)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Decision</div>
        <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: 1.6 }}>{summary.decision}</div>
      </div>

      {isCompact && (
        <div style={{ color: 'var(--dim)', fontSize: '11px', lineHeight: 1.6, textAlign: 'center', padding: '2px 0 0' }}>
          {summary.desktopNote}
        </div>
      )}
    </div>
  );
};



// --- GRAPH VIEW ---
export const GraphView: React.FC = () => {
  const [activeGraph, setActiveGraph] = useState<ArchitectureKey>('sagescan');
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);
  const isCompact = useCompactViewport();
  const activeSummary = ARCHITECTURE_SUMMARIES[activeGraph];

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const group = target.closest('.node-group');
      if (group) {
        const tip = group.getAttribute('data-tip');
        if (tip) {
          setTooltip({ text: tip, x: e.clientX, y: e.clientY });
        }
      } else {
        setTooltip(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip) {
        setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
      }
    };

    const container = document.getElementById('graph-container');
    if (container) {
      container.addEventListener('mouseover', handleMouseOver);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseout', () => setTooltip(null));
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseover', handleMouseOver);
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [activeGraph, tooltip]);

  return (
    <div className="glass-panel" id="graph-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%', position: 'relative' }}>
      <div dangerouslySetInnerHTML={{ __html: `
<style>
.arch-svg {
  width: 100%;
  height: auto;
  display: block;
  max-height: 100%;
  min-width: 900px;
}
.arch-svg text {
  font-weight: 500;
}
.node-group { cursor: pointer; }
/* Target rect and text directly since classes might be missing */
.node-group:hover rect { filter: brightness(1.3); }
.node-group:hover text { fill: #fff !important; }

/* Tooltip style */
.svg-tooltip {
  position: fixed;
  background: rgba(12,16,24,0.95);
  border: 1px solid var(--cyan);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--cyan);
  pointer-events: none;
  z-index: 9999;
  max-width: 250px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.4;
  font-family: var(--font);
}
</style>
` }} />
      
      {tooltip && (
        <div className="svg-tooltip" style={{ left: tooltip.x + 15, top: tooltip.y - 10 }}>
          {tooltip.text}
        </div>
      )}

      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>ARCHITECTURE_FLOWS</span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setActiveGraph('sagescan')}
            style={{ background: activeGraph === 'sagescan' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'sagescan' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >SageScan</button>
          <button
            onClick={() => setActiveGraph('oie')}
            style={{ background: activeGraph === 'oie' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'oie' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >OI-Engine</button>
          <button
            onClick={() => setActiveGraph('querymind')}
            style={{ background: activeGraph === 'querymind' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'querymind' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >QueryMind-DW</button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isCompact ? 'column' : 'row' }}>
        <MobileArchitectureSummary summary={activeSummary} isCompact={isCompact} />
        <div style={{ flex: 1, overflow: 'auto', padding: isCompact ? '0' : '24px', display: isCompact ? 'none' : 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'var(--bg2)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGraph}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'center' }}
          >
            {activeGraph === 'sagescan' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: `<svg id="svg-sagescan" class="arch-svg" viewBox="0 0 900 460" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Glows -->
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <!-- Arrow markers -->
          <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" opacity=".8"/>
          </marker>
          <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#b06aff" opacity=".8"/>
          </marker>
          <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00ff9d" opacity=".8"/>
          </marker>
          <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ffd700" opacity=".8"/>
          </marker>
          <!-- Gradients -->
          <linearGradient id="grad-cli" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00d4ff" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#00d4ff" stop-opacity=".06"/>
          </linearGradient>
          <linearGradient id="grad-py" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b06aff" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#b06aff" stop-opacity=".06"/>
          </linearGradient>
          <linearGradient id="grad-ai" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffd700" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#ffd700" stop-opacity=".06"/>
          </linearGradient>
          <linearGradient id="grad-out" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00ff9d" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#00ff9d" stop-opacity=".06"/>
          </linearGradient>
        </defs>

        <!-- Background grid -->
        <pattern id="grid-s" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        </pattern>
        <rect width="900" height="460" fill="url(#grid-s)"/>

        <!-- ── EDGES ── -->
        <!-- User → CLI -->
        <line x1="80" y1="50" x2="220" y2="50" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arrow-cyan)"/>
        <!-- CLI → JSON Bridge -->
        <line x1="340" y1="80" x2="340" y2="130" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arrow-cyan)"/>
        <!-- JSON → Python Engine -->
        <line x1="340" y1="160" x2="340" y2="210" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arrow-purple)"/>
        <!-- Python → Pydantic -->
        <path d="M 270 260 L 170 310" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arrow-purple)"/>
        <!-- Python → Validators -->
        <path d="M 410 260 L 510 310" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arrow-purple)"/>
        <!-- Python → AI Layer -->
        <path d="M 340 260 L 340 310" stroke="#ffd700" stroke-width="1.5" stroke-opacity=".4" stroke-dasharray="5,4" fill="none" marker-end="url(#arrow-amber)"/>
        <!-- Validators branches -->
        <path d="M 510 360 L 400 400" stroke="#b06aff" stroke-width="1" stroke-opacity=".4" fill="none" marker-end="url(#arrow-purple)"/>
        <path d="M 510 360 L 495 400" stroke="#b06aff" stroke-width="1" stroke-opacity=".4" fill="none" marker-end="url(#arrow-purple)"/>
        <path d="M 510 360 L 590 400" stroke="#b06aff" stroke-width="1" stroke-opacity=".4" fill="none" marker-end="url(#arrow-purple)"/>
        <!-- Output -->


        <!-- ── NODES ── -->

        <!-- User input -->
        <g class="node-group" data-tip="Developer runs: sagescan validate rules.yaml in CLI">
          <rect x="10" y="28" width="70" height="44" rx="6" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".4"/>
          <text x="45" y="47" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">YAML</text>
          <text x="45" y="60" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Config</text>
        </g>
        <text x="85" y="65" font-family="JetBrains Mono" font-size="9" fill="rgba(255,255,255,0.3)">rules.yaml</text>

        <!-- CLI block -->
        <g class="node-group" data-tip="Go CLI built with Cobra. Commands: validate, profile, report, generate-rules, init. Single binary, no runtime needed.">
          <rect x="220" y="20" width="240" height="60" rx="8" fill="url(#grad-cli)" stroke="#00d4ff" stroke-width="1.5" filter="url(#glow-cyan)"/>
          <text x="340" y="42" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="600" fill="#00d4ff">Go CLI (Cobra)</text>
          <text x="340" y="58" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,212,255,0.6)">validate │ profile │ report │ generate-rules</text>
        </g>

        <!-- JSON Bridge -->
        <g class="node-group" data-tip="JSON over stdin/stdout — language-agnostic bridge. Simple, debuggable, ~20ms overhead.">
          <rect x="270" y="130" width="140" height="30" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4,3"/>
          <text x="340" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="rgba(255,255,255,0.4)">JSON via stdin/stdout</text>
        </g>

        <!-- Python Engine -->
        <g class="node-group" data-tip="Python engine (main.py). Command router → runner → pipeline → validators. Rich pandas/scipy ecosystem for statistical validation.">
          <rect x="200" y="210" width="280" height="50" rx="8" fill="url(#grad-py)" stroke="#b06aff" stroke-width="1.5" filter="url(#glow-purple)"/>
          <text x="340" y="232" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="600" fill="#b06aff">Python Engine (main.py)</text>
          <text x="340" y="248" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(176,106,255,0.6)">router → runner → pipeline → validators</text>
        </g>

        <!-- Pydantic -->
        <g class="node-group" data-tip="Pydantic v2 strict schema validation. Catches malformed config YAML before any data is loaded.">
          <rect x="90" y="310" width="160" height="44" rx="6" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="170" y="330" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#b06aff">Pydantic v2</text>
          <text x="170" y="345" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(176,106,255,0.5)">strict schema</text>
        </g>

        <!-- Validator Registry -->
        <g class="node-group" data-tip="17 validator types: not_null, unique, regex, range, z_score, KS test, PSI drift detection, mean/std checks, allowed_values, and more.">
          <rect x="420" y="310" width="180" height="44" rx="6" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="510" y="330" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#b06aff">Validator Registry</text>
          <text x="510" y="345" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(176,106,255,0.5)">17 check types</text>
        </g>

        <!-- Validator branches -->
        <g class="node-group" data-tip="Schema checks: not_null, unique, regex, allowed_values, min/max_length">
          <rect x="360" y="400" width="80" height="36" rx="5" fill="rgba(176,106,255,0.06)" stroke="#b06aff" stroke-width="1" stroke-opacity=".3"/>
          <text x="400" y="415" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.7)">Schema</text>
          <text x="400" y="427" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">checks</text>
        </g>
        <g class="node-group" data-tip="Statistical checks: z_score, mean_check, std_check, range, null_percentage">
          <rect x="455" y="400" width="80" height="36" rx="5" fill="rgba(176,106,255,0.06)" stroke="#b06aff" stroke-width="1" stroke-opacity=".3"/>
          <text x="495" y="415" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.7)">Statistical</text>
          <text x="495" y="427" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">checks</text>
        </g>
        <g class="node-group" data-tip="Drift detection: KS test (Kolmogorov–Smirnov) and PSI (Population Stability Index) against a reference baseline.">
          <rect x="550" y="400" width="80" height="36" rx="5" fill="rgba(176,106,255,0.06)" stroke="#b06aff" stroke-width="1" stroke-opacity=".3"/>
          <text x="590" y="415" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.7)">Drift</text>
          <text x="590" y="427" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">KS + PSI</text>
        </g>

        <!-- AI Layer (optional) -->
        <g class="node-group" data-tip="OPTIONAL: GPT-4 layer. generate-rules auto-generates YAML rules from raw CSV. On failure, explains checks in plain English. Only column stats sent — no raw data leaves machine.">
          <rect x="265" y="310" width="150" height="44" rx="6" fill="url(#grad-ai)" stroke="#ffd700" stroke-width="1" stroke-opacity=".5" stroke-dasharray="4,3"/>
          <text x="340" y="328" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#ffd700">GPT-4 (optional)</text>
          <text x="340" y="343" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(255,215,0,0.5)">rule gen + explain</text>
        </g>

        <!-- Output -->
        <g class="node-group" data-tip="Output modes: CLI text report (human-readable) or JSON (--output json for CI pipelines). --fail-fast exits with code 1 on any violation.">
          <rect x="650" y="210" width="140" height="60" rx="8" fill="url(#grad-out)" stroke="#00ff9d" stroke-width="1.5" filter="url(#glow-green)"/>
          <text x="720" y="232" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#00ff9d">Report Output</text>
          <text x="720" y="248" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,255,157,0.6)">CLI text / JSON</text>
          <text x="720" y="262" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,255,157,0.5)">--fail-fast CI mode</text>
        </g>

        <!-- Arrow from Python to Output -->
        <path d="M 480 235 Q 580 235 650 240" stroke="#00ff9d" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arrow-green)"/>

        <!-- Animated packets -->
        <!-- CLI → Bridge -->
        <circle r="4" fill="#00d4ff" filter="url(#glow-cyan)" opacity=".9">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
            <mpath href="#path-cli-bridge"/>
          </animateMotion>
        </circle>
        <path id="path-cli-bridge" d="M 340 80 L 340 130" fill="none" stroke="none"/>

        <!-- Bridge → Engine -->
        <circle r="4" fill="#b06aff" filter="url(#glow-purple)" opacity=".9">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0.3s">
            <mpath href="#path-bridge-engine"/>
          </animateMotion>
        </circle>
        <path id="path-bridge-engine" d="M 340 160 L 340 210" fill="none" stroke="none"/>

        <!-- Engine → Validators -->
        <circle r="3.5" fill="#b06aff" filter="url(#glow-purple)" opacity=".8">
          <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.6s">
            <mpath href="#path-engine-val"/>
          </animateMotion>
        </circle>
        <path id="path-engine-val" d="M 410 260 L 510 310" fill="none" stroke="none"/>

        <!-- Engine → Output -->
        <circle r="4" fill="#00ff9d" filter="url(#glow-green)" opacity=".9">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
            <mpath href="#path-engine-out"/>
          </animateMotion>
        </circle>
        <path id="path-engine-out" d="M 480 235 Q 580 235 650 240" fill="none" stroke="none"/>

        <!-- User → CLI packet -->
        <circle r="4" fill="#00d4ff" filter="url(#glow-cyan)" opacity=".9">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.2s">
            <mpath href="#path-user-cli"/>
          </animateMotion>
        </circle>
        <path id="path-user-cli" d="M 80 50 L 220 50" fill="none" stroke="none"/>

        <!-- Labels -->
        <text x="150" y="38" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,212,255,0.5)">sagescan validate</text>
        <text x="350" y="125" font-family="JetBrains Mono" font-size="8" fill="rgba(255,255,255,0.25)">JSON bridge</text>
        <text x="350" y="295" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.4)">optional ↓</text>
      </svg>` }} />
            )}
            {activeGraph === 'oie' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: `<svg id="svg-oie" class="arch-svg" viewBox="0 0 960 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-p2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-c2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <marker id="arr-c" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" opacity=".8"/>
          </marker>
          <marker id="arr-p" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#b06aff" opacity=".8"/>
          </marker>
          <marker id="arr-g" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00ff9d" opacity=".8"/>
          </marker>
          <marker id="arr-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ffd700" opacity=".8"/>
          </marker>
          <marker id="arr-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ff6b6b" opacity=".8"/>
          </marker>
          <linearGradient id="g-gw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00d4ff" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#00d4ff" stop-opacity=".05"/>
          </linearGradient>
          <linearGradient id="g-crew" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b06aff" stop-opacity=".22"/>
            <stop offset="100%" stop-color="#b06aff" stop-opacity=".07"/>
          </linearGradient>
          <linearGradient id="g-llm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffd700" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#ffd700" stop-opacity=".05"/>
          </linearGradient>
        </defs>

        <pattern id="grid-o" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        </pattern>
        <rect width="960" height="500" fill="url(#grid-o)"/>

        <!-- ── EDGES ── -->
        <!-- Client → LB -->
        <line x1="60" y1="200" x2="110" y2="200" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arr-c)"/>
        <!-- LB → Gateway -->
        <line x1="190" y1="200" x2="250" y2="200" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arr-c)"/>
        <!-- Gateway → Request Controller -->
        <line x1="330" y1="185" x2="420" y2="185" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arr-c)"/>
        <!-- RC → CrewAI -->
        <line x1="500" y1="185" x2="550" y2="200" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".6" marker-end="url(#arr-p)"/>
        <!-- Gateway → JSON response back to Client -->
        <path d="M 290 215 Q 290 270 60 270 L 60 215" stroke="#00d4ff" stroke-width="1" stroke-opacity=".3" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-c)"/>
        <!-- Gateway → Prometheus (metrics) -->
        <path d="M 290 220 Q 290 380 340 380" stroke="#00ff9d" stroke-width="1" stroke-opacity=".4" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-g)"/>
        <!-- Gateway → Store Incident -->
        <path d="M 290 220 Q 290 460 500 460 L 880 460 L 880 415" stroke="#ff6b6b" stroke-width="1" stroke-opacity=".3" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-r)"/>
        <!-- Prometheus → Grafana -->
        <line x1="430" y1="380" x2="490" y2="380" stroke="#00ff9d" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#arr-g)"/>
        <!-- CrewAI → Agents -->
        <path d="M 640 170 L 730 100" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arr-p)"/>
        <path d="M 640 185 L 730 155" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arr-p)"/>
        <path d="M 640 200 L 730 210" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arr-p)"/>
        <path d="M 640 215 L 730 265" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#arr-p)"/>
        <!-- All agents → LLM Provider -->
        <path d="M 840 95 L 890 140" stroke="#ffd700" stroke-width="1" stroke-opacity=".5" fill="none" marker-end="url(#arr-a)"/>
        <path d="M 840 150 L 890 155" stroke="#ffd700" stroke-width="1" stroke-opacity=".5" fill="none" marker-end="url(#arr-a)"/>
        <path d="M 840 210 L 890 170" stroke="#ffd700" stroke-width="1" stroke-opacity=".5" fill="none" marker-end="url(#arr-a)"/>
        <!-- Root Cause → pgvector (context retrieval) -->
        <path d="M 840 265 L 870 300" stroke="#b06aff" stroke-width="1" stroke-opacity=".5" fill="none" marker-end="url(#arr-p)"/>
        <!-- CrewAI → Redis (short-term memory) -->
        <path d="M 640 230 L 700 320" stroke="#ffd700" stroke-width="1" stroke-opacity=".4" fill="none" stroke-dasharray="4,3" marker-end="url(#arr-a)"/>
        <!-- CrewAI → Eval -->
        <path d="M 640 240 L 700 380" stroke="#b06aff" stroke-width="1" stroke-opacity=".4" fill="none" marker-end="url(#arr-p)"/>
        <!-- Eval → Postgres -->
        <line x1="790" y1="385" x2="840" y2="385" stroke="#b06aff" stroke-width="1" stroke-opacity=".4" marker-end="url(#arr-p)"/>
        <!-- Postgres → pgvector -->
        <line x1="870" y1="370" x2="890" y2="340" stroke="#b06aff" stroke-width="1" stroke-opacity=".3" fill="none"/>

        <!-- ── NODES ── -->

        <!-- Client -->
        <g class="node-group" data-tip="Client or User sends HTTP request to the system.">
          <rect x="10" y="178" width="50" height="44" rx="6" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".4"/>
          <text x="35" y="197" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Client</text>
          <text x="35" y="210" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">/ User</text>
        </g>

        <!-- Load Balancer -->
        <g class="node-group" data-tip="Load Balancer distributes incoming HTTP requests across FastAPI instances.">
          <rect x="110" y="178" width="80" height="44" rx="6" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".4"/>
          <text x="150" y="197" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Load</text>
          <text x="150" y="210" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Balancer</text>
        </g>

        <!-- FastAPI Gateway -->
        <g class="node-group" data-tip="FastAPI Gateway — auth + validation entry point. Routes to Request Controller for analysis, exposes metrics to Prometheus, stores incidents to Postgres.">
          <rect x="250" y="168" width="80" height="64" rx="8" fill="url(#g-gw)" stroke="#00d4ff" stroke-width="1.5" filter="url(#glow-c2)"/>
          <text x="290" y="192" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#00d4ff">FastAPI</text>
          <text x="290" y="206" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,212,255,0.6)">Gateway</text>
          <text x="290" y="220" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">auth + validate</text>
        </g>

        <!-- Request Controller -->
        <g class="node-group" data-tip="Request Controller — validates request, triggers CrewAI analysis pipeline, returns structured JSON response.">
          <rect x="420" y="165" width="80" height="44" rx="6" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".4"/>
          <text x="460" y="184" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Request</text>
          <text x="460" y="197" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">Controller</text>
        </g>

        <!-- CrewAI Orchestrator -->
        <g class="node-group" data-tip="CrewAI Orchestrator (OpsCrew Manager) — routes tasks to specialized agents: Incident Report, Fix Suggestion, Log Analysis, Root Cause (RAG-enabled). Maintains short-term memory via Redis.">
          <rect x="548" y="168" width="92" height="88" rx="8" fill="url(#g-crew)" stroke="#b06aff" stroke-width="1.5" filter="url(#glow-p2)"/>
          <text x="594" y="194" text-anchor="middle" font-family="JetBrains Mono" font-size="9" font-weight="600" fill="#b06aff">CrewAI</text>
          <text x="594" y="207" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">Orchestrator</text>
          <text x="594" y="220" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">OpsCrew</text>
          <text x="594" y="232" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">Manager</text>
          <text x="594" y="248" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.4)">→ agents</text>
        </g>

        <!-- Agents -->
        <g class="node-group" data-tip="Incident Report Agent — generates structured incident report from log analysis.">
          <rect x="730" y="78" width="110" height="36" rx="5" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="785" y="99" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">Incident Report</text>
          <text x="785" y="109" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">Agent</text>
        </g>
        <g class="node-group" data-tip="Fix Suggestion Agent — suggests remediation steps based on detected anomaly type and historical context.">
          <rect x="730" y="133" width="110" height="36" rx="5" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="785" y="153" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">Fix Suggestion</text>
          <text x="785" y="163" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">Agent</text>
        </g>
        <g class="node-group" data-tip="Log Analysis Agent — parses raw log streams, extracts signals, classifies anomaly severity.">
          <rect x="730" y="188" width="110" height="36" rx="5" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="785" y="208" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">Log Analysis</text>
          <text x="785" y="218" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">Agent</text>
        </g>
        <g class="node-group" data-tip="Root Cause Agent — RAG-enabled. Queries pgvector for similar historical incidents to generate root cause hypothesis with context retrieval.">
          <rect x="730" y="243" width="110" height="44" rx="5" fill="rgba(176,106,255,0.1)" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".7"/>
          <text x="785" y="261" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">Root Cause Agent</text>
          <text x="785" y="273" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.6)">(RAG Enabled)</text>
          <text x="785" y="283" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(176,106,255,0.4)">context retrieval →</text>
        </g>

        <!-- LLM Provider -->
        <g class="node-group" data-tip="LLM Provider (OpenAI / Local LLM). All agents route through here for generation. Local LLM option ensures data residency compliance.">
          <rect x="860" y="120" width="80" height="64" rx="8" fill="url(#g-llm)" stroke="#ffd700" stroke-width="1.5"/>
          <text x="900" y="145" text-anchor="middle" font-family="JetBrains Mono" font-size="9" font-weight="600" fill="#ffd700">LLM</text>
          <text x="900" y="158" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.6)">OpenAI /</text>
          <text x="900" y="170" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.6)">Local LLM</text>
        </g>

        <!-- Redis -->
        <g class="node-group" data-tip="Redis — short-term memory for agent tasks and result caching. Prevents redundant LLM calls for similar recent incidents.">
          <rect x="700" y="305" width="100" height="44" rx="6" fill="rgba(255,215,0,0.08)" stroke="#ffd700" stroke-width="1" stroke-opacity=".5"/>
          <text x="750" y="324" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#ffd700">Redis</text>
          <text x="750" y="337" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.5)">Cache / Task Queue</text>
        </g>

        <!-- Eval & Confidence -->
        <g class="node-group" data-tip="Evaluation & Confidence Scoring — scores agent outputs before escalation. Only escalates if confidence > threshold to prevent alert fatigue.">
          <rect x="700" y="365" width="90" height="50" rx="6" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".5"/>
          <text x="745" y="384" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#b06aff">Evaluation &amp;</text>
          <text x="745" y="396" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#b06aff">Confidence</text>
          <text x="745" y="408" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">Scoring</text>
        </g>

        <!-- Postgres -->
        <g class="node-group" data-tip="PostgreSQL — stores incidents, agent outputs, evaluation scores, and historical context for RAG retrieval.">
          <rect x="840" y="360" width="80" height="50" rx="6" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".4"/>
          <text x="880" y="382" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00d4ff">PostgreSQL</text>
        </g>

        <!-- pgvector -->
        <g class="node-group" data-tip="pgvector extension — stores embeddings of historical incidents for semantic similarity search by the Root Cause Agent (RAG).">
          <rect x="860" y="305" width="70" height="40" rx="5" fill="rgba(176,106,255,0.08)" stroke="#b06aff" stroke-width="1" stroke-opacity=".4"/>
          <text x="895" y="322" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#b06aff">pgvector</text>
          <text x="895" y="335" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.5)">embeddings</text>
        </g>

        <!-- Prometheus -->
        <g class="node-group" data-tip="Prometheus — scrapes metrics from FastAPI gateway. Exposes request rates, latency, error rates to Grafana.">
          <rect x="340" y="360" width="90" height="40" rx="6" fill="rgba(0,255,157,0.06)" stroke="#00ff9d" stroke-width="1" stroke-opacity=".4"/>
          <text x="385" y="378" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00ff9d">Prometheus</text>
          <text x="385" y="390" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.5)">metrics</text>
        </g>

        <!-- Grafana -->
        <g class="node-group" data-tip="Grafana Dashboard — visualises system health metrics: request rates, anomaly detection latency, agent performance.">
          <rect x="490" y="360" width="90" height="40" rx="6" fill="rgba(0,255,157,0.06)" stroke="#00ff9d" stroke-width="1" stroke-opacity=".4"/>
          <text x="535" y="378" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#00ff9d">Grafana</text>
          <text x="535" y="390" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.5)">Dashboard</text>
        </g>

        <!-- ── Animated packets ── -->
        <!-- Client → LB -->
        <circle r="4" fill="#00d4ff" filter="url(#glow-c2)" opacity=".9">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0s">
            <mpath href="#oie-p1"/>
          </animateMotion>
        </circle>
        <path id="oie-p1" d="M 60 200 L 110 200" fill="none" stroke="none"/>

        <!-- LB → Gateway -->
        <circle r="4" fill="#00d4ff" filter="url(#glow-c2)" opacity=".9">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.3s">
            <mpath href="#oie-p2"/>
          </animateMotion>
        </circle>
        <path id="oie-p2" d="M 190 200 L 250 200" fill="none" stroke="none"/>

        <!-- Gateway → RC -->
        <circle r="3.5" fill="#00d4ff" opacity=".8">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#oie-p3"/>
          </animateMotion>
        </circle>
        <path id="oie-p3" d="M 330 185 L 420 185" fill="none" stroke="none"/>

        <!-- RC → CrewAI -->
        <circle r="4" fill="#b06aff" filter="url(#glow-p2)" opacity=".9">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.7s">
            <mpath href="#oie-p4"/>
          </animateMotion>
        </circle>
        <path id="oie-p4" d="M 500 185 L 550 200" fill="none" stroke="none"/>

        <!-- CrewAI → Incident Agent -->
        <circle r="3" fill="#b06aff" opacity=".8">
          <animateMotion dur="2.5s" repeatCount="indefinite" begin="0s">
            <mpath href="#oie-p5"/>
          </animateMotion>
        </circle>
        <path id="oie-p5" d="M 640 170 L 730 100" fill="none" stroke="none"/>

        <!-- CrewAI → Root Cause -->
        <circle r="3" fill="#b06aff" opacity=".8">
          <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s">
            <mpath href="#oie-p6"/>
          </animateMotion>
        </circle>
        <path id="oie-p6" d="M 640 215 L 730 265" fill="none" stroke="none"/>

        <!-- Root Cause → pgvector -->
        <circle r="3" fill="#b06aff" opacity=".7">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1.2s">
            <mpath href="#oie-p7"/>
          </animateMotion>
        </circle>
        <path id="oie-p7" d="M 840 265 L 890 330" fill="none" stroke="none"/>

        <!-- Agents → LLM -->
        <circle r="3.5" fill="#ffd700" opacity=".8">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#oie-p8"/>
          </animateMotion>
        </circle>
        <path id="oie-p8" d="M 840 150 L 890 155" fill="none" stroke="none"/>

        <!-- Edge labels -->
        <text x="85" y="196" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">HTTP Request</text>
        <text x="375" y="178" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">Auth+Validate</text>
        <text x="525" y="178" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">Trigger Analysis</text>
        <text x="670" y="300" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.4)">Short-Term Memory</text>
        <text x="240" y="265" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.3)" transform="rotate(-15,240,265)">Structured JSON</text>
      </svg>` }} />
            )}
            {activeGraph === 'querymind' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: `<svg id="svg-qm" class="arch-svg" viewBox="0 0 960 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-qc" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-qg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <marker id="qm-ac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" opacity=".8"/>
          </marker>
          <marker id="qm-ap" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#b06aff" opacity=".8"/>
          </marker>
          <marker id="qm-ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00ff9d" opacity=".8"/>
          </marker>
          <marker id="qm-aa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ffd700" opacity=".8"/>
          </marker>
          <linearGradient id="qm-gkafka" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00d4ff" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#00d4ff" stop-opacity=".05"/>
          </linearGradient>
          <linearGradient id="qm-gminio" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b06aff" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#b06aff" stop-opacity=".05"/>
          </linearGradient>
          <linearGradient id="qm-gdbt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00ff9d" stop-opacity=".18"/>
            <stop offset="100%" stop-color="#00ff9d" stop-opacity=".05"/>
          </linearGradient>
          <linearGradient id="qm-gdw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00ff9d" stop-opacity=".22"/>
            <stop offset="100%" stop-color="#00ff9d" stop-opacity=".07"/>
          </linearGradient>
        </defs>

        <pattern id="grid-q" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        </pattern>
        <rect width="960" height="420" fill="url(#grid-q)"/>

        <!-- ── EDGES ── -->
        <!-- Sources → Kafka -->
        <line x1="100" y1="120" x2="180" y2="150" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-ac)"/>
        <line x1="100" y1="200" x2="180" y2="175" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-ac)"/>
        <!-- Kafka → MinIO -->
        <line x1="280" y1="163" x2="360" y2="163" stroke="#00d4ff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-ac)"/>
        <!-- MinIO → dbt -->
        <line x1="480" y1="163" x2="540" y2="163" stroke="#b06aff" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-ap)"/>
        <!-- dbt → DW -->
        <line x1="660" y1="163" x2="720" y2="163" stroke="#00ff9d" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-ag)"/>
        <!-- DW → Dashboards -->
        <line x1="840" y1="150" x2="900" y2="130" stroke="#ffd700" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#qm-aa)"/>
        <!-- DW → LLM Agent -->
        <path d="M 780 210 L 780 290" stroke="#00ff9d" stroke-width="1.5" stroke-opacity=".5" fill="none" marker-end="url(#qm-ag)"/>
        <!-- LLM → DW (results back) -->
        <path d="M 750 290 Q 720 260 730 215" stroke="#ffd700" stroke-width="1" stroke-opacity=".4" fill="none" stroke-dasharray="4,3" marker-end="url(#qm-aa)"/>

        <!-- Airflow orchestrates everything -->
        <path d="M 420 60 Q 420 90 280 120 Q 480 90 660 120 Q 780 90 840 120" stroke="#ffd700" stroke-width="1" stroke-opacity=".3" fill="none" stroke-dasharray="3,4"/>
        <!-- dbt internal flow -->
        <path d="M 560 195 L 560 230 L 640 230 L 640 195" stroke="#b06aff" stroke-width="1" stroke-opacity=".3" fill="none"/>

        <!-- ── NODES ── -->

        <!-- Airflow box at top -->
        <g class="node-group" data-tip="Apache Airflow orchestrates the entire pipeline: Ingest Task → Transform Task (dbt) → Load Warehouse → Data Quality Check → Refresh Dashboards. DAG-driven scheduling.">
          <rect x="340" y="20" width="160" height="36" rx="6" fill="rgba(255,215,0,0.08)" stroke="#ffd700" stroke-width="1" stroke-opacity=".5" stroke-dasharray="4,3"/>
          <text x="420" y="35" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#ffd700">Airflow Orchestration</text>
          <text x="420" y="48" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.5)">DAG scheduling across all stages</text>
        </g>

        <!-- Data Sources -->
        <g class="node-group" data-tip="Data Sources: CSV files (batch) and API / Synthetic Events (streaming). Both paths feed into Kafka.">
          <rect x="10" y="90" width="90" height="130" rx="6" fill="rgba(0,212,255,0.06)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".3"/>
          <text x="55" y="112" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,212,255,0.6)">Data Sources</text>
          <rect x="20" y="120" width="70" height="26" rx="4" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".3"/>
          <text x="55" y="137" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#00d4ff">CSV Files</text>
          <text x="55" y="158" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.5)">── Batch</text>
          <rect x="20" y="168" width="70" height="34" rx="4" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" stroke-width="1" stroke-opacity=".3"/>
          <text x="55" y="183" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#00d4ff">API /</text>
          <text x="55" y="194" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#00d4ff">Synthetic</text>
          <text x="55" y="209" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.5)">── Stream</text>
        </g>

        <!-- Kafka -->
        <g class="node-group" data-tip="Kafka Order Events — streaming layer. Receives both batch (CSV) and streaming (API) inputs. Decouples ingestion from processing.">
          <rect x="180" y="128" width="100" height="70" rx="8" fill="url(#qm-gkafka)" stroke="#00d4ff" stroke-width="1.5" filter="url(#glow-qc)"/>
          <text x="230" y="153" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#00d4ff">Kafka</text>
          <text x="230" y="167" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="rgba(0,212,255,0.6)">Order Events</text>
          <text x="230" y="181" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">Streaming Layer</text>
        </g>

        <!-- MinIO -->
        <g class="node-group" data-tip="MinIO Data Lake — three zones: Raw Zone (unprocessed), Clean Zone (validated), Curated Zone / Warehouse (ready for analytics). Data progresses through zones via pipeline.">
          <rect x="360" y="110" width="120" height="106" rx="8" fill="url(#qm-gminio)" stroke="#b06aff" stroke-width="1.5" filter="url(#glow-qc)"/>
          <text x="420" y="132" text-anchor="middle" font-family="JetBrains Mono" font-size="9" font-weight="600" fill="#b06aff">MinIO</text>
          <text x="420" y="145" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.7)">Data Lake</text>
          <line x1="370" y1="155" x2="470" y2="155" stroke="rgba(176,106,255,0.2)" stroke-width="1"/>
          <text x="420" y="168" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.6)">Raw Zone</text>
          <text x="420" y="181" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.6)">Clean Zone</text>
          <text x="420" y="194" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(176,106,255,0.6)">Curated Zone</text>
          <text x="420" y="207" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(176,106,255,0.4)">warehouse</text>
        </g>

        <!-- dbt Transform -->
        <g class="node-group" data-tip="dbt + DuckDB/Postgres Transform Layer. Runs: Staging Models → Dimension Tables (SCD Type 2) → Fact Tables → Marts (sales_mart, customer_mart). Version-controlled SQL transformations.">
          <rect x="540" y="110" width="120" height="130" rx="8" fill="url(#qm-gdbt)" stroke="#00ff9d" stroke-width="1.5" filter="url(#glow-qg)"/>
          <text x="600" y="132" text-anchor="middle" font-family="JetBrains Mono" font-size="9" font-weight="600" fill="#00ff9d">Transform</text>
          <text x="600" y="145" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.6)">dbt + DuckDB</text>
          <line x1="550" y1="155" x2="650" y2="155" stroke="rgba(0,255,157,0.2)" stroke-width="1"/>
          <text x="600" y="168" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.7)">Staging Models</text>
          <text x="600" y="181" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.7)">Dimension (SCD2)</text>
          <text x="600" y="194" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.7)">Fact Tables</text>
          <text x="600" y="207" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.7)">Marts</text>
          <text x="600" y="220" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(0,255,157,0.4)">sales_mart, customer_mart</text>
          <text x="600" y="233" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(0,255,157,0.4)">analytical_tables</text>
        </g>

        <!-- Data Warehouse -->
        <g class="node-group" data-tip="Data Warehouse — DuckDB/Postgres. Stores analytical tables, dimension tables, fact tables. Serves both Streamlit dashboards and the LLM SQL Agent.">
          <rect x="720" y="110" width="120" height="100" rx="8" fill="url(#qm-gdw)" stroke="#00ff9d" stroke-width="2" filter="url(#glow-qg)"/>
          <text x="780" y="135" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#00ff9d">Data</text>
          <text x="780" y="149" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#00ff9d">Warehouse</text>
          <text x="780" y="163" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.6)">DuckDB/Postgres</text>
          <line x1="730" y1="173" x2="830" y2="173" stroke="rgba(0,255,157,0.2)" stroke-width="1"/>
          <text x="780" y="186" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,255,157,0.6)">Analytical Tables</text>
        </g>

        <!-- Streamlit Dashboards -->
        <g class="node-group" data-tip="Streamlit Dashboards — KPIs, trends, cohort analysis. Business users access insights without SQL knowledge. Auto-refreshed by Airflow DAG.">
          <rect x="880" y="90" width="70" height="70" rx="6" fill="rgba(255,215,0,0.08)" stroke="#ffd700" stroke-width="1" stroke-opacity=".5"/>
          <text x="915" y="114" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#ffd700">Streamlit</text>
          <text x="915" y="126" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="#ffd700">Dashboard</text>
          <text x="915" y="140" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(255,215,0,0.5)">KPIs/Trends</text>
          <text x="915" y="152" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(255,215,0,0.5)">Cohorts</text>
        </g>

        <!-- LLM SQL Agent -->
        <g class="node-group" data-tip="RAG Schema Retriever → GPT-4 SQL Generator → SQL Safety Validator → Redis Cache">
          <rect x="700" y="290" width="160" height="80" rx="8" fill="rgba(255,215,0,0.1)" stroke="#ffd700" stroke-width="1.5"/>
          <text x="780" y="315" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="600" fill="#ffd700">RAG SQL Agent</text>
          <text x="780" y="330" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.6)">GPT-4 + SQL Validator</text>
          <line x1="710" y1="340" x2="850" y2="340" stroke="rgba(255,215,0,0.15)" stroke-width="1"/>
          <text x="780" y="355" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(255,215,0,0.5)">Redis Cache Layer</text>
          <text x="780" y="366" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="rgba(255,215,0,0.4)">1ms hit on repeats</text>
        </g>

        <!-- ── Animated packets ── -->
        <circle r="4" fill="#00d4ff" filter="url(#glow-qc)" opacity=".9">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
            <mpath href="#qm-p1"/>
          </animateMotion>
        </circle>
        <path id="qm-p1" d="M 100 120 L 180 150" fill="none" stroke="none"/>

        <circle r="4" fill="#00d4ff" filter="url(#glow-qc)" opacity=".9">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.4s">
            <mpath href="#qm-p2"/>
          </animateMotion>
        </circle>
        <path id="qm-p2" d="M 280 163 L 360 163" fill="none" stroke="none"/>

        <circle r="4" fill="#b06aff" filter="url(#glow-qc)" opacity=".9">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.6s">
            <mpath href="#qm-p3"/>
          </animateMotion>
        </circle>
        <path id="qm-p3" d="M 480 163 L 540 163" fill="none" stroke="none"/>

        <circle r="4" fill="#00ff9d" filter="url(#glow-qg)" opacity=".9">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s">
            <mpath href="#qm-p4"/>
          </animateMotion>
        </circle>
        <path id="qm-p4" d="M 660 163 L 720 163" fill="none" stroke="none"/>

        <circle r="4" fill="#ffd700" opacity=".85">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="1s">
            <mpath href="#qm-p5"/>
          </animateMotion>
        </circle>
        <path id="qm-p5" d="M 840 150 L 900 130" fill="none" stroke="none"/>

        <circle r="3.5" fill="#00ff9d" opacity=".8">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1.2s">
            <mpath href="#qm-p6"/>
          </animateMotion>
        </circle>
        <path id="qm-p6" d="M 780 210 L 780 290" fill="none" stroke="none"/>

        <!-- Airflow orbit packet -->
        <circle r="3" fill="#ffd700" opacity=".5">
          <animateMotion dur="4s" repeatCount="indefinite" begin="0s">
            <mpath href="#qm-airflow"/>
          </animateMotion>
        </circle>
        <path id="qm-airflow" d="M 420 60 Q 420 90 280 120 Q 480 90 660 120 Q 780 90 840 120" fill="none" stroke="none"/>

        <!-- Labels -->
        <text x="140" y="132" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)" transform="rotate(20,140,132)">Batch</text>
        <text x="140" y="185" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)" transform="rotate(-17,140,185)">Stream</text>
        <text x="320" y="155" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">Streaming</text>
        <text x="320" y="165" text-anchor="middle" font-family="JetBrains Mono" font-size="8" fill="rgba(0,212,255,0.4)">Layer</text>
      </svg>` }} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};

type DesignDecision = {
  q: string;
  a: string;
};

type DesignCardModel = {
  id: string;
  title: string;
  subtitle: string;
  githubUrl: string;
  metrics: string[];
  decisions: DesignDecision[];
  tradeoffs: string;
  whatIdDoDiff: string;
};

// --- DESIGN VIEW ---
export const DesignView: React.FC = () => {
  const cards: CombinedDesignCard[] = Object.values(DESIGN_DECISION_CARDS);

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>SYSTEM_DESIGN_DECISIONS</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards.map(card => (
          <DesignCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

const DesignCard = ({ card }: { card: DesignCardModel }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '16px' }}>{card.title}</div>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginTop: '4px', maxWidth: '600px' }}>{card.subtitle}</div>
          </div>
          <div style={{ color: 'var(--dim)' }}>{expanded ? '▼' : '▶'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {card.metrics.map((m: string) => (
            <span key={m} style={{ background: 'rgba(0, 212, 255, 0.15)', color: 'var(--cyan)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 10px rgba(0,212,255,0.1)' }}>
              {m}
            </span>
          ))}
          {card.githubUrl && (
            <a href={'https://' + card.githubUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
              {card.githubUrl}
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* KEY DECISIONS */}
              <div>
                <div style={{ color: 'var(--dim)', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>KEY DECISIONS I MADE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {card.decisions.map((d: DesignDecision, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
                      <div style={{ color: 'var(--cyan)', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>▸ {d.q}</div>
                      <div style={{ color: 'var(--text)', fontSize: '13px', lineHeight: '1.5', paddingLeft: '14px', borderLeft: '2px solid var(--border)' }}>{d.a}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* WHAT I'D DO DIFF & TRADEOFFS */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', background: 'rgba(176,106,255,0.05)', borderLeft: '2px solid var(--purple)', padding: '12px' }}>
                  <div style={{ color: 'var(--purple)', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>WHAT I WOULD DO DIFFERENTLY</div>
                  <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: '1.4' }}>{card.whatIdDoDiff}</div>
                </div>
                <div style={{ flex: '1 1 300px', background: 'rgba(255,189,46,0.05)', borderLeft: '2px solid var(--amber)', padding: '12px' }}>
                  <div style={{ color: 'var(--amber)', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>TRADE-OFFS</div>
                  <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{card.tradeoffs}</div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- RADAR VIEW (Skills Dashboard) ---
export const RadarView: React.FC = () => {
  const skills = {
    "Data Engineering": [
      { name: "Apache Kafka", level: 95, label: "Expert", evidence: "OI-Engine: High-throughput log ingestion" },
      { name: "Apache Airflow", level: 85, label: "Production", evidence: "QueryMind-DW: Orchestrates dbt & ingest" },
      { name: "dbt (Postgres)", level: 80, label: "Proficient", evidence: "QueryMind-DW: SCD Type 2 transforms" },
      { name: "PySpark", level: 80, label: "Proficient", evidence: "OI-Engine: Statistical log filtering" }
    ],
    "AI / LLM Systems": [
      { name: "RAG Pipelines", level: 95, label: "Expert", evidence: "QueryMind-DW: Schema retriever + Redis cache" },
      { name: "LangChain", level: 85, label: "Production", evidence: "Orchestration in QueryMind & OI-Engine" },
      { name: "LlamaIndex", level: 80, label: "Proficient", evidence: "OSS contributor to core framework" },
      { name: "Prompt Eng.", level: 95, label: "Expert", evidence: "SageScan: Rule gen; OI-Engine: RCA summary" },
      { name: "Vector DBs", level: 80, label: "Proficient", evidence: "Pinecone: Schema embedding storage" },
      { name: "Mistral 7B", level: 80, label: "Proficient", evidence: "OI-Engine: Local incident triage" }
    ],
    "Backend & Systems": [
      { name: "Python/FastAPI", level: 85, label: "Production", evidence: "SageScan Engine + QueryMind APIs" },
      { name: "Go", level: 80, label: "Proficient", evidence: "SageScan CLI author (published to PyPI)" },
      { name: "Node.js", level: 95, label: "Expert", evidence: "Core system architecture at HPE" },
      { name: "PostgreSQL", level: 95, label: "Expert", evidence: "QueryMind-DW: Optimized OLAP schema" },
      { name: "Redis", level: 80, label: "Proficient", evidence: "QueryMind-DW: 1ms cache hit latency" },
      { name: "Docker", level: 80, label: "Proficient", evidence: "Multi-container stack orchestration" },
      { name: "AWS", level: 80, label: "Proficient", evidence: "S3, Lambda, EC2 (HPE Production)" }
    ]
  };

  const tags = [
    { text: "Python", size: 1.8 }, { text: "Node.js", size: 1.8 }, { text: "RAG", size: 1.8 }, { text: "Kafka", size: 1.8 }, { text: "LangChain", size: 1.8 },
    { text: "Go", size: 1.5 }, { text: "Airflow", size: 1.5 }, { text: "dbt", size: 1.5 }, { text: "PySpark", size: 1.5 }, { text: "GPT-4", size: 1.5 }, { text: "Postgres", size: 1.5 }, { text: "Redis", size: 1.5 },
    { text: "Docker", size: 1.2 }, { text: "AWS", size: 1.2 }, { text: "Mistral", size: 1.2 }, { text: "LlamaIndex", size: 1.2 }, { text: "Pinecone", size: 1.2 }, { text: "Pydantic", size: 1.2 }, { text: "FastAPI", size: 1.2 }
  ];

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>SKILLS_EVIDENCE_DASHBOARD</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN - SKILL BARS */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((skill, i) => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--cyan)' }}>{skill.name}</span>
                      <span style={{ color: 'var(--dim)' }}>{skill.label}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${skill.level}%` }} 
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--purple))' }}
                      />
                    </div>
                    <div style={{ color: 'var(--dim)', fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>"{skill.evidence}"</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* TAG CLOUD */}
          <div>
            <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Tech Tag Cloud</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,212,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
              {tags.map((tag, i) => (
                <motion.span 
                  key={tag.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    color: `rgba(0, 212, 255, ${0.5 + tag.size * 0.2})`, 
                    fontSize: `${tag.size * 10}px`,
                    filter: `drop-shadow(0 0 ${tag.size * 2}px var(--cyan))`,
                    lineHeight: '1'
                  }}
                >
                  {tag.text}
                </motion.span>
              ))}
            </div>
          </div>

          {/* OSS BADGES */}
          <div>
            <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Open Source Contributions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,255,157,0.2)' }}>
                <div style={{ color: 'var(--green)', filter: 'drop-shadow(0 0 5px var(--green))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>dbt-core contributor</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px' }}>data transformation engine</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(176,106,255,0.2)' }}>
                <div style={{ color: 'var(--purple)', filter: 'drop-shadow(0 0 5px var(--purple))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>LlamaIndex contributor</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px' }}>LLM orchestration framework</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div style={{ color: 'var(--cyan)', filter: 'drop-shadow(0 0 5px var(--cyan))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>SageScan author</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px', fontFamily: 'var(--font)' }}>pip install sagescan-data</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- ACTIVITY VIEW ---
export const ActivityView: React.FC = () => {
  const [contributions, setContributions] = useState<number[][]>([]);
  const [weeklyTotals, setWeeklyTotals] = useState<number[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0, stars: 0, following: 0 });
  const [languages, setLanguages] = useState<Record<string, number>>({});

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers: HeadersInit = token ? { 'Authorization': `token ${token}` } : {};

    // Fetch heatmap (GraphQL with PAT for real data)
    if (token) {
      const query = `
        query {
          user(login: "abhishek09827") {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })
      .then(res => res.json())
      .then(data => {
        const weeksData = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
        if (!weeksData) return;
        
        const weeks: number[][] = [];
        const totals: number[] = [];
        const dates: string[] = [];
        
        weeksData.forEach((week: any) => {
          const days = week.contributionDays.map((d: any) => d.contributionCount);
          weeks.push(days);
          totals.push(days.reduce((a: number, b: number) => a + b, 0));
          dates.push(week.contributionDays[0]?.date || '');
        });
        
        setContributions(weeks);
        setWeeklyTotals(totals);
        setWeekDates(dates);
      })
      .catch(console.error);
    } else {
      // Fallback to public third-party API if token is missing
      fetch('https://github-contributions-api.jogruber.de/v4/abhishek09827')
        .then(res => res.json())
        .then(data => {
          if (!data || !data.contributions) return;
          const recent = data.contributions.slice(-364); 
          const weeks: number[][] = [];
          const totals: number[] = [];
          const dates: string[] = [];
          for (let i = 0; i < recent.length; i += 7) {
            const weekSlice = recent.slice(i, i + 7);
            const week = weekSlice.map((c: { count: number }) => c.count);
            weeks.push(week);
            totals.push(week.reduce((a: number, b: number) => a + b, 0));
            dates.push(weekSlice[0]?.date || '');
          }
          setContributions(weeks);
          setWeeklyTotals(totals);
          setWeekDates(dates);
        })
        .catch(console.error);
    }

    // Fetch user stats
    fetch('https://api.github.com/users/abhishek09827', { headers })
      .then(res => res.json())
      .then(data => {
        setGithubStats(prev => ({ 
          ...prev, 
          repos: data.public_repos, 
          followers: data.followers,
          following: data.following
        }));
      })
      .catch(console.error);

    // Fetch repos for stars and languages
    fetch('https://api.github.com/users/abhishek09827/repos?per_page=100', { headers })
      .then(res => res.json())
      .then((repos: any[]) => {
        let totalStars = 0;
        const langMap: Record<string, number> = {};
        
        repos.forEach(repo => {
          totalStars += repo.stargazers_count;
          if (repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
          }
        });

        setGithubStats(prev => ({ ...prev, stars: totalStars }));
        setLanguages(langMap);
      })
      .catch(console.error);
  }, []);

  const maxTotal = Math.max(...weeklyTotals, 1);

  // Highest weeks to label
  const sortedWeeks = [...weeklyTotals].map((val, idx) => ({ val, idx, date: weekDates[idx] })).sort((a,b) => b.val - a.val);
  const topWeeks = sortedWeeks.slice(0, 4);

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>COMMIT_ACTIVITY</span>
        <span style={{ color: 'var(--dim)', fontSize: '12px' }}>github.com/abhishek09827</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', overflowY: 'auto' }}>

        {/* SECTION 1: HEATMAP & SPARKLINE */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {contributions.length > 0 ? (
            <>
              {/* Sparkline Trend */}
              <div style={{ width: '100%', height: '80px', position: 'relative', marginBottom: '16px' }}>
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 ${weeklyTotals.length * 5} 40`}>
                  <defs>
                    <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <motion.path
                    d={`M 0 40 L 0 ${40 - (weeklyTotals[0] / maxTotal) * 36} ${weeklyTotals.map((t: number, i: number) => `L ${i * 5} ${40 - (t / maxTotal) * 36}`).join(' ')} L ${(weeklyTotals.length - 1) * 5} 40 Z`}
                    fill="url(#sparkFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                  {/* Line */}
                  <motion.path
                    d={`M 0 ${40 - (weeklyTotals[0] / maxTotal) * 36} ${weeklyTotals.map((t: number, i: number) => `L ${i * 5} ${40 - (t / maxTotal) * 36}`).join(' ')}`}
                    fill="none"
                    stroke="var(--cyan)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>

                {/* Annotations */}
                <AnimatePresence>
                  {topWeeks.map((tw, i) => {
                    const projectNames = ["SageScan", "QueryMind-DW", "OI-Engine", "OSS Contributions"];
                    const dateStr = tw.date ? new Date(tw.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown Date';
                    const label = `${projectNames[i]} — ${dateStr} (${tw.val} commits)`;
                    const color = i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)';
                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 1.5 + i * 0.2 }}
                        whileHover="hover"
                        style={{ 
                          position: 'absolute', 
                          top: 40 - (tw.val / maxTotal) * 36, 
                          left: `${(tw.idx / weeklyTotals.length) * 100}%`, 
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          zIndex: 10
                        }}
                      >
                        {/* Interactive Dot */}
                        <motion.div 
                          style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, border: '2px solid var(--bg)', boxShadow: `0 0 8px ${color}` }} 
                          whileHover={{ scale: 1.5 }}
                        />
                        {/* Hover Label */}
                        <motion.div 
                          variants={{ hover: { opacity: 1, y: -5 } }}
                          initial={{ opacity: 0, y: 0 }}
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '10px', 
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            background: 'rgba(0,0,0,0.85)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: `1px solid ${color}`,
                            marginBottom: '6px',
                            pointerEvents: 'none',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {label}
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Heatmap Grid */}
              <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '8px' }}>
                {contributions.map((week: number[], wIdx: number) => (
                  <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {week.map((val: number, dIdx: number) => {
                      let color = '#0d0d0d';
                      if (val > 8) color = '#00ff9d';
                      else if (val > 4) color = '#00a86b';
                      else if (val > 0) color = '#0d3b2e';

                      return (
                        <div
                          key={dIdx}
                          style={{ width: '11px', height: '11px', borderRadius: '2px', background: color, border: '1px solid rgba(255,255,255,0.05)' }}
                          title={`${val} contributions`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--cyan)' }}>Fetching GitHub Data...</div>
          )}
        </div>

        {/* SECTION 2: STATS ROW */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Repositories', val: githubStats.repos, icon: '📁', color: 'var(--cyan)' },
            { label: 'Stars Earned', val: githubStats.stars, icon: '⭐', color: 'var(--amber)' },
            { label: 'Followers', val: githubStats.followers, icon: '👥', color: 'var(--purple)' },
            { label: 'Following', val: githubStats.following, icon: '🔗', color: 'var(--green)' }
          ].map(stat => (
            <motion.div 
              key={stat.label} 
              whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
              style={{ flex: '1 1 150px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'default', transition: 'background 0.2s' }}
            >
              <div style={{ fontSize: '24px' }}>{stat.icon}</div>
              <div style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 'bold' }}>{stat.val}</div>
              <div style={{ color: stat.color, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 3: LANGUAGE BREAKDOWN */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--dim)', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase' }}>Repository Language Breakdown (Real-time)</div>
          
          <div style={{ height: '12px', width: '100%', display: 'flex', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            {Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang, count], i) => {
              const total = Object.values(languages).reduce((a, b) => a + b, 0);
              const pct = (count / total) * 100;
              const colors = ['var(--cyan)', 'var(--purple)', 'var(--green)', 'var(--amber)', 'var(--dim)', 'var(--red)', 'var(--blue)'];
              return (
                <motion.div 
                  key={lang}
                  initial={{ width: 0 }} 
                  animate={{ width: `${pct}%` }} 
                  transition={{ duration: 1, delay: i * 0.1 }} 
                  style={{ background: colors[i % colors.length] }} 
                  title={`${lang}: ${Math.round(pct)}%`} 
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '16px 24px', flexWrap: 'wrap', fontSize: '12px' }}>
            {Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([lang, count], i) => {
              const total = Object.values(languages).reduce((a, b) => a + b, 0);
              const pct = Math.round((count / total) * 100);
              const colors = ['var(--cyan)', 'var(--purple)', 'var(--green)', 'var(--amber)', 'var(--dim)', 'var(--red)', 'var(--blue)'];
              return (
                <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i % colors.length] }} />
                  <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{lang}</span>
                  <span style={{ color: 'var(--dim)' }}>({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
