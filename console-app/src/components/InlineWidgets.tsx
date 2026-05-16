import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Code, Download, FileText, ArrowRight } from 'lucide-react';

interface InlineWidgetsProps {
  type: 'projects' | 'experience' | 'skills' | 'blog' | 'resume' | 'contact';
}

type ProjectCardModel = {
  id: string;
  title: string;
  oneliner: string;
  github: string;
  blog?: string;
  color: string;
  tags: string[];
  metrics: string[];
  facts: string[];
  flow: string;
};

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
      {type === 'contact' && <ContactWidget />}
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
      metrics: ['125,547 rows/sec', '100% drift accuracy', '599MB peak memory'],
      facts: [
        'Throughput: 125,547 rows/sec (chunked 2GB CSV support)',
        'Drift detection: 100% accuracy at ≥1σ shift (KS test, PSI)',
        'Go CLI for speed + single binary distribution',
        'Python engine for rich pandas/statistical validation',
        '17 validator types including schema, statistical, and drift',
        'AI layer: GPT-4 explains validation failures in plain English',
        'CI-ready: --fail-fast flag, JSON output mode',
        'Published to PyPI: pip install sagescan-data'
      ],
      flow: 'YAML Config → Go CLI (Cobra) → JSON Bridge (stdin/stdout) → Python Engine (Pandas) → Validator Registry → CLI Report'
    },
    {
      id: 'oi',
      title: 'Operational-Intelligence-Engine 🚀',
      oneliner: 'Agentic AI assistant for Incident Response & SRE workflows. Uses CrewAI, RAG (pgvector), and Google Gemini to automate log analysis and RCA.',
      github: 'https://github.com/abhishek09827/Operational-Intelligence-Engine',
      color: 'var(--purple)',
      tags: ['Python', 'CrewAI', 'FastAPI', 'Google Gemini', 'pgvector', 'PostgreSQL', 'Redis', 'Prometheus', 'Docker'],
      metrics: ['Kafka throughput', 'Z-score rate', '60% noise reduction', '<5s e2e latency'],
      facts: [
        'Automated Incident Analysis: Intelligently parses messy, unstructured logs for anomaly detection.',
        'Agentic RCA: Multi-agent collaboration via CrewAI to pinpoint exact source of failures.',
        'RAG-Powered: Semantic search across historical incidents using pgvector embeddings.',
        'Smart Remediation: Suggests actionable fixes based on historical data and SRE best practices.',
        'Observability: Built-in Prometheus instrumentation for real-time API monitoring.',
        'Architecture: Microservices-based Dockerized environment separating API, AI, and storage.'
      ],
      flow: 'Unstructured Logs → Kafka → Z-score Filter → CrewAI Multi-Agent RCA → pgvector RAG Lookup → Remediation Plan'
    },
    {
      id: 'querymind',
      title: 'QueryMind-DW',
      oneliner: 'NL-to-SQL engine with RAG — ask questions in plain English, get validated SQL + results from your data warehouse.',
      github: 'https://github.com/abhishek09827/QueryMind-DW',
      color: 'var(--green)',
      tags: ['Python', 'GPT-4', 'RAG', 'LangChain', 'Postgres', 'Redis', 'FastAPI', 'Pinecone'],
      metrics: ['75% SQL accuracy', '1.0ms cache latency', '35% cost reduction'],
      facts: [
        'NL-to-SQL accuracy: 75% on complex window/agg benchmarks',
        'Cache hit latency: 1.0ms (vs 14.9s on LLM miss)',
        'Safety layer: Blocks 100% of DROP/DELETE/TRUNCATE attempts',
        'RAG over fine-tuning: dynamic schema context retrieval',
        'SQL Validator: prevents halluincated schemas before execution',
        'Redis cache cut LLM API costs ~35% on repeat queries'
      ],
      flow: 'User Query → RAG Schema Retriever (Pinecone) → GPT-4 → SQL Safety Validator → Postgres → Redis Cache'
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

const ProjectCard = ({ project }: { project: ProjectCardModel }) => {
  const [expanded, setExpanded] = useState(false);
  const color = project.color;

  return (
    <div style={{ border: `1px solid ${color}40`, borderRadius: '8px', background: `linear-gradient(135deg, ${color}05, transparent)`, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color, fontWeight: 'bold', fontSize: '15px' }}>{project.title}</div>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginTop: '4px', lineHeight: '1.4', maxWidth: '650px' }}>{project.oneliner}</div>
          </div>
          <div style={{ color: 'var(--dim)' }}>{expanded ? '▼' : '▶'}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {project.metrics.map((m: string) => (
            <span key={m} style={{ background: `${color}25`, color, padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${color}50`, boxShadow: `0 0 10px ${color}15` }}>{m}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', opacity: 0.7 }}>
          {project.tags.slice(0, 5).map((t: string) => (
            <span key={t} style={{ color, fontSize: '10px' }}>#{t}</span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${color}20` }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--terminal-bg)' }}>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                  <Code size={12} /> View on GitHub
                </a>
                {project.blog && (
                  <a href={project.blog} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                    <FileText size={12} /> Read Blog Post
                  </a>
                )}
              </div>

              <div>
                <div style={{ color: 'var(--dim)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>ARCHITECTURE_FLOW</div>
                <div style={{ color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--font)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: `2px solid ${color}` }}>
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
    <div style={{ color, fontSize: '10px', background: `${color}15`, padding: '2px 6px', borderRadius: '4px' }}>{tag}</div>
  </div>
);

const ExperienceWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '8px' }}>
    <div style={{ position: 'absolute', left: '19px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
    <TimelineItem
      year="Aug 2025 – Present"
      role="Cloud Developer I @ Hewlett Packard Enterprise"
      desc="Kafka topology optimization, PySpark distributed transforms, PII masking at ingestion boundary, ArgoCD + GitHub Actions CI/CD, GraphQL APIs, Avro/Protobuf schema evolution on Kubernetes."
    />
    <TimelineItem
      year="Feb 2025 – Aug 2025"
      role="SDE Intern @ Hewlett Packard Enterprise"
      desc="AWS Glue + Lambda ETL pipelines, PySpark data quality validation, SageMaker ML telemetry proof-of-concept, structured logging and monitoring enhancements."
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div>
      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <FileText size={16} /> RECENT_ARTICLES @ Hashnode
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a 
          href="https://ab-blog.hashnode.dev/i-built-a-cli-data-quality-tool-that-goes-beyond-schema-checks-here-s-what-i-learned" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'block', padding: '12px', background: 'rgba(0,212,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}
        >
          <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold' }}>I built a CLI data quality tool that goes beyond schema checks</div>
          <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '4px' }}>Deep dive into SageScan: statistical validation, drift detection, and AI-powered failure analysis.</div>
        </a>
        <a 
          href="https://ab-blog.hashnode.dev/architecting-production-rag-pipelines" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'block', padding: '12px', background: 'rgba(176,106,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--purple)' }}
        >
          <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold' }}>Architecting Production RAG Pipelines</div>
          <div style={{ color: 'var(--dim)', fontSize: '12px', marginTop: '4px' }}>Exploring chunking strategies, vector DB scaling, and latency optimization.</div>
        </a>
      </div>
      <a 
        href="https://ab-blog.hashnode.dev/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: 'var(--cyan)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginTop: '12px' }}
      >
        View all on Hashnode <ArrowRight size={12} />
      </a>
    </div>

    <div>
      <div style={{ color: 'var(--magenta)', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <ArrowRight size={16} /> X_THREADS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a 
          href="https://x.com/Abhishe17129030/status/2037570059183513608?s=20" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(255,42,133,0.05)', border: '1px solid rgba(255,42,133,0.2)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Engineering Deep Dive: SageScan Design</span>
          <ArrowRight size={12} style={{ opacity: 0.5 }} />
        </a>
        <a 
          href="https://x.com/Abhishe17129030/status/2036149585459159065?s=20" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(255,42,133,0.05)', border: '1px solid rgba(255,42,133,0.2)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Data Quality in Modern Pipelines</span>
          <ArrowRight size={12} style={{ opacity: 0.5 }} />
        </a>
        <a 
          href="https://x.com/Abhishe17129030/status/2036144754535309421?s=20" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(255,42,133,0.05)', border: '1px solid rgba(255,42,133,0.2)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>AIOps & Log Intelligence Threads</span>
          <ArrowRight size={12} style={{ opacity: 0.5 }} />
        </a>
      </div>
    </div>
  </div>
);

const ResumeWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', background: 'linear-gradient(90deg, rgba(176,106,255,0.1), transparent)', borderRadius: '8px', border: '1px solid var(--purple)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
          <FileText size={20} />
        </div>
        <div>
          <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>Abhishek_Kaushik_Resume.pdf</div>
          <div style={{ color: 'var(--dim)', fontSize: '12px' }}>Use this as the quick one-page summary for recruiters.</div>
        </div>
      </div>
      <a 
        href="https://drive.google.com/file/d/1A--YWfsRC12TjlKe8NgsdBcTukiEdUhN/view?usp=sharing" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--purple)', color: '#000', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
      >
        <Download size={14} /> DOWNLOAD
      </a>
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <a href="https://github.com/abhishek09827" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}>
        GitHub
      </a>
      <a href="https://www.linkedin.com/in/abhishek-kaushik-0a6a16243/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(176,106,255,0.08)', border: '1px solid rgba(176,106,255,0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}>
        LinkedIn
      </a>
      <a href="mailto:abhishekk09827@gmail.com" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}>
        Contact
      </a>
    </div>
  </div>
);

const ContactWidget = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ArrowRight size={16} /> QUICK_CONTACT
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <a href="https://github.com/abhishek09827" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
        GitHub
      </a>
      <a href="https://www.linkedin.com/in/abhishek-kaushik-0a6a16243/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(176,106,255,0.08)', border: '1px solid rgba(176,106,255,0.2)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
        LinkedIn
      </a>
      <a href="mailto:abhishekk09827@gmail.com" style={{ textDecoration: 'none', color: 'var(--text)', background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
        Email
      </a>
    </div>
    <div style={{ color: 'var(--dim)', fontSize: '12px', lineHeight: '1.6' }}>
      If you want the PDF resume, the fastest path is to ask for it directly through email.
    </div>
  </div>
);
