import { Link } from 'react-router-dom';
import { PenTool, Library, Bookmark } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header animate-fade-in">
        <h1 className="gradient-text">Motif Studio</h1>
        <p>Your loom is ready for a new pattern.</p>
      </header>

      <main className="home-content">
        <Link to="/editor" className="card create-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon">
            <PenTool size={32} />
          </div>
          <div className="card-info">
            <h2>Create New Design</h2>
            <p>Begin a new handloom pattern with a traditional weaving grid.</p>
          </div>
        </Link>

        <Link to="/saved" className="card saved-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon">
            <Bookmark size={32} />
          </div>
          <div className="card-info">
            <h2>Saved Designs</h2>
            <p>Return to your collection of traditional handloom patterns.</p>
          </div>
        </Link>

        <Link to="/library" className="card library-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-icon">
            <Library size={32} />
          </div>
          <div className="card-info">
            <h2>Motif Library</h2>
            <p>Explore a collection of classic weaving motifs and presets.</p>
          </div>
        </Link>
      </main>
    </div>
  );
}
