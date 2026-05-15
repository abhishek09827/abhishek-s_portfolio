import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HexLogo } from './HexLogo';
import { InlineWidgets } from './InlineWidgets';

interface TerminalProps {
  forceCommand: string | null;
}

interface CommandLog {
  id: number;
  text?: string | React.ReactNode;
  type: 'prompt' | 'output' | 'error' | 'success' | 'dim' | 'widget' | 'cyan';
  widgetType?: 'projects' | 'experience' | 'skills' | 'blog' | 'resume' | 'contact';
}

type BootLine = {
  text: string | React.ReactNode;
  type: CommandLog['type'];
};

// Removed BOOT_SEQUENCE constant from global scope to move it inside Terminal component for interactivity.

export const Terminal: React.FC<TerminalProps> = ({ forceCommand }) => {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);
  const [booted, setBooted] = useState(false);

  const appendLogs = useCallback((entries: Array<{ text?: string | React.ReactNode; type?: CommandLog['type']; widgetType?: CommandLog['widgetType'] }>) => {
    setLogs(prev => [
      ...prev,
      ...entries.map(entry => ({
        id: idCounter.current++,
        text: entry.text,
        type: entry.type ?? 'output',
        widgetType: entry.widgetType
      }))
    ]);
  }, []);

  const handleCommand = useCallback((cmdStr: string) => {
    const cmd = cmdStr.trim().toLowerCase();
    const batch: Array<{ text?: string | React.ReactNode; type?: CommandLog['type']; widgetType?: CommandLog['widgetType'] }> = [
      { text: `abhishek@ai-engineer:~$ ${cmdStr}`, type: 'prompt' }
    ];

    if (!cmd) return;

    setHistory(prev => [cmdStr, ...prev]);
    setHistoryIdx(-1);

    switch (cmd) {
      case 'help':
        batch.push(
          { text: 'AVAILABLE COMMANDS', type: 'output' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('whoami')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- about me</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('projects')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- github projects & open source</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('experience')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>experience</span>&nbsp;&nbsp;&nbsp;- work history</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('skills')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- technical proficiencies</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('blog')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>blog</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- latest articles on Hashnode</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('resume')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>resume</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- download PDF resume</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('contact')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- get in touch</span>, type: 'dim' },
          { text: <span>&nbsp;&nbsp;<span onClick={() => handleCommand('clear')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- clear terminal</span>, type: 'dim' }
        );
        break;
      case 'whoami':
        batch.push(
          { text: '  Abhishek Kaushik (@abhishek09827)', type: 'success' },
          { text: '  Cloud Developer @ Hewlett Packard Enterprise, Bengaluru', type: 'output' },
          { text: '  Backend & Applied AI Engineer', type: 'output' },
          { text: '', type: 'output' },
          { 
            text: (
              <span>
                &nbsp;&nbsp;Quick links: {' '}
                <a href="https://github.com/abhishek09827" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>GitHub</a> | {' '}
                <a href="https://www.linkedin.com/in/abhishek-kaushik-0a6a16243/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>LinkedIn</a> | {' '}
                <span onClick={() => handleCommand('resume')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Resume</span> | {' '}
                <span onClick={() => handleCommand('contact')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Contact</span>
              </span>
            ), 
            type: 'cyan' 
          },
          { text: '', type: 'output' },
          { text: '  [ ENGINEERING PHILOSOPHY ]', type: 'cyan' },
          { text: '  - Build systems, not scripts', type: 'dim' },
          { text: '  - Design for retries, failure, and scale', type: 'dim' },
          { text: '  - Observability is not optional', type: 'dim' },
          { text: '  - AI should reduce operational complexity', type: 'dim' },
          { text: '  - Measure latency, cost, and reliability', type: 'dim' }
        );
        break;
      case 'experience':
        batch.push(
          { text: 'Fetching experience timeline...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'experience' }
        );
        break;
      case 'projects':
        batch.push(
          { text: 'Pulling repositories from github.com/abhishek09827...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'projects' }
        );
        break;
      case 'skills':
        batch.push(
          { text: 'Loading skill matrices...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'skills' }
        );
        break;
      case 'blog':
        batch.push(
          { text: 'Fetching articles from hashnode...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'blog' }
        );
        break;
      case 'resume':
        batch.push(
          { text: 'Generating PDF...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'resume' }
        );
        break;
      case 'contact':
        batch.push(
          { text: 'Opening contact shortcuts...', type: 'dim' },
          { text: '', type: 'widget', widgetType: 'contact' }
        );
        break;
      case 'clear':
        setLogs([]);
        break;
      default:
        batch.push(
          { text: `zsh: command not found: ${cmdStr}`, type: 'error' },
          { text: 'Type `help` to see available commands.', type: 'dim' }
        );
    }
    if (cmd !== 'clear') {
      appendLogs(batch);
    }
  }, [appendLogs]);

  const BOOT_SEQUENCE: BootLine[] = React.useMemo(() => [
    { text: 'abhishek@ai-engineer:~', type: 'prompt' },
    { text: '', type: 'output' },
    { text: '  Cloud Developer @ Hewlett Packard Enterprise (HPE)', type: 'output' },
    { text: '  Kafka · dbt · RAG · CrewAI · Go · PyPI author · OSS contributor', type: 'output' },
    { text: '  v3.0.0 | zsh 5.9 | node 20 | python 3.11', type: 'dim' },
    { text: '', type: 'output' },
    { 
      text: (
        <span>
          &nbsp;&nbsp;Press `/` for Command Palette, or type <span onClick={() => handleCommand('help')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>help</span>.
        </span>
      ), 
      type: 'dim' 
    },
    { 
      text: (
        <span>
          &nbsp;&nbsp;Try: {' '}
          {['whoami', 'projects', 'experience', 'skills', 'blog', 'resume', 'contact'].map((c, i, arr) => (
            <React.Fragment key={c}>
              <span onClick={() => handleCommand(c)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{c}</span>
              {i < arr.length - 1 ? ' | ' : ''}
            </React.Fragment>
          ))}
        </span>
      ), 
      type: 'dim' 
    },
    { text: '', type: 'output' }
  ], [handleCommand]);

  useEffect(() => {
    // Initial Boot
    const timer = window.setTimeout(() => {
      setLogs(BOOT_SEQUENCE.map(line => ({
        id: idCounter.current++,
        text: line.text,
        type: line.type
      })));
      setBooted(true);
      inputRef.current?.focus();
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  useEffect(() => {
    if (forceCommand && booted) {
      const timer = window.setTimeout(() => handleCommand(forceCommand), 0);
      return () => window.clearTimeout(timer);
    }
  }, [forceCommand, booted, handleCommand]);

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
      overflow: 'hidden',
      minWidth: 0
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
          if (log.type as string === 'cyan') color = 'var(--cyan)';

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
