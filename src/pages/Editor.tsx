import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eraser, PenTool, Trash2, Download, Save, Share2, Image, FileJson } from 'lucide-react';
import { useGrid, COLORS, Color } from '../hooks/useGrid';
import { calculatePrice } from '../utils/pricing';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Editor.css';

export default function Editor() {
  const navigate = useNavigate();
  const {
    size, grid, activeTool, setActiveTool,
    activeColor, setActiveColor,
    onMouseDown, onMouseEnter, onMouseUp,
    clearCanvas, loadGrid
  } = useGrid(16);

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const pricing = calculatePrice(grid, size);

  /* ───────────────── Save locally ───────────────── */
  const handleSave = () => {
    const savedDesigns = JSON.parse(localStorage.getItem('savedMotifs') || '[]');
    const newDesign = {
      id: Date.now().toString(),
      name: designName,
      grid,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('savedMotifs', JSON.stringify([...savedDesigns, newDesign]));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  /* ───────── Export as PNG Image (Q8) ──────────── */
  const handleExportImage = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 3, backgroundColor: '#e2e8f0' });
      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  /* ────────── Export as JSON Data (Q8) ─────────── */
  const handleExportJSON = () => {
    const payload = {
      name: designName,
      dimensions: `${size}x${size}`,
      colorsUsed: pricing.uniqueColors,
      filledCells: pricing.filledCells,
      estimatedPrice: pricing.total,
      notes,
      grid,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `${designName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  /* ─────── Export Handover PDF (Q5 + Q8) ────────── */
  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvasElement = await html2canvas(canvasRef.current, { scale: 2, backgroundColor: '#e2e8f0' });
      const imgData = canvasElement.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      /* Header */
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, 0, pdfWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('Motif Handover Summary', 20, 25);

      /* Design Info */
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Design Name: ${designName}`, 20, 55);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      const infoLines = [
        `Order ID: ${orderId}`,
        `Dimensions: ${size} x ${size} cells`,
        `Colors Used: ${pricing.uniqueColors}`,
        `Filled Cells: ${pricing.filledCells} / ${size * size}`,
        `Complexity Score: ${Math.round((pricing.filledCells / (size * size)) * 100)}%`,
        '',
        `Base Price: Rs. ${pricing.basePrice}`,
        `Color Charge (${pricing.uniqueColors} colors x Rs.100): Rs. ${pricing.colorCharge}`,
        `Complexity Charge (${pricing.filledCells} cells x Rs.2): Rs. ${pricing.complexityCharge}`,
      ];
      let y = 65;
      infoLines.forEach((line) => {
        pdf.text(line, 20, y);
        y += 7;
      });

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      y += 3;
      pdf.text(`Estimated Price: Rs. ${pricing.total}`, 20, y);
      y += 10;

      if (notes) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text('Notes:', 20, y);
        y += 6;
        const splitNotes = pdf.splitTextToSize(notes, pdfWidth - 40);
        pdf.text(splitNotes, 20, y);
        y += splitNotes.length * 6 + 5;
      }

      /* Motif Preview */
      y += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Motif Preview:', 20, y);
      y += 5;
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = Math.min(pdfWidth - 40, 120);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);

      pdf.save(`${designName.replace(/\s+/g, '_')}_Handover.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsExporting(false);
      setShowShareMenu(false);
    }
  };

  return (
    <div className="editor-container" onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      {/* ─── Toast ─── */}
      {saveToast && <div className="toast">✓ Design saved!</div>}

      {/* ─── Header ─── */}
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
          <button className="btn btn-secondary" onClick={handleSave}>
            <Save size={18} /> Save
          </button>

          {/* Share / Export dropdown — Q8 */}
          <div className="share-dropdown-wrapper">
            <button className="btn btn-secondary" onClick={() => setShowShareMenu(!showShareMenu)}>
              <Share2 size={18} /> Share
            </button>
            {showShareMenu && (
              <div className="share-dropdown glass-panel">
                <button onClick={handleExportImage}><Image size={16} /> Export as Image</button>
                <button onClick={handleExportJSON}><FileJson size={16} /> Export Design Data</button>
                <button onClick={handleExportPDF} disabled={isExporting}>
                  <Download size={16} /> {isExporting ? 'Generating…' : 'Handover PDF'}
                </button>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={handleExportPDF} disabled={isExporting}>
            <Download size={18} /> {isExporting ? 'Generating…' : 'Handover PDF'}
          </button>
        </div>
      </header>

      {/* ─── Main Layout ─── */}
      <main className="editor-main">
        {/* Left Toolbar */}
        <div className="toolbar glass-panel">
          <h3>Tools</h3>
          <div className="tool-group">
            <button
              className={`tool-btn ${activeTool === 'draw' ? 'active' : ''}`}
              onClick={() => setActiveTool('draw')}
            >
              <PenTool size={20} /> Draw
            </button>
            <button
              className={`tool-btn ${activeTool === 'erase' ? 'active' : ''}`}
              onClick={() => setActiveTool('erase')}
            >
              <Eraser size={20} /> Erase
            </button>
            <button className="tool-btn danger" onClick={clearCanvas}>
              <Trash2 size={20} /> Clear
            </button>
          </div>

          <h3 className="mt-4">Colors</h3>
          <div className="color-palette">
            {COLORS.map((c) => (
              <button
                key={c.id}
                className={`color-swatch ${activeColor === c.hex && activeTool === 'draw' ? 'active' : ''}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => {
                  setActiveColor(c.hex as Color);
                  setActiveTool('draw');
                }}
                title={c.label}
              >
                {activeColor === c.hex && activeTool === 'draw' && <span className="swatch-check">✓</span>}
              </button>
            ))}
          </div>

          <div className="active-indicator mt-4">
            <p>Active: <strong>{activeTool === 'draw' ? 'Draw' : 'Eraser'}</strong></p>
            {activeTool === 'draw' && (
              <p>
                Color:{' '}
                <span className="active-color-dot" style={{ backgroundColor: activeColor }} />
                <strong>{COLORS.find((c) => c.hex === activeColor)?.label}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="canvas-container animate-fade-in">
          <div
            ref={canvasRef}
            className="grid-canvas"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
          >
            {grid.map((cellColor, index) => (
              <div
                key={index}
                className="grid-cell"
                style={{ backgroundColor: cellColor || 'transparent' }}
                onMouseDown={() => onMouseDown(index)}
                onMouseEnter={() => onMouseEnter(index)}
                onTouchStart={(e) => { e.preventDefault(); onMouseDown(index); }}
                onDragStart={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar right-sidebar glass-panel">
          <div className="pricing-widget">
            <h3>Live Estimate</h3>
            <div className="price-total">₹{pricing.total}</div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Layout ({size}×{size})</span>
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
              {pricing.sizeCharge > 0 && (
                <div className="price-row">
                  <span>Size Charge</span>
                  <span>₹{pricing.sizeCharge}</span>
                </div>
              )}
            </div>

            <div className="price-formula mt-4">
              <p className="formula-label">Formula:</p>
              <code>Base + (Colors×100) + (Cells×2) + SizeCharge</code>
            </div>
          </div>

          <div className="notes-section mt-4">
            <h3>Order Notes</h3>
            <textarea
              placeholder="Add instructions for the production team…"
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
