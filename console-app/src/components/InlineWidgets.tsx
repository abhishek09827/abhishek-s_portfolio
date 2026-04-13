import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Download, FileText, ArrowRight } from 'lucide-react';

interface InlineWidgetsProps {
  type: 'projects' | 'experience' | 'skills' | 'blog' | 'resume';
}

export const InlineWidgets: React.FC<InlineWidgetsProps> = ({ type }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ margin: '16px 0', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}
    >
      {type === 'projects' && <ProjectsWidget />}
      {type === 'experience' && <ExperienceWidget />}
      {type === 'skills' && <SkillsWidget />}
      {type === 'blog' && <BlogWidget />}
      {type === 'resume' && <ResumeWidget />}
    </motion.div>
  );
};

const ProjectsWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Code size={16} /> FEATURED_REPOSITORIES
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
      <ProjectCard 
        title="QueryMind-DW" 
        desc="NL-to-SQL engine powered by RAG + LLMs. Converts English queries to optimized SQL."
        tags={['Python', 'RAG', 'LLMs']}
        color="var(--cyan)"
      />
      <ProjectCard 
        title="Operational-Intelligence-Engine" 
        desc="LLM-powered infrastructure automation platform. Ingests logs and detects anomalies."
        tags={['Python', 'Automation', 'Kafka']}
        color="var(--purple)"
      />
      <ProjectCard 
        title="SageScan" 
        desc="Data quality validation tool built with Python. Validates data pipelines at scale."
        tags={['Python', 'Data Engineering']}
        color="var(--green)"
      />
    </div>

    <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>OTHER REPOSITORIES</div>
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <CompactTile title="sura-revamped" tag="TypeScript" color="var(--amber)" />
      <CompactTile title="BhoomiLog" tag="TypeScript" color="var(--magenta)" />
    </div>
  </div>
);

const ProjectCard = ({ title, desc, tags, color }: { title: string, desc: string, tags: string[], color: string }) => (
  <div style={{ border: `1px solid ${color}40`, padding: '16px', borderRadius: '8px', background: `linear-gradient(135deg, ${color}05, transparent)` }}>
    <div style={{ color, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>{title}</div>
    <div style={{ color: 'var(--dim)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.5' }}>{desc}</div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tags.map(t => (
        <span key={t} style={{ background: `${color}15`, color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{t}</span>
      ))}
    </div>
  </div>
);

const CompactTile = ({ title, tag, color }: { title: string, tag: string, color: string }) => (
  <div style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>{title}</div>
    <div style={{ color, fontSize: '10px', background: `${color}15`, padding: '2px 6px', borderRadius: '4px' }}>{tag}</div>
  </div>
);

const ExperienceWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '8px' }}>
    <div style={{ position: 'absolute', left: '19px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
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
    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--terminal-bg)', border: '2px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Briefcase size={12} color="var(--cyan)" />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: 'var(--cyan)', fontSize: '12px', marginBottom: '4px' }}>[{year}]</div>
      <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{role}</div>
      <div style={{ color: 'var(--dim)', fontSize: '12px', lineHeight: '1.5' }}>{desc}</div>
    </div>
  </div>
);

const SkillsWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <SkillGroup title="Data Engineering" skills={[{ name: 'Kafka', pct: 92 }, { name: 'Spark', pct: 88 }, { name: 'Airflow', pct: 85 }]} color="var(--cyan)" />
    <SkillGroup title="AI Systems" skills={[{ name: 'LLMs', pct: 90 }, { name: 'RAG', pct: 88 }, { name: 'LangGraph', pct: 80 }]} color="var(--purple)" />
    <SkillGroup title="Backend Cloud" skills={[{ name: 'Python/FastAPI', pct: 95 }, { name: 'Go', pct: 78 }, { name: 'AWS/K8s', pct: 85 }]} color="var(--magenta)" />
  </div>
);

const SkillGroup = ({ title, skills, color }: { title: string, skills: { name: string, pct: number }[], color: string }) => (
  <div>
    <div style={{ color, fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Code size={14} /> {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {skills.map((s, i) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '100px', fontSize: '12px', color: 'var(--text)' }}>{s.name}</div>
          <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${s.pct}%` }} 
              transition={{ duration: 1, delay: i * 0.1 }}
              style={{ height: '100%', background: color, boxShadow: `0 0 8px ${color}` }} 
            />
          </div>
          <div style={{ width: '30px', fontSize: '10px', color: 'var(--muted)', textAlign: 'right' }}>{s.pct}%</div>
        </div>
      ))}
    </div>
  </div>
);

const BlogWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <FileText size={16} /> RECENT_ARTICLES @ Hashnode
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ padding: '12px', background: 'rgba(0,212,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--cyan)', cursor: 'pointer' }}>
        <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold' }}>Architecting Production RAG Pipelines</div>
        <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '4px' }}>Exploring chunking strategies, vector DB scaling, and latency optimization.</div>
      </div>
      <div style={{ padding: '12px', background: 'rgba(176,106,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--purple)', cursor: 'pointer' }}>
        <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold' }}>Real-time streaming with Kafka and Airflow</div>
        <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '4px' }}>How to bridge the gap between streaming and batch processing reliably.</div>
      </div>
    </div>
    <div style={{ color: 'var(--cyan)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginTop: '8px' }}>
      View all on Hashnode <ArrowRight size={12} />
    </div>
  </div>
);

const ResumeWidget = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'linear-gradient(90deg, rgba(176,106,255,0.1), transparent)', borderRadius: '8px', border: '1px solid var(--purple)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
        <FileText size={20} />
      </div>
      <div>
        <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>Abhishek_Kaushik_Resume.pdf</div>
        <div style={{ color: 'var(--dim)', fontSize: '12px' }}>124 KB · Updated recently</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--purple)', color: '#000', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
      <Download size={14} /> DOWNLOAD
    </div>
  </div>
);
