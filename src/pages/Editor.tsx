import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eraser, PenTool, Trash2, Download, Save, Share2 } from 'lucide-react';
import { useGrid, COLORS, Color, Tool } from '../hooks/useGrid';
import { calculatePrice } from '../utils/pricing';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Editor.css';

export default function Editor() {
  const navigate = useNavigate();
  const { size, grid, activeTool, setActiveTool, activeColor, setActiveColor, isDrawing, onMouseDown, onMouseEnter, onMouseUp, clearCanvas, loadGrid } = useGrid(16);
  
  useEffect(() => {
    const preset = localStorage.getItem('tempPreset');
    if (preset) {
      loadGrid(JSON.parse(preset));
      localStorage.removeItem('tempPreset');
    }
  }, [loadGrid]);
  
  const [designName, setDesignName] = useState('Untitled Motif');
  const [notes, setNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const pricing = calculatePrice(grid, size);

  const handleSave = () => {
    const savedDesigns = JSON.parse(localStorage.getItem('savedMotifs') || '[]');
    const newDesign = {
      id: Date.now().toString(),
      name: designName,
      grid,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedMotifs', JSON.stringify([...savedDesigns, newDesign]));
    alert('Design saved locally!');
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvasElement = await html2canvas(canvasRef.current, { scale: 2 });
      const imgData = canvasElement.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('Motif Handover Summary', 20, 20);
      
      pdf.setFontSize(14);
      pdf.text(`Design Name: ${designName}`, 20, 35);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Order ID: ${Date.now()}`, 20, 45);
      pdf.text(`Dimensions: ${size}x${size}`, 20, 52);
      pdf.text(`Colors Used: ${pricing.uniqueColors}`, 20, 59);
      pdf.text(`Complexity Score: ${pricing.filledCells} cells filled`, 20, 66);
      pdf.text(`Estimated Price: Rs. ${pricing.total}`, 20, 73);
      
      if (notes) {
        pdf.text(`Notes: ${notes}`, 20, 80, { maxWidth: pdfWidth - 40 });
      }

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 40;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 20, 100, imgWidth, imgHeight);
      pdf.save(`${designName.replace(/\s+/g, '_')}_Handover.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ name: designName, grid }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", designName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="editor-container" onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      <header className="editor-header">
        <button className="btn back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <input 
          type="text" 
          className="design-name-input" 
          value={designName} 
          onChange={(e) => setDesignName(e.target.value)} 
        />
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleSave}><Save size={18}/> Save</button>
          <button className="btn btn-secondary" onClick={handleShare}><Share2 size={18}/> Export JSON</button>
          <button className="btn btn-primary" onClick={handleExportPDF} disabled={isExporting}>
            <Download size={18}/> {isExporting ? 'Generating...' : 'Handover PDF'}
          </button>
        </div>
      </header>

      <main className="editor-main">
        <div className="toolbar glass-panel">
          <h3>Tools</h3>
          <div className="tool-group">
            <button className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`} onClick={() => setActiveTool('draw')}>
              <PenTool size={20}/> Draw
            </button>
            <button className={`tool-btn ${activeTool === 'erase' ? 'active' : ''}`} onClick={() => setActiveTool('erase')}>
              <Eraser size={20}/> Erase
            </button>
            <button className="tool-btn danger" onClick={clearCanvas}>
              <Trash2 size={20}/> Clear
            </button>
          </div>
          
          <h3 className="mt-4">Colors</h3>
          <div className="color-palette">
            {COLORS.map(c => (
              <button 
                key={c.id}
                className={`color-swatch ${activeColor === c.hex && activeTool === 'draw' ? 'active' : ''}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => { setActiveColor(c.hex as Color); setActiveTool('draw'); }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="canvas-container animate-fade-in">
          <div 
            ref={canvasRef}
            className="grid-canvas" 
            style={{ 
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gridTemplateRows: `repeat(${size}, 1fr)` 
            }}
          >
            {grid.map((cellColor, index) => (
              <div 
                key={index} 
                className="grid-cell"
                style={{ backgroundColor: cellColor || 'transparent' }}
                onMouseDown={() => onMouseDown(index)}
                onMouseEnter={() => onMouseEnter(index)}
                onDragStart={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </div>

        <div className="sidebar right-sidebar glass-panel">
          <div className="pricing-widget">
            <h3>Live Estimate</h3>
            <div className="price-total">₹{pricing.total}</div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Layout (16x16)</span>
                <span>₹{pricing.basePrice}</span>
              </div>
              <div className="price-row">
                <span>Colors ({pricing.uniqueColors})</span>
                <span>₹{pricing.colorCharge}</span>
              </div>
              <div className="price-row">
                <span>Complexity ({pricing.filledCells} cells)</span>
                <span>₹{pricing.complexityCharge}</span>
              </div>
            </div>
          </div>

          <div className="notes-section mt-4">
            <h3>Order Notes</h3>
            <textarea 
              placeholder="Add instructions for the production team..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
