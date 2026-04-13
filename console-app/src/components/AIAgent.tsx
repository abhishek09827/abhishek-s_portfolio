import React, { useState, useEffect, useRef } from 'react';
import { TerminalSquare } from 'lucide-react';

interface LogLine {
  id: number;
  text: string;
  type: 'info' | 'reasoning' | 'action' | 'output' | 'error' | 'user';
}

const INITIAL_LOGS: LogLine[] = [
  { id: 1, text: '[INIT] Bootstrapping AI Reasoning Engine v2.4.1', type: 'info' },
  { id: 2, text: '[INIT] Loading LangGraph state machine...', type: 'info' },
  { id: 3, text: '[INIT] Connecting to vector store (Pinecone)... OK', type: 'info' },
  { id: 4, text: '[INIT] Agent online — awaiting context.', type: 'info' }
];

export const AIAgent: React.FC = () => {
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(5);

  const appendLog = (text: string, type: LogLine['type'] = 'info') => {
    setLogs(prev => [...prev, { id: idCounter.current++, text, type }]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const [isThinking, setIsThinking] = useState(false);

  const handleQuery = async (query: string) => {
    if (!query.trim()) return;
    
    appendLog(`> ${query}`, 'user');
    setIsThinking(true);
    
    // Simulate reasoning steps
    setTimeout(() => appendLog('[INTENT] Analyzing user query intent...', 'reasoning'), 500);
    setTimeout(() => appendLog('[RAG] Querying vector DB for context matching query...', 'action'), 1500);
    setTimeout(() => appendLog('[RAG] Retrieved 3 relevant document chunks.', 'info'), 2800);
    setTimeout(() => appendLog('[REASONING] Synthesizing response from retrieved context...', 'reasoning'), 4000);
    setTimeout(() => {
      appendLog(`[OUTPUT] Based on the context, Abhishek has extensive experience with Kafka, Spark, and building AI agents. I can execute commands to show more specific details.`, 'output');
      setIsThinking(false);
    }, 6000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuery(input);
      setInput('');
    }
  };

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '40px',
        background: 'rgba(176,106,255,0.06)',
        borderBottom: '1px solid rgba(176,106,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px'
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--purple)', boxShadow: '0 0 8px var(--purple)'
        }} className="blink" />
        <span className="text-purple" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>AI_REASONING_CORE</span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '12px',
        lineHeight: '1.6'
      }}>
        {logs.map(log => {
          let color = 'var(--dim)';
          if (log.type === 'reasoning') color = 'var(--cyan)';
          if (log.type === 'action') color = 'var(--magenta)';
          if (log.type === 'output') color = 'var(--green)';
          if (log.type === 'error') color = 'var(--red)';
          if (log.type === 'user') color = 'var(--text)';

          return (
            <div key={log.id} style={{ color, wordBreak: 'break-word', fontFamily: 'var(--font)' }}>
              {log.text}
            </div>
          );
        })}

        {/* Inline Pipeline Animation when thinking */}
        {isThinking && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--cyan)', fontSize: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>PIPELINE_ACTIVE</span>
              <span className="blink">PROCESSING...</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: 'var(--border)', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-1px', width: '4px', height: '4px', background: 'var(--magenta)', borderRadius: '50%', animation: 'moveRight 1s linear infinite' }} />
              </div>
              {/* Nodes */}
              <div style={{ width: '8px', height: '8px', background: 'var(--cyan)', borderRadius: '50%', zIndex: 1, boxShadow: '0 0 10px var(--cyan)' }} />
              <div style={{ width: '8px', height: '8px', background: 'var(--purple)', borderRadius: '50%', zIndex: 1, boxShadow: '0 0 10px var(--purple)' }} />
              <div style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%', zIndex: 1, boxShadow: '0 0 10px var(--green)' }} />
            </div>
            <style>{`
              @keyframes moveRight {
                0% { left: 0%; opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { left: 100%; opacity: 0; }
              }
            `}</style>
          </div>
        )}
        <div ref={logsEndRef} />
      </div>

      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(176,106,255,0.03)'
      }}>
        <TerminalSquare size={14} className="text-purple" />
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Inject context or query..." 
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font)',
            fontSize: '12px',
            caretColor: 'var(--purple)'
          }}
        />
      </div>
    </div>
  );
};
