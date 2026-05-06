import React, { useState, useEffect, useRef } from 'react';
import { TerminalSquare, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TraceStep {
  type: 'think' | 'tool' | 'observe' | 'act';
  text: string;
  command?: string;
  result?: string;
}

type PortfolioTabId = 'core' | 'graph' | 'radar' | 'activity';

// --- CONSTANTS ---
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY || '';
const MODEL = "openai/gpt-oss-120b:free";

const PORTFOLIO_FACTS = `
Verified facts:
- You are Abhishek Kaushik, a Cloud Developer at HPE Bengaluru and Backend & Applied AI Engineer.
- SageScan: Go CLI + Python stats engine, JSON stdin/stdout bridge, 17 validator types, PyPI published.
- OI-Engine: CrewAI-based AIOps system, FastAPI gateway, Redis/Postgres/pgvector, confidence gating for alerts.
- QueryMind-DW: Kafka -> MinIO -> dbt -> DuckDB/Postgres -> Streamlit, NL-to-SQL with RAG and validation.
- Skills: Kafka, dbt, Airflow, RAG, Go, Python, FastAPI, PostgreSQL, Redis.
- Tone: first person, concise, practical, a little informal, never robotic.
- Behavior: if unsure, say so plainly and redirect to a relevant project, section, or contact path.
- Navigation tags: [view graph], [check skills], [see design], [go home], [view activity].
`;

const SYSTEM_PROMPT = `
You are Abhishek Kaushik speaking as yourself inside your portfolio.
Write in first person. Sound like a real engineer talking to a visitor, not like a generic chatbot.
Keep answers short by default. Give the gist first, then add only the most useful detail.
Never invent facts, metrics, or work history. If something is not in the facts below, say you are not fully sure.
When a question is outside the portfolio scope, redirect the user to a relevant section with a navigation tag instead of guessing.

${PORTFOLIO_FACTS}

When you mention an architecture or project, keep it outcome-oriented:
- what problem it solves
- what approach you used
- what the result was

Use navigation tags naturally, for example: "If you want the architecture, [view graph]."
If asked about experience, answer in 1 to 2 short paragraphs, not a resume dump.
`;

const STARTER_QUESTIONS = [
  "What's the gist of SageScan?",
  "Why did you use CrewAI in OI-Engine?",
  "Tell me about your RAG expertise.",
  "Are you open to new roles?"
];

// --- FALLBACK BRAIN (Mock Response when API fails) ---
const getFallbackResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('sagescan')) {
    return "SageScan is my data validation CLI for catching bad inputs before they hit production. I kept the CLI in Go, pushed the statistical checks into Python, and used a JSON bridge between them. If you want the flow, [view graph].";
  }
  if (q.includes('oi-engine') || q.includes('aiops') || q.includes('crewai')) {
    return "OI-Engine is my AIOps project for turning noisy logs into useful incident summaries. The main idea was to combine a fast statistical filter with CrewAI-based analysis, then gate the output with confidence scoring so alerts stay useful.";
  }
  if (q.includes('querymind') || q.includes('sql') || q.includes('dbt')) {
    return "QueryMind-DW is my NL-to-SQL warehouse stack. Kafka handles ingestion, dbt shapes the data, and the LLM layer answers in plain English with validation in front of execution. I’d point you to [view graph] for the full flow.";
  }
  if (q.includes('experience') || q.includes('hpe') || q.includes('work')) {
    return "I’m currently a Cloud Developer at HPE Bengaluru, and most of my work sits at the intersection of backend systems, data workflows, and applied AI. A lot of my recent time has gone into building reliable pipelines and agents that are actually useful in production.";
  }
  if (q.includes('skills') || q.includes('stack')) {
    return "My core stack is Python, Go, Kafka, dbt, and FastAPI, with RAG layered on top where it makes sense. The skills dashboard gives a cleaner snapshot if you want the full picture: [check skills].";
  }
  if (q.includes('role') || q.includes('hire') || q.includes('job') || q.includes('open')) {
    return "I’m open to Backend, Data, and Applied AI roles that have real engineering depth. If it feels like a fit, reach out and let’s talk.";
  }

  return "I’m not fully sure on that one, and I’d rather not guess. If you want, ask me about SageScan, OI-Engine, QueryMind-DW, or [view graph] for the architecture.";
};

// --- COMPONENTS ---

export const AIAgent: React.FC<{ activeTab?: PortfolioTabId, onTabChange?: (tab: PortfolioTabId) => void }> = ({ activeTab, onTabChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isReasoning, setIsReasoning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showStarters, setShowStarters] = useState(true);
  const activeLabel = activeTab === 'graph'
    ? 'Architecture'
    : activeTab === 'radar'
      ? 'Skills'
      : activeTab === 'activity'
        ? 'Activity'
        : 'Terminal';

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse, traceSteps, isReasoning]);

  const mapIntentToTools = (query: string): TraceStep[] => {
    const q = query.toLowerCase();
    const steps: TraceStep[] = [];

    const contextType = (q.includes('project') || q.includes('sagescan') || q.includes('oi') || q.includes('querymind') ? 'projects' : 'general_profile');
    steps.push({ type: 'think', text: 'checking portfolio facts' });
    steps.push({ type: 'think', text: `matching context: ${contextType}` });

    if (q.includes('sagescan')) {
      steps.push({ type: 'tool', text: 'context_retriever', command: 'search("SageScan architecture")', result: 'returned: concise project facts' });
    } else if (q.includes('oi-engine') || q.includes('crewai')) {
      steps.push({ type: 'tool', text: 'context_retriever', command: 'search("OI-Engine agents")', result: 'returned: CrewAI summary' });
    } else {
      steps.push({ type: 'tool', text: 'context_retriever', command: `search("${contextType}")`, result: 'returned: relevant notes' });
    }

    steps.push({ type: 'observe', text: 'facts checked, drafting reply...' });
    steps.push({ type: 'act', text: 'replying in first person...' });

    return steps;
  };

  const handleQuery = async (query: string) => {
    if (!query.trim() || isReasoning || isStreaming) return;

    setShowStarters(false);
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsReasoning(true);
    setTraceSteps([]);
    setCurrentResponse('');

    const steps = mapIntentToTools(query);

    // DELIBERATE PACE for reasoning
    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.type === 'think' ? 800 : 1000));
      setTraceSteps(prev => [...prev, step]);
    }

    await new Promise(r => setTimeout(r, 1200));

    setIsReasoning(false);
    setIsStreaming(true);

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_key_here') {
      setIsStreaming(false);
      const fallback = getFallbackResponse(query);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "X-Title": "Abhishek Portfolio Agent",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: query }
          ],
          temperature: 0.2,
          top_p: 0.9,
          stream: true
        })
      });

      if (!response.ok) throw new Error("API Error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices[0]?.delta?.content || '';
              fullContent += content;
              setCurrentResponse(fullContent);
          } catch {
            // Ignore malformed SSE payloads and keep streaming.
          }
        }
      }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setCurrentResponse('');
      setIsStreaming(false);

    } catch (err: unknown) {
      console.error(err);
      // personised fallback
      const fallback = getFallbackResponse(query);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      setCurrentResponse('');
      setIsStreaming(false);
    }
  };

  const parseContentWithLinks = (text: string) => {
    const parts = text.split(/(\[view graph\]|\[check skills\]|\[see design\]|\[go home\]|\[view activity\])/g);

    return parts.map((part, i) => {
      const tabMap: Record<string, { id: PortfolioTabId; label: string }> = {
        '[view graph]': { id: 'graph', label: 'Architecture' },
        '[check skills]': { id: 'radar', label: 'Skills' },
        '[see design]': { id: 'graph', label: 'Architecture' },
        '[go home]': { id: 'core', label: 'Terminal' },
        '[view activity]': { id: 'activity', label: 'Activity' }
      };

      if (tabMap[part]) {
        return (
          <button
            key={i}
            onClick={() => onTabChange?.(tabMap[part].id)}
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid var(--cyan)',
              color: 'var(--cyan)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              margin: '0 4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              verticalAlign: 'middle'
            }}
          >
            <ExternalLink size={10} />
            {tabMap[part].label}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="glass-panel ai-agent-shell" style={{
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* HEADER */}
      <div style={{
        height: '40px',
        background: 'rgba(176,106,255,0.06)',
        borderBottom: '1px solid rgba(176,106,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        gap: '8px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--purple)', boxShadow: '0 0 8px var(--purple)'
          }} className="blink" />
          <span className="text-purple" style={{ fontSize: '11px', letterSpacing: '0.05em', fontWeight: 'bold', whiteSpace: 'nowrap' }}>ABHISHEK_REASONING_CORE</span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
          {activeLabel}
        </span>
      </div>

      {/* CHAT AREA */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontSize: '12px',
        lineHeight: '1.6',
        fontFamily: 'var(--font)',
        background: 'rgba(0,0,0,0.1)'
      }}>
        {messages.length === 0 && !isReasoning && (
          <div style={{ color: 'var(--dim)', textAlign: 'center', marginTop: '20px' }}>
            Awaiting prompt injection...
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ borderLeft: m.role === 'user' ? '2px solid var(--border)' : 'none', paddingLeft: m.role === 'user' ? '12px' : '0' }}>
            <div style={{ color: m.role === 'user' ? 'var(--dim)' : 'var(--cyan)', fontWeight: 'bold', marginBottom: '4px' }}>
              {m.role === 'user' ? 'guest ~$' : 'abhishek ~>'}
            </div>
            <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
              {parseContentWithLinks(m.content)}
            </div>
          </div>
        ))}

        {/* REASONING SANDBOX */}
        <AnimatePresence>
          {isReasoning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: '#0f1520',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '11px'
              }}
            >
              <div style={{ color: 'var(--dim)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', textTransform: 'uppercase', fontSize: '10px' }}>
                Response Status
              </div>

              {traceSteps.map((step, idx) => (
                <div key={idx} style={{ animation: 'fadeIn 0.2s ease forwards' }}>
                  {step.type === 'think' && (
                    <div style={{ color: '#b06aff' }}>
                      <span style={{ marginRight: '8px' }}>[CHECK]</span>
                      <Typewriter text={step.text} delay={25} />
                    </div>
                  )}
                  {step.type === 'tool' && (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ color: '#ffd700', fontWeight: 'bold' }}>[TOOL: {step.text}]</div>
                      <div style={{ color: '#00ff9d', marginLeft: '8px' }}>$ {step.command}</div>
                      <div style={{ color: '#00d4ff', marginLeft: '8px' }}>&gt; {step.result}</div>
                    </div>
                  )}
                  {step.type === 'observe' && (
                    <div style={{ color: '#00d4ff', marginTop: '4px' }}>[STATUS] ▸ {step.text}</div>
                  )}
                  {step.type === 'act' && (
                    <div style={{ color: '#00ff9d', marginTop: '4px' }}>[STATUS] ▸ {step.text}</div>
                  )}
                </div>
              ))}

              <div style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.05)', marginTop: '8px', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '0%' }}
                  transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--cyan)' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STREAMING RESPONSE */}
        {isStreaming && (
          <div>
            <div style={{ color: 'var(--cyan)', fontWeight: 'bold', marginBottom: '4px' }}>abhishek ~&gt;</div>
            <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
              {parseContentWithLinks(currentResponse)}
              <span className="blink" style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--cyan)', marginLeft: '4px', verticalAlign: 'middle' }} />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {showStarters && messages.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
            {STARTER_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => handleQuery(q)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--cyan)',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: 'var(--cyan)',
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(176,106,255,0.03)'
        }}>
          <TerminalSquare size={14} className="text-purple" style={{ flexShrink: 0 }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuery(input);
              }
            }}
            placeholder="Ask Abhishek about systems..."
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--font)',
              fontSize: '12px',
              caretColor: 'var(--purple)',
              resize: 'none',
              padding: '2px 0'
            }}
          />
          <button
            onClick={() => handleQuery(input)}
            disabled={!input.trim() || isReasoning || isStreaming}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, opacity: input.trim() ? 1 : 0.3 }}
          >
            <Send size={14} className="text-cyan" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Typewriter: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};
