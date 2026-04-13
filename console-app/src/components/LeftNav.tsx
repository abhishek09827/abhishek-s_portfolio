import React from 'react';
import { TerminalSquare, ShieldAlert, GitBranch, Settings, Code, FileText } from 'lucide-react';

export const LeftNav: React.FC = () => {
  return (
    <div className="glass-panel" style={{
      width: '60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
      gap: '32px',
      borderRadius: '12px',
      zIndex: 10
    }}>
      {/* Top logo dot */}
      <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TerminalSquare size={14} color="#000" />
      </div>
      
      {/* Nav Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <NavIcon icon={<Code />} active />
        <NavIcon icon={<GitBranch />} />
        <NavIcon icon={<ShieldAlert />} />
        <NavIcon icon={<FileText />} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <NavIcon icon={<Settings />} />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) => (
  <div style={{
    color: active ? 'var(--cyan)' : 'var(--muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    filter: active ? 'drop-shadow(0 0 8px var(--cyan))' : 'none'
  }}>
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
  </div>
);
