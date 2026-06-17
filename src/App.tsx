import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import SavedDesigns from './pages/SavedDesigns';
import MotifLibrary from './pages/MotifLibrary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/saved" element={<SavedDesigns />} />
        <Route path="/library" element={<MotifLibrary />} />
      </Routes>
    </Router>
  );
}

export default App;
