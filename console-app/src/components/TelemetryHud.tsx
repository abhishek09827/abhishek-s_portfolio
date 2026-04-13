import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Database, Network } from 'lucide-react';

export const TelemetryHud: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpu: 42,
    mem: 32,
    net: 1.2,
    latency: 14
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 10 - 5))),
        mem: Math.max(20, Math.min(90, prev.mem + (Math.random() * 2 - 1))),
        net: Math.max(0.5, Math.min(5.0, prev.net + (Math.random() * 0.4 - 0.2))),
        latency: Math.max(2, Math.min(50, prev.latency + (Math.random() * 4 - 2)))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      padding: '8px 24px',
      borderRadius: '8px',
      position: 'relative',
      zIndex: 10,
      width: 'fit-content',
      margin: '0 auto',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)' }}>
        <Cpu size={14} />
        <span>CPU: {metrics.cpu.toFixed(1)}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple)' }}>
        <Database size={14} />
        <span>MEM: {metrics.mem.toFixed(1)}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)' }}>
        <Network size={14} />
        <span>NET: {metrics.net.toFixed(2)} Gbps</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--yellow)' }}>
        <Activity size={14} />
        <span>LAT: {metrics.latency.toFixed(0)} ms</span>
      </div>
    </div>
  );
};
