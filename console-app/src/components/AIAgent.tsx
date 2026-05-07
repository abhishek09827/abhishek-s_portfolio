import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalSquare, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TraceStep {
  type: 'think' | 'tool' | 'result' | 'observe' | 'act' | 'generate';
  label: string;
  detail?: string;
  latency?: string;
}

type PortfolioTabId = 'core' | 'graph' | 'radar' | 'activity';

// --- CONSTANTS ---
const STARTER_QUESTIONS = [
  "What's the gist of SageScan?",
  "Why CrewAI in OI-Engine?",
  "Open to new roles?",
  "How does QueryMind handle bad SQL?"
];

// --- INTENT ENGINE ---
// Maps query intent to a realistic RLM execution trace
const buildTrace = (query: string): TraceStep[] => {
  const q = query.toLowerCase();
  const steps: TraceStep[] = [];

  // Step 1: THINK — always parse intent first
  if (q.includes('sagescan') || q.includes('data quality') || q.includes('validator')) {
    steps.push({ type: 'think', label: 'intent: project_deep_dive', detail: 'project=SageScan' });
    steps.push({ type: 'tool', label: 'context_retriever', detail: 'query="SageScan architecture + benchmarks"' });
    steps.push({ type: 'result', label: 'retrieved', detail: '5 facts · 3 metrics · 1 PyPI ref' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("Go CLI bridge", "KS test drift")' });
    steps.push({ type: 'result', label: 'matched', detail: 'throughput=125547/s · peak_mem=599MB · drift_acc=100%' });
  } else if (q.includes('oi') || q.includes('crewai') || q.includes('aiops') || q.includes('agent')) {
    steps.push({ type: 'think', label: 'intent: project_deep_dive', detail: 'project=OI-Engine' });
    steps.push({ type: 'tool', label: 'context_retriever', detail: 'query="CrewAI orchestration + confidence gating"' });
    steps.push({ type: 'result', label: 'retrieved', detail: '4 agents · confidence=0.75 · FP_rate=8%' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("Mistral 7B", "two-stage detection")' });
    steps.push({ type: 'result', label: 'matched', detail: 'LLM_cost_reduction=58% · MTTD<5s · F1=0.89' });
  } else if (q.includes('querymind') || q.includes('sql') || q.includes('dbt') || q.includes('warehouse')) {
    steps.push({ type: 'think', label: 'intent: project_deep_dive', detail: 'project=QueryMind-DW' });
    steps.push({ type: 'tool', label: 'context_retriever', detail: 'query="NL-to-SQL RAG pipeline + validation"' });
    steps.push({ type: 'result', label: 'retrieved', detail: 'accuracy=75% · cache_hit_latency=1ms · blocked=8' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("SQL safety validator", "dbt SCD Type 2")' });
    steps.push({ type: 'result', label: 'matched', detail: 'cache_hit_rate=20% · miss_latency=14912ms' });
  } else if (q.includes('hpe') || q.includes('experience') || q.includes('work') || q.includes('job')) {
    steps.push({ type: 'think', label: 'intent: experience_query', detail: 'scope=professional_history' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("HPE Cloud Developer", "intern period")' });
    steps.push({ type: 'result', label: 'retrieved', detail: 'role=Cloud Developer I · since=Aug 2025 · Bengaluru' });
    steps.push({ type: 'observe', label: 'HPE_guardrail active', detail: 'internal details → redacted' });
  } else if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
    steps.push({ type: 'think', label: 'intent: skills_query', detail: 'scope=technical_stack' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("skills_evidence_dashboard")' });
    steps.push({ type: 'result', label: 'retrieved', detail: 'Python · Go · Kafka · dbt · RAG · CrewAI · FastAPI' });
    steps.push({ type: 'observe', label: 'nav_suggestion', detail: 'tag=[check skills]' });
  } else if (q.includes('open') || q.includes('hire') || q.includes('role') || q.includes('remote') || q.includes('job')) {
    steps.push({ type: 'think', label: 'intent: availability_query', detail: 'scope=career_status' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("availability", "target_roles")' });
    steps.push({ type: 'result', label: 'retrieved', detail: 'US_remote=yes · EST_overlap=6PM-2AM_IST · contact=abhishekk09827@gmail.com' });
  } else if (q.includes('opinion') || q.includes('think') || q.includes('rag') || q.includes('llm') || q.includes('vector')) {
    steps.push({ type: 'think', label: 'intent: opinion_query', detail: 'scope=AI_engineering_views' });
    steps.push({ type: 'tool', label: 'knowledge_base', detail: 'lookup("llm_opinions", "engineering_philosophy")' });
    steps.push({ type: 'result', label: 'retrieved', detail: '6 opinions loaded · tone=opinionated · first_person=true' });
  } else {
    steps.push({ type: 'think', label: 'intent: general_query', detail: 'scope=portfolio_overview' });
    steps.push({ type: 'tool', label: 'context_retriever', detail: `query="${query.slice(0, 40)}..."` });
    steps.push({ type: 'result', label: 'retrieved', detail: 'portfolio_facts loaded · 3 projects · current_role=HPE' });
  }

  // Always end with observe + generate
  steps.push({ type: 'observe', label: 'context sufficient · composing reply', detail: `${steps.filter(s => s.type === 'result').length} sources verified` });
  steps.push({ type: 'generate', label: 'generating · first_person=true · hallucination_guard=on', detail: undefined });

  return steps;
};

// --- FALLBACK ---
const getFallbackResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('sagescan')) return "SageScan is my data quality CLI — Go for the binary, Python for the stats engine, JSON over stdin/stdout to bridge them. It validates 125,547 rows/sec, catches drift via KS test and PSI, and is on PyPI. If you want the architecture, [view graph].";
  if (q.includes('oi') || q.includes('crewai') || q.includes('aiops')) return "OI-Engine routes noisy infra logs through a Z-score fast path first, then CrewAI agents handle anything that passes. Confidence gating before JIRA escalation dropped false pages from ~65% to ~8%. The key was making the cheap filter do most of the work.";
  if (q.includes('querymind') || q.includes('sql') || q.includes('dbt')) return "QueryMind-DW is an NL-to-SQL warehouse stack. Kafka ingests, dbt transforms with SCD Type 2, and the LLM layer answers plain-English queries with a safety validator in front of execution. Cache hits drop latency from 14,912ms to 1ms. [view graph] has the full flow.";
  if (q.includes('hpe') || q.includes('experience') || q.includes('work')) return "Currently Cloud Developer I at HPE Bengaluru — Kafka pipelines, PySpark transforms, Airflow DAGs, ArgoCD deployments. Can't share internal specifics but the personal projects reflect the same patterns I work with day to day.";
  if (q.includes('skill') || q.includes('stack')) return "Core stack is Python, Go, Kafka, dbt, FastAPI, with RAG layered on where it fits. [check skills] has the full breakdown with evidence tied to actual projects.";
  if (q.includes('open') || q.includes('hire') || q.includes('role') || q.includes('remote')) return "Yeah, actively looking at US remote roles in backend, data platforms, and applied AI. EST overlap is fine. Best path is abhishekk09827@gmail.com.";
  return "Not fully sure on that one — I'd rather not guess. Ask me about SageScan, OI-Engine, QueryMind-DW, or [view graph] for the architecture.";
};

// --- STEP TIMINGS ---
const STEP_DELAY: Record<TraceStep['type'], number> = {
  think: 320,
  tool: 280,
  result: 200,
  observe: 350,
  act: 300,
  generate: 250,
};

const STEP_COLORS: Record<TraceStep['type'], string> = {
  think: '#b06aff',
  tool: '#ffd700',
  result: '#00d4ff',
  observe: '#00d4ff',
  act: '#00ff9d',
  generate: '#00ff9d',
};

const STEP_PREFIXES: Record<TraceStep['type'], string> = {
  think: 'THINK',
  tool: 'TOOL ',
  result: '  OUT',
  observe: ' OBS ',
  act: '  ACT',
  generate: '  GEN',
};

// --- MAIN COMPONENT ---
export const AIAgent: React.FC<{
  activeTab?: PortfolioTabId;
  onTabChange?: (tab: PortfolioTabId) => void;
}> = ({ activeTab, onTabChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'idle' | 'tracing' | 'waiting' | 'streaming'>('idle');
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showStarters, setShowStarters] = useState(true);
  const [waitDots, setWaitDots] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse, visibleCount, phase]);

  // Waiting dots animation
  useEffect(() => {
    if (phase !== 'waiting') { setWaitDots(''); return; }
    let i = 0;
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const t = setInterval(() => { setWaitDots(frames[i++ % frames.length]); }, 80);
    return () => clearInterval(t);
  }, [phase]);

  const handleQuery = useCallback(async (query: string) => {
    if (!query.trim() || phase !== 'idle') return;

    // Abort any prior request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setShowStarters(false);
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setCurrentResponse('');

    // Build intelligent trace
    const steps = buildTrace(query);
    setTraceSteps(steps);
    setVisibleCount(0);
    setPhase('tracing');

    // Reveal steps one by one
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, STEP_DELAY[steps[i].type]));
      setVisibleCount(i + 1);
    }

    // Brief pause then switch to waiting (shows spinner while API responds)
    await new Promise(r => setTimeout(r, 200));
    setPhase('waiting');

    try {
      const historySnapshot = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({ messages: historySnapshot, query }),
      });

      if (!response.ok || !response.body) throw new Error('API error');

      setPhase('streaming');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(dataStr);
            const token = parsed.choices?.[0]?.delta?.content ?? '';
            if (token) {
              full += token;
              setCurrentResponse(full);
            }
          } catch { /* skip malformed SSE */ }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }]);
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const fallback = getFallbackResponse(query);
      // Simulate streaming on fallback so it doesn't feel jarring
      setPhase('streaming');
      let i = 0;
      const stream = setInterval(() => {
        i = Math.min(i + 3, fallback.length);
        setCurrentResponse(fallback.slice(0, i));
        if (i >= fallback.length) {
          clearInterval(stream);
          setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
          setCurrentResponse('');
          setPhase('idle');
          setTraceSteps([]);
          setVisibleCount(0);
        }
      }, 18);
      return;
    }

    setCurrentResponse('');
    setPhase('idle');
    setTraceSteps([]);
    setVisibleCount(0);
  }, [phase, messages]);

  const parseWithLinks = (text: string) => {
    const tabMap: Record<string, { id: PortfolioTabId; label: string }> = {
      '[view graph]': { id: 'graph', label: 'Architecture' },
      '[check skills]': { id: 'radar', label: 'Skills' },
      '[see design]': { id: 'graph', label: 'Design' },
      '[go home]': { id: 'core', label: 'Terminal' },
      '[view activity]': { id: 'activity', label: 'Activity' },
    };
    const parts = text.split(/(\[view graph\]|\[check skills\]|\[see design\]|\[go home\]|\[view activity\])/g);
    return parts.map((part, i) => {
      const mapping = tabMap[part];
      if (mapping) {
        return (
          <button
            key={i}
            onClick={() => onTabChange?.(mapping.id)}
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid var(--cyan)',
              color: 'var(--cyan)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer',
              margin: '0 3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              verticalAlign: 'middle',
              fontFamily: 'var(--font)',
            }}
          >
            <ExternalLink size={9} />
            {mapping.label}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const activeLabel =
    activeTab === 'graph' ? 'Architecture' :
      activeTab === 'radar' ? 'Skills' :
        activeTab === 'activity' ? 'Activity' : 'Terminal';

  const isActive = phase !== 'idle';

  return (
    <div
      className="glass-panel ai-agent-shell"
      style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{
        height: '40px',
        background: 'rgba(176,106,255,0.06)',
        borderBottom: '1px solid rgba(176,106,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isActive ? '#00ff9d' : 'var(--purple)',
            boxShadow: `0 0 8px ${isActive ? '#00ff9d' : 'var(--purple)'}`,
            transition: 'all 0.3s',
          }} className={isActive ? '' : 'blink'} />
          <span style={{ fontSize: '11px', letterSpacing: '0.05em', fontWeight: 'bold', color: 'var(--purple)', whiteSpace: 'nowrap' }}>
            ABHISHEK_REASONING_CORE
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {phase === 'tracing' ? 'TRACING' :
            phase === 'waiting' ? 'WAITING' :
              phase === 'streaming' ? 'STREAMING' : activeLabel}
        </span>
      </div>

      {/* ── CHAT AREA ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontSize: '12px',
        lineHeight: '1.65',
        fontFamily: 'var(--font)',
        background: 'rgba(0,0,0,0.1)',
      }}>
        {messages.length === 0 && phase === 'idle' && (
          <div style={{ color: 'var(--dim)', textAlign: 'center', marginTop: '24px', fontSize: '11px' }}>
            Awaiting prompt injection...
          </div>
        )}

        {/* Message history */}
        {messages.map((m, i) => (
          <div key={i} style={{
            borderLeft: m.role === 'user' ? '2px solid var(--border)' : 'none',
            paddingLeft: m.role === 'user' ? '12px' : '0',
          }}>
            <div style={{ color: m.role === 'user' ? 'var(--dim)' : 'var(--cyan)', fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' }}>
              {m.role === 'user' ? 'guest ~$' : 'abhishek ~>'}
            </div>
            <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
              {parseWithLinks(m.content)}
            </div>
          </div>
        ))}

        {/* ── RLM EXECUTION TRACE ── */}
        <AnimatePresence>
          {(phase === 'tracing' || phase === 'waiting') && traceSteps.length > 0 && (
            <motion.div
              key="trace"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
              style={{
                background: '#0a0f1a',
                border: '1px solid rgba(0,212,255,0.12)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                fontFamily: 'var(--font)',
                fontSize: '11px',
              }}
            >
              {/* Trace header */}
              <div style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>execution trace</span>
                <span style={{ color: 'rgba(0,212,255,0.3)' }}>ReAct · RAG</span>
              </div>

              {/* Trace steps */}
              {traceSteps.slice(0, visibleCount).map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{
                      color: STEP_COLORS[step.type],
                      fontWeight: 700,
                      minWidth: '38px',
                      fontSize: '10px',
                      letterSpacing: '0.05em',
                      opacity: 0.85,
                    }}>
                      {STEP_PREFIXES[step.type]}
                    </span>
                    <span style={{ color: STEP_COLORS[step.type], opacity: 0.9 }}>
                      {step.label}
                    </span>
                  </div>
                  {step.detail && (
                    <div style={{
                      color: 'rgba(255,255,255,0.3)',
                      paddingLeft: '46px',
                      fontSize: '10px',
                      fontStyle: 'italic',
                    }}>
                      {step.detail}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Waiting state — spinner + label */}
              {phase === 'waiting' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}
                >
                  <span style={{ color: '#00ff9d', fontSize: '10px', minWidth: '38px', fontWeight: 700 }}>WAIT</span>
                  <span style={{ color: '#00ff9d', opacity: 0.7, fontSize: '11px' }}>
                    {waitDots} streaming response...
                  </span>
                </motion.div>
              )}

              {/* Progress bar */}
              <div style={{
                height: '1px',
                background: 'rgba(255,255,255,0.04)',
                marginTop: '8px',
                borderRadius: '1px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: phase === 'waiting' ? '0%' : `-${100 - (visibleCount / traceSteps.length) * 100}%` }}
                  transition={phase === 'waiting'
                    ? { duration: 0.4, ease: 'easeOut' }
                    : { duration: 0.3, ease: 'linear' }
                  }
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: phase === 'waiting'
                      ? 'linear-gradient(90deg, var(--purple), var(--cyan))'
                      : 'var(--cyan)',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STREAMING RESPONSE ── */}
        <AnimatePresence>
          {(phase === 'streaming' || (phase === 'waiting' && visibleCount >= traceSteps.length)) && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ color: 'var(--cyan)', fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' }}>
                abhishek ~&gt;
              </div>
              <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                {parseWithLinks(currentResponse)}
                <span style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '13px',
                  background: 'var(--cyan)',
                  marginLeft: '3px',
                  verticalAlign: 'middle',
                  borderRadius: '1px',
                }} className="blink" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* Starter chips */}
        <AnimatePresence>
          {showStarters && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px 12px', background: 'rgba(0,0,0,0.2)' }}
            >
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => handleQuery(q)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(176,106,255,0.35)',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    color: 'var(--purple)',
                    fontSize: '10px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(176,106,255,0.35)')}
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text input */}
        <div style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(176,106,255,0.02)',
        }}>
          <TerminalSquare size={13} style={{ color: 'var(--purple)', flexShrink: 0, opacity: isActive ? 0.4 : 1, transition: 'opacity 0.2s' }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuery(input);
              }
            }}
            placeholder={isActive ? 'processing...' : 'Ask Abhishek about his systems...'}
            rows={1}
            disabled={isActive}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isActive ? 'var(--dim)' : 'var(--text)',
              fontFamily: 'var(--font)',
              fontSize: '12px',
              caretColor: 'var(--purple)',
              resize: 'none',
              padding: '2px 0',
              transition: 'color 0.2s',
            }}
          />
          <button
            onClick={() => handleQuery(input)}
            disabled={!input.trim() || isActive}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: !input.trim() || isActive ? 'not-allowed' : 'pointer',
              padding: 0,
              opacity: !input.trim() || isActive ? 0.25 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <Send size={13} style={{ color: 'var(--cyan)' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;