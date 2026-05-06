import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';

const SUGGESTIONS = [
  { cmd: 'projects', desc: 'View my open-source and professional work' },
  { cmd: 'experience', desc: 'See my career timeline' },
  { cmd: 'skills', desc: 'List of technical skills and proficiencies' },
  { cmd: 'blog', desc: 'Read my latest Hashnode articles' },
  { cmd: 'resume', desc: 'Download my resume as PDF' },
  { cmd: 'whoami', desc: 'About me' },
  { cmd: 'contact', desc: 'Get in touch' }
];

interface CommandPaletteProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCommand: (cmd: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isVisible, onClose, onSelectCommand }) => {
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SUGGESTIONS.filter(s => s.cmd.includes(input.toLowerCase()) || s.desc.toLowerCase().includes(input.toLowerCase()));

  useEffect(() => {
    if (isVisible) {
      const timer = window.setTimeout(() => {
        setInput('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectCommand(filtered[selectedIndex].cmd);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, filtered, selectedIndex, onClose, onSelectCommand]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '15vh'
        }} onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="glass-panel"
            style={{
              width: '100%', maxWidth: '600px',
              borderRadius: '12px',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 0 1px var(--cyan), 0 32px 80px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <Search size={20} color="var(--cyan)" style={{ marginRight: '12px' }} />
              <input
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); setSelectedIndex(0); }}
                placeholder="Type a command or search..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text)', fontSize: '16px', fontFamily: 'var(--font)'
                }}
              />
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)', background: 'var(--glass)', padding: '2px 6px', borderRadius: '4px' }}>ESC</span>
              </div>
            </div>

            <div style={{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {filtered.map((s, i) => (
                <div
                  key={s.cmd}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => { onSelectCommand(s.cmd); onClose(); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: i === selectedIndex ? 'rgba(0,212,255,0.1)' : 'transparent',
                    borderLeft: i === selectedIndex ? '3px solid var(--cyan)' : '3px solid transparent'
                  }}
                >
                  <Command size={16} color={i === selectedIndex ? 'var(--cyan)' : 'var(--muted)'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: i === selectedIndex ? 'var(--cyan)' : 'var(--text)', fontWeight: i === selectedIndex ? 'bold' : 'normal', fontSize: '14px' }}>{s.cmd}</div>
                    <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '2px' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
                  No commands found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
