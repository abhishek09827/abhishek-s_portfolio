import { useState, useEffect } from 'react';
import { BackgroundLogs } from './components/BackgroundLogs';
import { TelemetryHud } from './components/TelemetryHud';
import { Terminal } from './components/Terminal';
import { AIAgent } from './components/AIAgent';
import { LeftNav } from './components/LeftNav';
import { CommandPalette } from './components/CommandPalette';
import './index.css';

function App() {
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

  return (
    <div className="app-container">
      <BackgroundLogs />
      
      <TelemetryHud />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
        <LeftNav />
        <Terminal forceCommand={forceCommand} />
        <AIAgent />
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
