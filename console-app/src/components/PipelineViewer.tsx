import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, HardDrive, X } from 'lucide-react';

interface PipelineViewerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PipelineViewer: React.FC<PipelineViewerProps> = ({ isVisible, onClose }) => {
  const [metrics, setMetrics] = useState({
    ingest: 50230,
    latency: 2.4,
    storage: 4.2
  });

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ingest: Math.floor(prev.ingest + (Math.random() * 2000 - 1000)),
        latency: Math.max(1.0, prev.latency + (Math.random() * 0.4 - 0.2)),
        storage: prev.storage + 0.01
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(90%, 800px)',
            padding: '24px',
            borderRadius: '16px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              // DATA_PIPELINE_VIEWER
            </div>
            <X 
              size={18} 
              className="text-dim" 
              style={{ cursor: 'pointer' }} 
              onClick={onClose} 
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            padding: '0 20px'
          }}>
            {/* Animated Connection Lines */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '40px',
              right: '40px',
              height: '2px',
              background: 'var(--border)',
              zIndex: 0
            }}>
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--cyan)',
                  boxShadow: '0 0 10px var(--cyan)'
                }}
              />
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--purple)',
                  boxShadow: '0 0 10px var(--purple)'
                }}
              />
            </div>

            {/* Nodes */}
            <Node 
              icon={<Database size={24} />} 
              title="Kafka Ingest" 
              metric={`${metrics.ingest.toLocaleString()} msg/s`}
              color="var(--cyan)"
            />
            <Node 
              icon={<Server size={24} />} 
              title="Spark Stream" 
              metric={`${metrics.latency.toFixed(1)}ms p99`}
              color="var(--purple)"
            />
            <Node 
              icon={<HardDrive size={24} />} 
              title="S3 Datalake" 
              metric={`${metrics.storage.toFixed(2)} TB written`}
              color="var(--green)"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Node = ({ icon, title, metric, color }: { icon: React.ReactNode, title: string, metric: string, color: string }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '12px',
    background: 'var(--terminal-bg)',
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${color}40`,
    zIndex: 1,
    boxShadow: `0 0 20px ${color}15`
  }}>
    <div style={{ color }}>{icon}</div>
    <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>{title}</div>
    <div style={{ color: 'var(--dim)', fontSize: '11px' }}>{metric}</div>
  </div>
);
