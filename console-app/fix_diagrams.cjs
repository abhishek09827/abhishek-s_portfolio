const fs = require('fs');

const htmlContent = fs.readFileSync('../architectures.html', 'utf8');

function extractRawSvg(id) {
    const startRegex = new RegExp(`<svg id="${id}"[^>]*>`, 'i');
    const startMatch = htmlContent.match(startRegex);
    if (!startMatch) return '';
    const startIdx = startMatch.index;
    const endIdx = htmlContent.indexOf('</svg>', startIdx) + 6;
    let svg = htmlContent.substring(startIdx, endIdx);
    
    if (!svg.includes('class="arch-svg"')) {
      svg = svg.replace('<svg', '<svg class="arch-svg"');
    }
    return svg;
}

const sagescanSvg = extractRawSvg('svg-sagescan');
const oieSvg = extractRawSvg('svg-oie');
const querymindSvg = extractRawSvg('svg-qm');

const styles = `
<style>
.arch-svg {
  width: 100%;
  height: auto;
  display: block;
  max-height: 100%;
}
.node-group { cursor: pointer; }
/* Target rect and text directly since classes might be missing */
.node-group:hover rect { filter: brightness(1.3); }
.node-group:hover text { fill: #fff !important; }

/* Tooltip style */
.svg-tooltip {
  position: fixed;
  background: rgba(12,16,24,0.95);
  border: 1px solid var(--cyan);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--cyan);
  pointer-events: none;
  z-index: 9999;
  max-width: 250px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.4;
  font-family: var(--font);
}
</style>
`;

let dataviews = fs.readFileSync('src/components/DataViews.tsx', 'utf8');

const graphViewStart = dataviews.indexOf('export const GraphView: React.FC = () => {');
const graphViewEnd = dataviews.indexOf('// --- DESIGN VIEW ---');

const newGraphView = `export const GraphView: React.FC = () => {
  const [activeGraph, setActiveGraph] = useState<'sagescan' | 'oie' | 'querymind'>('sagescan');
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const group = target.closest('.node-group');
      if (group) {
        const tip = group.getAttribute('data-tip');
        if (tip) {
          setTooltip({ text: tip, x: e.clientX, y: e.clientY });
        }
      } else {
        setTooltip(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip) {
        setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
      }
    };

    const container = document.getElementById('graph-container');
    if (container) {
      container.addEventListener('mouseover', handleMouseOver);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseout', () => setTooltip(null));
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseover', handleMouseOver);
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [activeGraph, tooltip]);

  return (
    <div className="glass-panel" id="graph-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', minHeight: 0, height: '100%', position: 'relative' }}>
      <div dangerouslySetInnerHTML={{ __html: \`${styles}\` }} />
      
      {tooltip && (
        <div className="svg-tooltip" style={{ left: tooltip.x + 15, top: tooltip.y - 10 }}>
          {tooltip.text}
        </div>
      )}

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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
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

fs.writeFileSync('src/components/DataViews.tsx', dataviews);
