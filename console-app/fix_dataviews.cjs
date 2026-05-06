const fs = require('fs');

const htmlContent = fs.readFileSync('../architectures.html', 'utf8');

// Extract the CSS styles
let styles = `
<style>
.arch-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node-group { cursor: pointer; }
.node-group:hover rect { filter: brightness(1.3); }
.node-group:hover text { fill: #fff; }
</style>
`;

function extractRawSvg(id) {
    const startRegex = new RegExp(`<svg id="${id}"[^>]*>`, 'i');
    const startMatch = htmlContent.match(startRegex);
    if (!startMatch) return '';
    const startIdx = startMatch.index;
    const endIdx = htmlContent.indexOf('</svg>', startIdx) + 6;
    let svg = htmlContent.substring(startIdx, endIdx);
    
    // Add the arch-svg class to ensure responsive width
    if (!svg.includes('arch-svg')) {
      svg = svg.replace('<svg', '<svg class="arch-svg"');
    }
    return svg;
}

const sagescanSvg = extractRawSvg('svg-sagescan');
const oieSvg = extractRawSvg('svg-oie');
const querymindSvg = extractRawSvg('svg-querymind');

let dataviews = fs.readFileSync('src/components/DataViews.tsx', 'utf8');

// Replace the GraphView component entirely
const graphViewStart = dataviews.indexOf('export const GraphView: React.FC = () => {');
const graphViewEnd = dataviews.indexOf('// --- DESIGN VIEW ---');
const newGraphView = `export const GraphView: React.FC = () => {
  const [activeGraph, setActiveGraph] = useState<'sagescan' | 'oie' | 'querymind'>('sagescan');

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%' }}>
      <div dangerouslySetInnerHTML={{ __html: \`${styles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
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
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'var(--bg2)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGraph}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'center' }}
          >
            {activeGraph === 'sagescan' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: \`${sagescanSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
            {activeGraph === 'oie' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: \`${oieSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
            {activeGraph === 'querymind' && (
              <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: \`${querymindSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

`;

dataviews = dataviews.substring(0, graphViewStart) + newGraphView + dataviews.substring(graphViewEnd);

// Fix scrolling on DesignView and others
dataviews = dataviews.replace(
  /<div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}/g,
  '<div className="glass-panel" style={{ flex: 1, display: \'flex\', flexDirection: \'column\', borderRadius: \'12px\', overflow: \'hidden\', minHeight: 0, height: \'100%\' }}'
);

// Specifically ensure App container allows height 100% logic
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  '<div className="main-content" style={{ display: \'flex\', flexDirection: \'row\', gap: \'16px\' }}>',
  '<div className="main-content" style={{ display: \'flex\', flexDirection: \'row\', gap: \'16px\', flex: 1, minHeight: 0, overflow: \'hidden\' }}>'
);
fs.writeFileSync('src/App.tsx', appContent);

// And ensure App.css or index.css has height 100% on app-container if it doesn't already
fs.writeFileSync('src/components/DataViews.tsx', dataviews);
