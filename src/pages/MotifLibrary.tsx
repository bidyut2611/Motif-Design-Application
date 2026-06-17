import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { PRESETS } from '../utils/presets';
import './Library.css';

export default function MotifLibrary() {
  const navigate = useNavigate();

  const handleLoadPreset = (grid: string[]) => {
    // In a real app we'd use Context/Redux. Here we can use localStorage to pass data.
    localStorage.setItem('tempPreset', JSON.stringify(grid));
    navigate('/editor');
  };

  return (
    <div className="library-container">
      <header className="library-header">
        <button className="btn back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h2>Heritage Library</h2>
      </header>

      <main className="library-grid">
        {PRESETS.map((preset) => (
          <div key={preset.id} className="preset-card glass-panel">
            <div className="preset-preview" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(16, 1fr)',
              aspectRatio: '1'
            }}>
              {preset.grid.map((color, i) => (
                <div key={i} style={{ backgroundColor: color || 'transparent' }} />
              ))}
            </div>
            <div className="preset-info">
              <h3>{preset.name}</h3>
              <button className="btn btn-primary" onClick={() => handleLoadPreset(preset.grid)}>
                <Edit2 size={16} /> Edit Motif
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
