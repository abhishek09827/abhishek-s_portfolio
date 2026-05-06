const fs = require('fs');

const htmlContent = fs.readFileSync('../architectures.html', 'utf8');

function extractSvg(id) {
    const startRegex = new RegExp(`<svg id="${id}"[^>]*>`, 'i');
    const startMatch = htmlContent.match(startRegex);
    if (!startMatch) return '';
    const startIdx = startMatch.index;
    const endIdx = htmlContent.indexOf('</svg>', startIdx) + 6;
    let svg = htmlContent.substring(startIdx, endIdx);
    
    // React attribute replacements
    svg = svg.replace(/class=/g, 'className=')
             .replace(/stroke-width=/g, 'strokeWidth=')
             .replace(/stroke-opacity=/g, 'strokeOpacity=')
             .replace(/stroke-dasharray=/g, 'strokeDasharray=')
             .replace(/stop-color=/g, 'stopColor=')
             .replace(/stop-opacity=/g, 'stopOpacity=')
             .replace(/text-anchor=/g, 'textAnchor=')
             .replace(/font-family=/g, 'fontFamily=')
             .replace(/font-size=/g, 'fontSize=')
             .replace(/font-weight=/g, 'fontWeight=')
             .replace(/marker-end=/g, 'markerEnd=')
             .replace(/markerWidth=/g, 'markerWidth=')
             .replace(/markerHeight=/g, 'markerHeight=')
             .replace(/refX=/g, 'refX=')
             .replace(/refY=/g, 'refY=')
             .replace(/repeatCount=/g, 'repeatCount=')
             .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
             .replace(/xml:space=/g, 'xmlSpace=');
             
    return svg;
}

const sagescanSvg = extractSvg('svg-sagescan');
const oieSvg = extractSvg('svg-oie');
const querymindSvg = extractSvg('svg-querymind');

const dataViewsContent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- GRAPH VIEW ---
export const GraphView: React.FC = () => {
  const [activeGraph, setActiveGraph] = useState<'sagescan' | 'oie' | 'querymind'>('sagescan');

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>ARCHITECTURE_FLOWS</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveGraph('sagescan')}
            style={{ background: activeGraph === 'sagescan' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'sagescan' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >SageScan</button>
          <button
            onClick={() => setActiveGraph('oie')}
            style={{ background: activeGraph === 'oie' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'oie' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >OI-Engine</button>
          <button
            onClick={() => setActiveGraph('querymind')}
            style={{ background: activeGraph === 'querymind' ? 'var(--cyan)' : 'transparent', color: activeGraph === 'querymind' ? '#000' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
          >QueryMind-DW</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGraph}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: '900px' }}
          >
            {activeGraph === 'sagescan' && (
              <div dangerouslySetInnerHTML={{ __html: \`${sagescanSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
            {activeGraph === 'oie' && (
              <div dangerouslySetInnerHTML={{ __html: \`${oieSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
            {activeGraph === 'querymind' && (
              <div dangerouslySetInnerHTML={{ __html: \`${querymindSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- DESIGN VIEW ---
export const DesignView: React.FC = () => {
  const cards = [
    {
      id: 'sagescan',
      title: 'SageScan',
      subtitle: 'Data pipelines fail silently. How do you catch bad data before it reaches production?',
      githubUrl: 'github.com/abhishek09827/SageScan',
      metrics: ['PyPI published', '17 validator types', '2GB file support'],
      decisions: [
        { q: "WHY Go CLI + Python engine instead of pure Python?", a: "Go gives instant startup, single binary, no virtualenv friction in CI. Python owns the statistical logic. JSON over stdin/stdout bridges them cleanly." },
        { q: "WHY 17 validator types including statistical checks?", a: "Schema checks alone miss the real failures — a column can be non-null and still have a drifted distribution. KS test and PSI catch what regex never could." },
        { q: "WHY publish AI as optional, not required?", a: "Core validation must be deterministic and offline-capable. AI is a productivity layer, not a dependency. No API key = still fully functional." },
        { q: "WHY send only column stats to LLM, not raw data?", a: "PII stays local. Only aggregates (mean, std, null %) go to GPT-4. Privacy-first by design." }
      ],
      tradeoffs: "Single binary vs rich ecosystem —\\nGo binary is fast but Python ecosystem (pandas, scipy) lives in a subprocess. Communication overhead: ~20ms per call.\\nDeterministic vs AI-generated rules —\\nAI rules are convenient but can be wrong. Always review before committing to version control.",
      whatIdDoDiff: "Add a Polars backend as opt-in. Pandas is 10-50x slower on large files. Already on the roadmap for v1.1."
    },
    {
      id: 'oi',
      title: 'OI-Engine',
      subtitle: 'How do you detect real anomalies in noisy infra logs without drowning on-call in false alerts?',
      githubUrl: 'github.com/abhishek09827/Operational-Intelligence-Engine',
      metrics: ['<5s to JIRA ticket', '~60% fewer false pages', 'Mistral 7B'],
      decisions: [
        { q: "WHY two-stage detection instead of LLM-only?", a: "LLMs are slow (~800ms) and expensive. Z-score runs in microseconds and filters ~90% of noise. Only genuine anomaly candidates reach the LLM." },
        { q: "WHY confidence threshold at 0.75 before paging?", a: "Alert fatigue is an engineering culture problem. A threshold dropped false positive pages by ~60%. Engineers trust alerts they receive." },
        { q: "WHY Mistral 7B over GPT-4?", a: "Self-hostable. No log data leaves the network. In an ops context, data residency matters. Mistral 7B performs well on classification tasks." },
        { q: "WHY feedback loop back to context store?", a: "Static models go stale. Every incident an engineer resolves becomes a future few-shot example. The system gets smarter with each production event." }
      ],
      tradeoffs: "30s windows vs sub-minute spikes —\\nTumbling windows miss anomalies shorter than the window. Sliding windows would catch more but cost 3x compute.\\nMistral 7B vs GPT-4 accuracy —\\nGPT-4 gives better root cause explanations. Mistral is faster and private. Chose privacy + speed.",
      whatIdDoDiff: "Add a graph correlation layer. Right now each service's logs are analyzed independently. Cascading failures across services would be caught much earlier with a dependency graph overlay."
    },
    {
      id: 'querymind',
      title: 'QueryMind-DW',
      subtitle: 'How do you let non-engineers query a data warehouse in plain English without hallucinated SQL breaking things?',
      githubUrl: 'github.com/abhishek09827/QueryMind-DW',
      metrics: ['~87% SQL accuracy', '~35% LLM cost reduction', 'p95 1.2s'],
      decisions: [
        { q: "WHY RAG over fine-tuning for schema context?", a: "Schemas change weekly. A fine-tuned model bakes in a snapshot of your schema and goes stale immediately. RAG always retrieves the current schema — zero retraining." },
        { q: "WHY a SQL Validator before execution?", a: "GPT-4 confidently generates SQL with columns that don't exist. The validator catches invalid references before they hit Postgres and return cryptic errors to users." },
        { q: "WHY a safety layer blocking DROP/DELETE/TRUNCATE?", a: "NL-to-SQL with write access is a foot-gun. Non-engineers shouldn't be able to accidentally truncate a table by asking the wrong question." },
        { q: "WHY Redis cache on top of the LLM?", a: "In testing, ~38% of queries were repeats. Cache hit = 0 LLM cost, ~5ms response. Cache miss = full RAG + GPT-4 = ~1.2s. Worth it." }
      ],
      tradeoffs: "Accuracy vs Latency —\\nSQL validator adds ~80ms per query but prevents silent failures that erode user trust.\\nCache freshness vs cost —\\nCached queries don't reflect schema changes mid-TTL. TTL must be tuned per schema update frequency.",
      whatIdDoDiff: "Add a query rewriter step before retrieval. Ambiguous user questions degrade retrieval quality. Rewriting to canonical form first would improve SQL accuracy from ~87% closer to ~93%."
    }
  ];

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>SYSTEM_DESIGN_DECISIONS</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards.map(card => (
          <DesignCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

const DesignCard = ({ card }: { card: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '16px' }}>{card.title}</div>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginTop: '4px', maxWidth: '600px' }}>{card.subtitle}</div>
          </div>
          <div style={{ color: 'var(--dim)' }}>{expanded ? '▼' : '▶'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {card.metrics.map((m: string) => (
            <span key={m} style={{ background: 'rgba(0, 212, 255, 0.1)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid rgba(0,212,255,0.2)' }}>
              {m}
            </span>
          ))}
          {card.githubUrl && (
            <a href={'https://' + card.githubUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
              {card.githubUrl}
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* KEY DECISIONS */}
              <div>
                <div style={{ color: 'var(--dim)', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>KEY DECISIONS I MADE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {card.decisions.map((d: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
                      <div style={{ color: 'var(--cyan)', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>▸ {d.q}</div>
                      <div style={{ color: 'var(--text)', fontSize: '13px', lineHeight: '1.5', paddingLeft: '14px', borderLeft: '2px solid var(--border)' }}>{d.a}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* WHAT I'D DO DIFF & TRADEOFFS */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', background: 'rgba(176,106,255,0.05)', borderLeft: '2px solid var(--purple)', padding: '12px' }}>
                  <div style={{ color: 'var(--purple)', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>WHAT I WOULD DO DIFFERENTLY</div>
                  <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: '1.4' }}>{card.whatIdDoDiff}</div>
                </div>
                <div style={{ flex: '1 1 300px', background: 'rgba(255,189,46,0.05)', borderLeft: '2px solid var(--amber)', padding: '12px' }}>
                  <div style={{ color: 'var(--amber)', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>TRADE-OFFS</div>
                  <div style={{ color: 'var(--text)', fontSize: '12px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{card.tradeoffs}</div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- RADAR VIEW (Skills Dashboard) ---
export const RadarView: React.FC = () => {
  const skills = {
    "Data Engineering": [
      { name: "Apache Kafka", level: 95, label: "Expert", evidence: "OI-Engine: 2M events/min ingestion" },
      { name: "Apache Airflow", level: 85, label: "Production", evidence: "Orchestrates ingestion DAGs" },
      { name: "dbt (Postgres)", level: 80, label: "Proficient", evidence: "ELT pipelines + OSS contributor" },
      { name: "PySpark", level: 80, label: "Proficient", evidence: "Windowed streaming in OI-Engine" }
    ],
    "AI / LLM Systems": [
      { name: "RAG Pipelines", level: 95, label: "Expert", evidence: "Core of QueryMind-DW" },
      { name: "LangChain", level: 85, label: "Production", evidence: "QueryMind-DW + OI-Engine" },
      { name: "LlamaIndex", level: 80, label: "Proficient", evidence: "OSS contributor" },
      { name: "Prompt Eng.", level: 95, label: "Expert", evidence: "SQL gen, anomaly classify, rule gen" },
      { name: "Vector DBs", level: 80, label: "Proficient", evidence: "Pinecone in QueryMind-DW" },
      { name: "Mistral 7B", level: 80, label: "Proficient", evidence: "Self-hosted in OI-Engine" }
    ],
    "Backend & Systems": [
      { name: "Python/FastAPI", level: 85, label: "Production", evidence: "QueryMind-DW, OI-Engine, SageScan" },
      { name: "Go", level: 80, label: "Proficient", evidence: "SageScan CLI — published to PyPI" },
      { name: "Node.js", level: 95, label: "Expert", evidence: "Primary backend language" },
      { name: "PostgreSQL", level: 95, label: "Expert", evidence: "QueryMind-DW executor + data store" },
      { name: "Redis", level: 80, label: "Proficient", evidence: "Query cache in QueryMind-DW" },
      { name: "Docker", level: 80, label: "Proficient", evidence: "All projects containerised" },
      { name: "AWS", level: 80, label: "Proficient", evidence: "S3, Lambda, EC2" }
    ]
  };

  const tags = [
    { text: "Python", size: 1.8 }, { text: "Node.js", size: 1.8 }, { text: "RAG", size: 1.8 }, { text: "Kafka", size: 1.8 }, { text: "LangChain", size: 1.8 },
    { text: "Go", size: 1.5 }, { text: "Airflow", size: 1.5 }, { text: "dbt", size: 1.5 }, { text: "PySpark", size: 1.5 }, { text: "GPT-4", size: 1.5 }, { text: "Postgres", size: 1.5 }, { text: "Redis", size: 1.5 },
    { text: "Docker", size: 1.2 }, { text: "AWS", size: 1.2 }, { text: "Mistral", size: 1.2 }, { text: "LlamaIndex", size: 1.2 }, { text: "Pinecone", size: 1.2 }, { text: "Pydantic", size: 1.2 }, { text: "FastAPI", size: 1.2 }
  ];

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>SKILLS_EVIDENCE_DASHBOARD</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN - SKILL BARS */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((skill, i) => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--cyan)' }}>{skill.name}</span>
                      <span style={{ color: 'var(--dim)' }}>{skill.label}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: \`\${skill.level}%\` }} 
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--purple))' }}
                      />
                    </div>
                    <div style={{ color: 'var(--dim)', fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>"{skill.evidence}"</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* TAG CLOUD */}
          <div>
            <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Tech Tag Cloud</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,212,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
              {tags.map((tag, i) => (
                <motion.span 
                  key={tag.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    color: \`rgba(0, 212, 255, \${0.5 + tag.size * 0.2})\`, 
                    fontSize: \`\${tag.size * 10}px\`,
                    filter: \`drop-shadow(0 0 \${tag.size * 2}px var(--cyan))\`,
                    lineHeight: '1'
                  }}
                >
                  {tag.text}
                </motion.span>
              ))}
            </div>
          </div>

          {/* OSS BADGES */}
          <div>
            <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Open Source Contributions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,255,157,0.2)' }}>
                <div style={{ color: 'var(--green)', filter: 'drop-shadow(0 0 5px var(--green))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>dbt-core contributor</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px' }}>data transformation engine</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(176,106,255,0.2)' }}>
                <div style={{ color: 'var(--purple)', filter: 'drop-shadow(0 0 5px var(--purple))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>LlamaIndex contributor</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px' }}>LLM orchestration framework</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div style={{ color: 'var(--cyan)', filter: 'drop-shadow(0 0 5px var(--cyan))' }}>◈</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>SageScan author</div>
                  <div style={{ color: 'var(--dim)', fontSize: '11px', fontFamily: 'var(--font)' }}>pip install sagescan-data</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- ACTIVITY VIEW ---
export const ActivityView: React.FC = () => {
  const [contributions, setContributions] = useState<number[][]>([]);
  const [weeklyTotals, setWeeklyTotals] = useState<number[]>([]);

  useEffect(() => {
    // Fetch heatmap
    fetch('https://github-contributions-api.jogruber.de/v4/abhishek09827')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.contributions) return;
        const allContributions = data.contributions;
        const recent = allContributions.slice(-364); 
        const weeks: number[][] = [];
        const totals: number[] = [];
        for (let i = 0; i < recent.length; i += 7) {
          const week = recent.slice(i, i + 7).map((c: any) => c.count);
          weeks.push(week);
          totals.push(week.reduce((a: number, b: number) => a + b, 0));
        }
        setContributions(weeks);
        setWeeklyTotals(totals);
      })
      .catch(console.error);
  }, []);

  const maxTotal = Math.max(...weeklyTotals, 1);

  // Highest weeks to label
  const sortedWeeks = [...weeklyTotals].map((val, idx) => ({val, idx})).sort((a,b) => b.val - a.val);
  const topWeeks = sortedWeeks.slice(0, 4);

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>COMMIT_ACTIVITY</span>
        <span style={{ color: 'var(--dim)', fontSize: '12px' }}>github.com/abhishek09827</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', overflowY: 'auto' }}>

        {/* SECTION 1: HEATMAP & SPARKLINE */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {contributions.length > 0 ? (
            <>
              {/* Sparkline Trend */}
              <div style={{ width: '100%', height: '80px', position: 'relative', marginBottom: '16px' }}>
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={\`0 0 \${weeklyTotals.length * 5} 40\`}>
                  <defs>
                    <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <motion.path
                    d={\`M 0 40 L 0 \${40 - (weeklyTotals[0] / maxTotal) * 36} \${weeklyTotals.map((t, i) => \`L \${i * 5} \${40 - (t / maxTotal) * 36}\`).join(' ')} L \${(weeklyTotals.length - 1) * 5} 40 Z\`}
                    fill="url(#sparkFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                  {/* Line */}
                  <motion.path
                    d={\`M 0 \${40 - (weeklyTotals[0] / maxTotal) * 36} \${weeklyTotals.map((t, i) => \`L \${i * 5} \${40 - (t / maxTotal) * 36}\`).join(' ')}\`}
                    fill="none"
                    stroke="var(--cyan)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>

                {/* Annotations */}
                <AnimatePresence>
                  {topWeeks.map((tw, i) => {
                    const labels = ["SageScan build sprint", "QueryMind-DW development", "OI-Engine development", "OSS contribution period"];
                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 1.5 + i * 0.2 }} 
                        style={{ 
                          position: 'absolute', 
                          top: 40 - (tw.val / maxTotal) * 36 - 20, 
                          left: \`\${(tw.idx / weeklyTotals.length) * 100}%\`, 
                          fontSize: '10px', 
                          color: i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)',
                          whiteSpace: 'nowrap',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.6)',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          border: \`1px solid \${i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)'}\`
                        }}
                      >
                        {labels[i]}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Heatmap Grid */}
              <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '8px' }}>
                {contributions.map((week, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {week.map((val, dIdx) => {
                      let color = '#0d0d0d';
                      if (val > 8) color = '#00ff9d';
                      else if (val > 4) color = '#00a86b';
                      else if (val > 0) color = '#0d3b2e';

                      return (
                        <div
                          key={dIdx}
                          style={{ width: '11px', height: '11px', borderRadius: '2px', background: color, border: '1px solid rgba(255,255,255,0.05)' }}
                          title={\`\${val} contributions\`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--cyan)' }}>Fetching GitHub Data...</div>
          )}
        </div>

        {/* SECTION 2: STATS ROW */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Repositories', val: 74, icon: '📁', color: 'var(--cyan)' },
            { label: 'Stars Earned', val: 18, icon: '⭐', color: 'var(--amber)' },
            { label: 'Followers', val: 7, icon: '👥', color: 'var(--purple)' },
            { label: 'PyPI Package', val: '1', icon: '📦', color: 'var(--green)' }
          ].map(stat => (
            <div key={stat.label} style={{ flex: '1 1 150px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px' }}>{stat.icon}</div>
              <div style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 'bold' }}>{stat.val}</div>
              <div style={{ color: stat.color, fontSize: '11px', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* SECTION 3: LANGUAGE BREAKDOWN */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--dim)', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px' }}>REPOSITORY LANGUAGE BREAKDOWN (MOCKED)</div>
          
          <div style={{ height: '12px', width: '100%', display: 'flex', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1 }} style={{ background: 'var(--cyan)' }} title="Python: 45%" />
            <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1, delay: 0.2 }} style={{ background: 'var(--purple)' }} title="TypeScript: 25%" />
            <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1, delay: 0.4 }} style={{ background: 'var(--green)' }} title="Go: 15%" />
            <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 0.6 }} style={{ background: 'var(--amber)' }} title="JavaScript: 10%" />
            <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} transition={{ duration: 1, delay: 0.8 }} style={{ background: 'var(--dim)' }} title="Other: 5%" />
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '12px' }}>
            <div><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>Python (45%)</span> — <span style={{ color: 'var(--dim)' }}>QueryMind-DW, OI-Engine, SageScan</span></div>
            <div><span style={{ color: 'var(--purple)', fontWeight: 'bold' }}>TypeScript (25%)</span> — <span style={{ color: 'var(--dim)' }}>SuraRevamped</span></div>
            <div><span style={{ color: 'var(--green)', fontWeight: 'bold' }}>Go (15%)</span> — <span style={{ color: 'var(--dim)' }}>SageScan CLI</span></div>
            <div><span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>JavaScript (10%)</span> — <span style={{ color: 'var(--dim)' }}>HindiTranscriptionBot</span></div>
            <div><span style={{ color: 'var(--dim)', fontWeight: 'bold' }}>Other (5%)</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/DataViews.tsx', dataViewsContent);
