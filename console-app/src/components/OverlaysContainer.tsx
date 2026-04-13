import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Code } from 'lucide-react';

interface OverlaysContainerProps {
  activeOverlay: string | null;
  onClose: () => void;
}

export const OverlaysContainer: React.FC<OverlaysContainerProps> = ({ activeOverlay, onClose }) => {
  return (
    <AnimatePresence>
      {activeOverlay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(90%, 600px)',
            maxHeight: '80vh',
            padding: '24px',
            borderRadius: '16px',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              // {activeOverlay}_MODULE
            </div>
            <X size={18} className="text-dim" style={{ cursor: 'pointer' }} onClick={onClose} />
          </div>

          <div style={{ flex: 1 }}>
            {activeOverlay === 'projects' && <ProjectsOverlay />}
            {activeOverlay === 'experience' && <ExperienceOverlay />}
            {activeOverlay === 'skills' && <SkillsOverlay />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectsOverlay = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <ProjectCard 
      title="QueryMind" 
      desc="NL-to-SQL engine powered by RAG + LLMs. Converts English queries to optimized SQL for Postgres."
      tags={['LangChain', 'GPT-4', 'FastAPI', 'Pinecone']}
      color="var(--green)"
    />
    <ProjectCard 
      title="AIOps Engine" 
      desc="LLM-powered infrastructure automation platform. Ingests Kafka logs and detects anomalies."
      tags={['Kafka', 'Mistral 7B', 'Go', 'K8s']}
      color="var(--purple)"
    />
  </div>
);

const ProjectCard = ({ title, desc, tags, color }: { title: string, desc: string, tags: string[], color: string }) => (
  <div style={{ border: `1px solid ${color}40`, padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
    <div style={{ color, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>{title}</div>
    <div style={{ color: 'var(--dim)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.5' }}>{desc}</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tags.map(t => (
        <span key={t} style={{ background: `${color}15`, color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{t}</span>
      ))}
    </div>
  </div>
);

const ExperienceOverlay = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
    <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
    <TimelineItem 
      year="2025-Present" 
      role="Cloud Developer @ HPE" 
      desc="Building real-time Kafka streaming pipelines. Orchestrating ETL workflows with Airflow. Integrating LLM anomaly detection."
    />
    <TimelineItem 
      year="2024" 
      role="Data Engineering Intern @ AI Startup" 
      desc="Built NL-to-SQL prototype (QueryMind). Implemented vector-based document retrieval. Deployed microservices on K8s."
    />
  </div>
);

const TimelineItem = ({ year, role, desc }: { year: string, role: string, desc: string }) => (
  <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--terminal-bg)', border: '2px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Briefcase size={12} color="var(--cyan)" />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: 'var(--cyan)', fontSize: '12px', marginBottom: '4px' }}>[{year}]</div>
      <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{role}</div>
      <div style={{ color: 'var(--dim)', fontSize: '12px', lineHeight: '1.5' }}>{desc}</div>
    </div>
  </div>
);

const SkillsOverlay = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <SkillGroup title="Data Engineering" skills={[{ name: 'Kafka', pct: 92 }, { name: 'Spark', pct: 88 }, { name: 'Airflow', pct: 85 }]} color="var(--green)" />
    <SkillGroup title="AI Systems" skills={[{ name: 'LLMs', pct: 90 }, { name: 'RAG', pct: 88 }, { name: 'LangGraph', pct: 80 }]} color="var(--purple)" />
    <SkillGroup title="Backend Cloud" skills={[{ name: 'Python/FastAPI', pct: 95 }, { name: 'Go', pct: 78 }, { name: 'AWS/K8s', pct: 85 }]} color="var(--cyan)" />
  </div>
);

const SkillGroup = ({ title, skills, color }: { title: string, skills: { name: string, pct: number }[], color: string }) => (
  <div>
    <div style={{ color, fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Code size={14} /> {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {skills.map(s => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '100px', fontSize: '12px', color: 'var(--dim)' }}>{s.name}</div>
          <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${s.pct}%` }} 
              transition={{ duration: 1, delay: 0.2 }}
              style={{ height: '100%', background: color, boxShadow: `0 0 8px ${color}` }} 
            />
          </div>
          <div style={{ width: '30px', fontSize: '10px', color: 'var(--muted)', textAlign: 'right' }}>{s.pct}%</div>
        </div>
      ))}
    </div>
  </div>
);
