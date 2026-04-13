import React, { useState, useEffect, useRef } from 'react';
import { HexLogo } from './HexLogo';
import { InlineWidgets } from './InlineWidgets';

interface TerminalProps {
  forceCommand: string | null;
}

interface CommandLog {
  id: number;
  text?: string;
  type: 'prompt' | 'output' | 'error' | 'success' | 'dim' | 'widget';
  widgetType?: 'projects' | 'experience' | 'skills' | 'blog' | 'resume';
}

const BOOT_SEQUENCE = [
  { text: 'abhishek@ai-engineer:~', type: 'prompt' },
  { text: '', type: 'output' },
  { text: '  Backend & Applied AI Engineer · Distributed Systems · LLMs', type: 'output' },
  { text: '  v3.0.0 · zsh 5.9 · ⬡ node 20 · 🐍 python 3.11', type: 'dim' },
  { text: '', type: 'output' },
  { text: '  Press `/` for Command Palette, or type `help`.', type: 'dim' },
  { text: '  Try: whoami · projects · experience · skills · blog · resume', type: 'dim' },
  { text: '', type: 'output' }
];

export const Terminal: React.FC<TerminalProps> = ({ forceCommand }) => {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);
  const [booted, setBooted] = useState(false);

  const appendLog = (text: string, type: CommandLog['type'] = 'output', widgetType?: CommandLog['widgetType']) => {
    setLogs(prev => [...prev, { id: idCounter.current++, text, type, widgetType }]);
  };

  useEffect(() => {
    // Initial Boot
    setTimeout(() => {
      let delay = 0;
      BOOT_SEQUENCE.forEach((line) => {
        setTimeout(() => appendLog(line.text, line.type as any), delay);
        delay += 50;
      });
      setTimeout(() => {
        setBooted(true);
        inputRef.current?.focus();
      }, delay);
    }, 800); // Wait for logo
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (forceCommand && booted) {
      handleCommand(forceCommand);
    }
  }, [forceCommand, booted]);

  const handleCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim().toLowerCase();
    appendLog(`abhishek@ai-engineer:~$ ${cmdStr}`, 'prompt');
    
    if (!cmd) return;

    setHistory(prev => [cmdStr, ...prev]);
    setHistoryIdx(-1);

    switch(cmd) {
      case 'help':
        appendLog('AVAILABLE COMMANDS', 'output');
        appendLog('  whoami       - about me', 'dim');
        appendLog('  projects     - github projects & open source', 'dim');
        appendLog('  experience   - work history', 'dim');
        appendLog('  skills       - technical proficiencies', 'dim');
        appendLog('  blog         - latest articles on Hashnode', 'dim');
        appendLog('  resume       - download PDF resume', 'dim');
        appendLog('  contact      - get in touch', 'dim');
        appendLog('  clear        - clear terminal', 'dim');
        break;
      case 'whoami':
        appendLog('  Abhishek Kaushik', 'success');
        appendLog('  Backend & Applied AI Engineer building systems that survive production.', 'output');
        appendLog('  Current Focus: RAG Architectures, Distributed Platforms, LLM Agents', 'dim');
        break;
      case 'experience':
        appendLog('Fetching experience timeline...', 'dim');
        appendLog('', 'widget', 'experience');
        break;
      case 'projects':
        appendLog('Pulling repositories from github.com/abhishek09827...', 'dim');
        appendLog('', 'widget', 'projects');
        break;
      case 'skills':
        appendLog('Loading skill matrices...', 'dim');
        appendLog('', 'widget', 'skills');
        break;
      case 'blog':
        appendLog('Fetching articles from hashnode...', 'dim');
        appendLog('', 'widget', 'blog');
        break;
      case 'resume':
        appendLog('Generating PDF...', 'dim');
        appendLog('', 'widget', 'resume');
        break;
      case 'contact':
        appendLog('  GitHub: github.com/abhishek09827', 'output');
        appendLog('  LinkedIn: linkedin.com/in/abhishek-kaushik-0a6a16243', 'output');
        appendLog('  Email: abhishekk09827@gmail.com', 'output');
        break;
      case 'clear':
        setLogs([]);
        break;
      default:
        appendLog(`zsh: command not found: ${cmdStr}`, 'error');
        appendLog(`Type \`help\` to see available commands.`, 'dim');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="glass-panel" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden'
    }} onClick={() => inputRef.current?.focus()}>
      
      <div style={{
        height: '40px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: '8px'
      }}>
        <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'var(--dim)', letterSpacing: '0.05em' }}>
          abhishek@ai-engineer — zsh — 120×40
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        fontSize: '13px',
        lineHeight: '1.7'
      }}>
        {/* Sleek Hex Logo at top of terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '24px' }}>
          <HexLogo />
        </div>

        {logs.map(log => {
          if (log.type === 'widget' && log.widgetType) {
            return <InlineWidgets key={log.id} type={log.widgetType} />;
          }

          let color = 'var(--text)';
          if (log.type === 'prompt') color = 'var(--cyan)';
          if (log.type === 'error') color = 'var(--red)';
          if (log.type === 'success') color = 'var(--green)';
          if (log.type === 'dim') color = 'var(--dim)';

          return (
            <div key={log.id} style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'var(--font)', marginBottom: '4px' }}>
              {log.text}
            </div>
          );
        })}
        
        {booted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ color: 'var(--cyan)', whiteSpace: 'nowrap' }}>abhishek@ai-engineer:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              spellCheck="false"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontFamily: 'var(--font)',
                fontSize: '13px',
                caretColor: 'var(--cyan)'
              }}
            />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

