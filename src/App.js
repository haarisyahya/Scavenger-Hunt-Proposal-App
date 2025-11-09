import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Clue from './components/Clue';
import Finale from './components/Finale';
import { useState, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
//import AudioPlayer from './components/AudioPlayer';
import Confetti from 'react-confetti';
import { loadProgress, resetProgress } from './utils/progress';
import PhaseTransition from './components/PhaseTransition';
import ProtectedRoute from './components/ProtectedRoute';

function RestartButton({ onRestart }) {
  const navigate = useNavigate();

  const handleClick = () => {
    onRestart();
    navigate('/');  // navigate home after reset
  };

  return (
    <button className="restart-button" onClick={handleClick}>
      🔄 Restart the Hunt!
    </button>
  );
}

function App() {

  const [progress, setProgress] = useState(loadProgress());
  const [showConfetti, setShowConfetti] = useState(false);
 

   const handleRestart = () => {
    resetProgress();
    setProgress(loadProgress()); // reload to start fresh  
  };

  useEffect(() => {
  const handleProgressUpdated = (e) => {
    setProgress(e?.detail || loadProgress());
  };
  window.addEventListener('progressUpdated', handleProgressUpdated);

   const onStorage = (e) => {
    if (e.key === 'scavengerHuntProgress') setProgress(loadProgress());
  };
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener('progressUpdated', handleProgressUpdated);
    window.removeEventListener('storage', onStorage);
  };
}, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Floating hearts background */}
      <FloatingHearts count={20} />
        {/* ===== AUDIO PLAYER ===== 
      <AudioPlayer muted={muted} />*/}
      
      {/* Confetti for when she reaches the proposal */}
      {showConfetti && (
        <Confetti 
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
       {/* ===== MUTE BUTTON (OPTIONAL) ===== 
      <button 
        onClick={() => setMuted(!muted)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer'
        }}
      > 
        {muted ? '🔇' : '🔊'}
      </button>*/}
  <button  className="restart-button" onClick={handleRestart} style={{ marginTop: '20px' }}>
        🔄 Restart the Hunt!
      </button>
      
    <Router>
       {/* Place RestartButton inside Router so useNavigate works */}
        <RestartButton onRestart={handleRestart} />
      <Routes>
        <Route path="/"  element={<Home progress={progress} setProgress={setProgress}  />} />
        <Route 
        path="/phase-transition/:phaseNumber" element={<PhaseTransition />} />
        
        <Route 
  path="/clue/:id(\\d+)"
  element={<Clue />}
  loader={({ params }) => {
    const id = parseInt(params.id);
    if (isNaN(id) || id < 1 || id > 15) {
      throw new Response("", { status: 404, statusText: "Not Found" });
    }
    return null;
  }}
  
  
/>

        <Route path="/clue/:id" element={<Clue />}loader={({ params }) => { 
          const id = parseInt(params.id);
          if (isNaN(id) || id < 1 || id > 15) {
            throw new Response("", { status: 404, statusText: "Not Found" });
          }
          return null;
        }}
  
/>
        
        <Route path="/clue/:id" element={<ProtectedRoute><Clue /></ProtectedRoute>} />
         <Route path="/proposal" element={<Finale onProposalReached={() => setShowConfetti(true)} />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;