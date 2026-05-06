import { useState, useEffect } from 'react';
import { BackgroundLogs } from './components/BackgroundLogs';
import { TelemetryHud } from './components/TelemetryHud';
import { Terminal } from './components/Terminal';
import { AIAgent } from './components/AIAgent';
import { LeftNav } from './components/LeftNav';
import type { TabId } from './components/LeftNav';
import { CommandPalette } from './components/CommandPalette';
import { GraphView, RadarView, ActivityView } from './components/DataViews';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('core');
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [forceCommand, setForceCommand] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        setPaletteVisible(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'core': return <Terminal forceCommand={forceCommand} />;
      case 'graph': return <GraphView />;
      case 'radar': return <RadarView />;
      case 'activity': return <ActivityView />;
      default: return <Terminal forceCommand={forceCommand} />;
    }
  };

  return (
    <div className="app-container">
      <BackgroundLogs />
      
      <TelemetryHud />

      <div className="main-content" style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0, overflow: 'visible' }}>
        <LeftNav activeTab={activeTab} onTabSelect={setActiveTab} />
        {renderMainContent()}
        <AIAgent activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <CommandPalette 
        isVisible={paletteVisible} 
        onClose={() => setPaletteVisible(false)} 
        onSelectCommand={(cmd) => setForceCommand(cmd)}
      />
    </div>
  );
}

export default App;
