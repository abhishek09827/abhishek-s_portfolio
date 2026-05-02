import React from 'react';
import { TerminalSquare, GitBranch, Settings, Code, Activity, Radar, Database } from 'lucide-react';

export type TabId = 'core' | 'graph' | 'matrix' | 'radar' | 'activity';

interface LeftNavProps {
  activeTab: TabId;
  onTabSelect: (tab: TabId) => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({ activeTab, onTabSelect }) => {
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
        <NavIcon icon={<Code />} active={activeTab === 'core'} onClick={() => onTabSelect('core')} tooltip="CORE" />
        <NavIcon icon={<GitBranch />} active={activeTab === 'graph'} onClick={() => onTabSelect('graph')} tooltip="GRAPH" />
        <NavIcon icon={<Database />} active={activeTab === 'matrix'} onClick={() => onTabSelect('matrix')} tooltip="MATRIX" />
        <NavIcon icon={<Radar />} active={activeTab === 'radar'} onClick={() => onTabSelect('radar')} tooltip="RADAR" />
        <NavIcon icon={<Activity />} active={activeTab === 'activity'} onClick={() => onTabSelect('activity')} tooltip="ACTIVITY" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <NavIcon icon={<Settings />} />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, active = false, onClick, tooltip }: { icon: React.ReactNode, active?: boolean, onClick?: () => void, tooltip?: string }) => (
  <div 
    onClick={onClick}
    title={tooltip}
    style={{
      color: active ? 'var(--cyan)' : 'var(--muted)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      filter: active ? 'drop-shadow(0 0 8px var(--cyan))' : 'none',
      transform: active ? 'scale(1.1)' : 'scale(1)'
    }}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
  </div>
);
