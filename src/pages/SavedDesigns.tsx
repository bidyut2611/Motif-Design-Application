import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Copy } from 'lucide-react';
import './Library.css';

interface SavedMotif {
  id: string;
  name: string;
  grid: string[];
  timestamp: string;
}

export default function SavedDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<SavedMotif[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedMotifs') || '[]');
    setDesigns(saved);
  }, []);

  const handleLoad = (grid: string[]) => {
    localStorage.setItem('tempPreset', JSON.stringify(grid));
    navigate('/editor');
  };

  const handleDelete = (id: string) => {
    const updated = designs.filter(d => d.id !== id);
    setDesigns(updated);
    localStorage.setItem('savedMotifs', JSON.stringify(updated));
  };

  const handleDuplicate = (design: SavedMotif) => {
    const duplicated = {
      ...design,
      id: Date.now().toString(),
      name: `${design.name} (Copy)`,
      timestamp: new Date().toISOString()
    };
    const updated = [...designs, duplicated];
    setDesigns(updated);
    localStorage.setItem('savedMotifs', JSON.stringify(updated));
  };

  return (
    <div className="library-container">
      <header className="library-header">
        <button className="btn back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Saved Designs</h2>
      </header>

      <main className="library-grid">
        {designs.length === 0 ? (
          <div className="empty-state">No saved designs found.</div>
        ) : (
          designs.map((design) => (
            <div key={design.id} className="preset-card glass-panel">
              <div className="preset-preview" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(16, 1fr)',
                aspectRatio: '1'
              }}>
                {design.grid.map((color, i) => (
                  <div key={i} style={{ backgroundColor: color || 'transparent' }} />
                ))}
              </div>
              <div className="preset-info">
                <h3>{design.name}</h3>
                <p className="date-label">{new Date(design.timestamp).toLocaleDateString()}</p>
                <div className="actions-row">
                  <button className="btn btn-primary" onClick={() => handleLoad(design.grid)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleDuplicate(design)} title="Duplicate">
                    <Copy size={16} />
                  </button>
                  <button className="btn btn-secondary danger-text" onClick={() => handleDelete(design.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
