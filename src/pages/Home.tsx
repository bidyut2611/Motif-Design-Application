import { Link } from 'react-router-dom';
import { PenTool, Library, Bookmark, ArrowRight } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-bg-glow" />

      <header className="home-header animate-fade-in">
        <h1 className="gradient-text">Motif Studio</h1>
        <p className="home-subtitle">
          Design handloom motifs with an interactive grid editor,
          estimate pricing live, and generate production-ready handover PDFs.
        </p>
      </header>

      <main className="home-content">
        <Link to="/editor" className="card create-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon create-icon">
            <PenTool size={28} />
          </div>
          <div className="card-info">
            <h2>Create New Design</h2>
            <p>Open the grid-based motif editor to start a new 16×16 pattern from scratch.</p>
          </div>
          <ArrowRight size={20} className="card-arrow" />
        </Link>

        <Link to="/saved" className="card saved-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon saved-icon">
            <Bookmark size={28} />
          </div>
          <div className="card-info">
            <h2>Saved Designs</h2>
            <p>Open, duplicate, or delete previously saved handloom motif designs.</p>
          </div>
          <ArrowRight size={20} className="card-arrow" />
        </Link>

        <Link to="/library" className="card library-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-icon library-icon">
            <Library size={28} />
          </div>
          <div className="card-info">
            <h2>Motif Library</h2>
            <p>Browse preset traditional motifs and load them onto the editor canvas.</p>
          </div>
          <ArrowRight size={20} className="card-arrow" />
        </Link>
      </main>

      <footer className="home-footer animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <p>SSI Developer Assessment • Built with React + Vite</p>
      </footer>
    </div>
  );
}
