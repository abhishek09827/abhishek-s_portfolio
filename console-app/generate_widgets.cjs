const fs = require('fs');

const inlineWidgetsContent = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Code, Download, FileText, ArrowRight, Github } from 'lucide-react';

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

const ProjectsWidget = () => {
  const projects = [
    {
      id: 'sagescan',
      title: 'SageScan',
      oneliner: 'Production-grade CLI data quality validator for modern pipelines. Go CLI + Python statistical engine, published to PyPI.',
      github: 'https://github.com/abhishek09827/SageScan',
      blog: 'https://ab-blog.hashnode.dev/i-built-a-cli-data-quality-tool-that-goes-beyond-schema-checks-here-s-what-i-learned',
      color: 'var(--cyan)',
      tags: ['Go', 'Python', 'Cobra', 'Pandas', 'Pydantic v2', 'GPT-4', 'PyPI', 'YAML', 'CLI'],
      facts: [
        'Go CLI for speed + single binary distribution',
        'Python engine for rich pandas/statistical validation',
        '17 validator types including drift detection (KS test, PSI)',
        'AI layer: GPT-4 auto-generates YAML rules from raw CSV',
        'AI explains validation failures in plain English',
        'Big-data: chunked reads up to 2GB CSV, Parquet support',
        'CI-ready: --fail-fast flag, JSON output mode',
        'Published to PyPI: pip install sagescan-data',
        'PII never leaves machine — only column stats sent to LLM'
      ],
      flow: 'User YAML → Go CLI (Cobra) → JSON Bridge → Python Engine (Pandas) → Validator Registry (17 types) → Output Report'
    },
    {
      id: 'oi',
      title: 'Operational-Intelligence-Engine',
      oneliner: 'LLM-powered AIOps platform — detects anomalies in infra logs, auto-creates JIRA tickets with root cause + suggested fix.',
      github: 'https://github.com/abhishek09827/Operational-Intelligence-Engine',
      color: 'var(--purple)',
      tags: ['Python', 'Kafka', 'PySpark', 'Mistral 7B', 'LangChain', 'JIRA API', 'Redis'],
      facts: [
        'Two-stage detection: statistical fast path + LLM deep analysis',
        'Filters ~90% of noise cheaply before calling LLM',
        'Confidence threshold reduces false positive pages by ~60%',
        'Mistral 7B chosen: self-hostable, no data leaves network',
        'Feedback loop: resolved incidents become future few-shot examples',
        'Mean time from anomaly to JIRA ticket: under 5 seconds'
      ],
      flow: 'Kafka Logs → Spark Structured Streaming → Z-score baseline filter → Mistral 7B → Confidence evaluation → JIRA API'
    },
    {
      id: 'querymind',
      title: 'QueryMind-DW',
      oneliner: 'NL-to-SQL engine with RAG — ask questions in plain English, get validated SQL + results from your data warehouse.',
      github: 'https://github.com/abhishek09827/QueryMind-DW',
      color: 'var(--green)',
      tags: ['Python', 'GPT-4', 'RAG', 'LangChain', 'Postgres', 'Redis', 'FastAPI', 'Pinecone'],
      facts: [
        'RAG over fine-tuning: schema changes weekly, RAG always fresh',
        'SQL Validator prevents hallucinated column names reaching Postgres',
        'Safety layer blocks destructive SQL before execution',
        'Redis cache cut LLM API costs ~35% on repeated queries',
        '~87% SQL accuracy on benchmark set',
        'p95 latency: 1.2s end-to-end'
      ],
      flow: 'User Query → Classifier → Schema Retriever (Pinecone) → Prompt Builder → GPT-4 → SQL Validator → Postgres → Redis Cache'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Code size={16} /> FLAGSHIP_PROJECTS
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>

      <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <span>OTHER REPOSITORIES</span>
        <span>OPEN SOURCE CONTRIBUTIONS</span>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <CompactTile title="sura-revamped" tag="TypeScript" color="var(--amber)" />
          <CompactTile title="BhoomiLog" tag="TypeScript" color="var(--magenta)" />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <CompactTile title="dbt-core" tag="OSS" color="var(--red)" />
          <CompactTile title="LlamaIndex" tag="OSS" color="var(--cyan)" />
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: any }) => {
  const [expanded, setExpanded] = useState(false);
  const color = project.color;

  return (
    <div style={{ border: \`1px solid \${color}40\`, borderRadius: '8px', background: \`linear-gradient(135deg, \${color}05, transparent)\`, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color, fontWeight: 'bold', fontSize: '15px' }}>{project.title}</div>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginTop: '4px', lineHeight: '1.4', maxWidth: '650px' }}>{project.oneliner}</div>
          </div>
          <div style={{ color: 'var(--dim)' }}>{expanded ? '▼' : '▶'}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {project.tags.map((t: string) => (
            <span key={t} style={{ background: \`\${color}15\`, color, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', border: \`1px solid \${color}30\` }}>{t}</span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: \`1px solid \${color}20\` }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--terminal-bg)' }}>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                  <Github size={12} /> View on GitHub
                </a>
                {project.blog && (
                  <a href={project.blog} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                    <FileText size={12} /> Read Blog Post
                  </a>
                )}
              </div>

              <div>
                <div style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>ARCHITECTURE_FLOW</div>
                <div style={{ color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: \`2px solid \${color}\` }}>
                  {project.flow}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>KEY_FACTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {project.facts.map((fact: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text)' }}>
                      <span style={{ color }}>✦</span> {fact}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompactTile = ({ title, tag, color }: { title: string, tag: string, color: string }) => (
  <div style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>{title}</div>
    <div style={{ color, fontSize: '10px', background: \`\${color}15\`, padding: '2px 6px', borderRadius: '4px' }}>{tag}</div>
  </div>
);

const ExperienceWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '8px' }}>
    <div style={{ position: 'absolute', left: '19px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
    <TimelineItem 
      year="2025-present" 
      role="Cloud Developer @ Hewlett Packard Enterprise (HPE)" 
      desc="Cloud-native distributed backend services, Node.js/Python/AWS, PII masking ingestion pipelines, CI/CD automation, GenAI integration inside enterprise workflows."
    />
    <TimelineItem 
      year="2024" 
      role="Built QueryMind-DW prototype independently" 
      desc="NL-to-SQL with RAG, validation layers, LLM-backed APIs."
    />
    <TimelineItem 
      year="2023" 
      role="Open Source Contributor" 
      desc="dbt-core & LlamaIndex — PRs merged, architecture improvements."
    />
    <TimelineItem 
      year="2021-2025" 
      role="B.E. @ Ramaiah Institute of Technology, Bengaluru" 
      desc="Computer Science — graduated 2025."
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
              animate={{ width: \`\${s.pct}%\` }} 
              transition={{ duration: 1, delay: i * 0.1 }}
              style={{ height: '100%', background: color, boxShadow: \`0 0 8px \${color}\` }} 
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
`;

fs.writeFileSync('src/components/InlineWidgets.tsx', inlineWidgetsContent);
