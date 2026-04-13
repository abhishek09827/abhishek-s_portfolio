import React, { useEffect, useState, useRef } from 'react';

const SYSTEM_LOGS = [
  '[SYS] Checking CPU thermals... OK',
  '[NET] Synchronizing time with ntp.ubuntu.com',
  '[KAFKA] Rebalancing consumer group: ai-events-group',
  '[SPARK] Checkpointing stream state to s3://datalake/checkpoints',
  '[AUTH] Validating Kerberos ticket... Success',
  '[DB] Vacuuming pg_catalog... Done',
  '[K8S] Scaling deployment model-inference to 4 replicas',
  '[SYS] Garbage collection cycle completed in 42ms',
  '[MEM] Reclaiming 1.2GB from page cache',
  '[AIRFLOW] DAG telemetry_sync triggered successfully',
  '[VECTOR] Updating pinecone index embeddings...',
  '[SYS] Heartbeat signal sent.',
];

export const BackgroundLogs: React.FC = () => {
  const [logs, setLogs] = useState<{ id: number; text: string; y: number; opacity: number }[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const text = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
        const y = Math.random() * 100; // % from top
        idCounter.current += 1;
        
        setLogs(prev => {
          const newLogs = [...prev, { id: idCounter.current, text, y, opacity: 0.8 }];
          if (newLogs.length > 20) newLogs.shift();
          return newLogs;
        });

        // Fade out
        setTimeout(() => {
          setLogs(prev => prev.map(log => log.id === idCounter.current ? { ...log, opacity: 0 } : log));
        }, 1500 + Math.random() * 2000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {logs.map(log => (
        <div
          key={log.id}
          style={{
            position: 'absolute',
            top: `${log.y}%`,
            left: '2%',
            color: 'var(--green)',
            opacity: log.opacity * 0.05,
            fontFamily: 'var(--font)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            transition: 'opacity 2s ease-out',
            transform: 'translateY(-50%)'
          }}
        >
          {log.text}
        </div>
      ))}
    </div>
  );
};
