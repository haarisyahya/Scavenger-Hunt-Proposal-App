
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaArrowRight, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { getCompletionStats, saveProgress, loadProgress } from '../utils/progress';
import Confetti from 'react-confetti';

 // Phase configuration
  const PHASE_CONFIG = {
    1: { nextPhaseStart: 6, title: "The Beginning of Our Adventure", quote: "Every great love story has its first chapter..." },
    2: { nextPhaseStart: 11, title: "The Journey Continues", quote: "With every step, our love grows stronger..." },
    3: { title: "The Final Journey", quote: "All roads lead to you, my love..." }
  };
  const DEFAULT_PHASE = {
  title: "Phase Complete!",
  quote: "Your journey continues..."
};

export default function PhaseTransition() {
  const { phaseNumber } = useParams(); //get phase number from url params
  const navigate = useNavigate();
  const numericPhase = parseInt(phaseNumber) || 1; 
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  const stats = getCompletionStats();
  const progress = loadProgress();

  
   // Safely get current phase config
  const currentPhase = PHASE_CONFIG[numericPhase] || DEFAULT_PHASE;

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   useEffect(() => {
    console.log('Current progress:', progress);
    console.log('Current stats:', stats);
  }, []);

  // Stop confetti after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

// Save progress to mark phase completion
  useEffect(() => {
    const nextClueId = PHASE_CONFIG[phaseNumber]?.nextPhaseStart ?? 16;
    
  }, [phaseNumber]);

  const getPhaseTitle = () => {
    return phaseNumber === 1 
      ? "The Beginning of Our Adventure" 
      : "The Final Journey";
  };

const getNextPhaseButton = () => {
    const numericPhase = parseInt(phaseNumber) || 1; // Ensure number
    if (numericPhase  < 3) {
      return (
        <button 
          className="next-phase-button"
          onClick={() => navigate(`/clue/${PHASE_CONFIG[numericPhase].nextPhaseStart}`)}
        >
          Begin Phase {numericPhase + 1} <FaArrowRight />
        </button>
      );
    } else {
      return (
        <button 
          className="proposal-button"
          onClick={() => navigate('/proposal')}
        >
          Discover Your Final Surprise <FaHeart />
        </button>
      );
    }
  };
  
  

  return (
    <div className="phase-transition-container">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={phaseNumber === 1 ? 300 : 500}
          gravity={0.1}
        />
      )}

      <div className="phase-transition-card">
        <div className="header">
          <FaHeart className="heart-icon" />
          <h1>Phase {phaseNumber} Complete!</h1>
          <FaHeart className="heart-icon" />
        </div>

        <h2>{currentPhase.title}</h2>
        
        <div className="stats-box">
  {[1, 2, 3].map(phase => {
    const phaseStats = stats[`phase${phase}`] || {};
    return (
      <div key={phase} className={`stat-item ${phase <= numericPhase ? 'active' : ''}`}>
        <span className="stat-number">{phaseStats.percent || 0}%</span>
        <span>Phase {phase}</span>
        {phase <= numericPhase && <FaStar className="phase-star" />}
      </div>
    );
  })}
</div>

        <div className="memory-box">
          <h3>Your Journey So Far:</h3>
          <ul>
            <li> <FaCalendarAlt /> Solved {
        (stats.phase1?.completedClues || 0) + 
        (stats.phase2?.completedClues || 0) + 
        (stats.phase3?.completedClues || 0)
      } clues </li>
            <li><FaHeart /> Completed {phaseNumber} phases</li>
            <li>Overall completion: {stats.totalPercent || 0}%</li>
          </ul>
        </div>

        {getNextPhaseButton()}

         <div className="romantic-quote">
          <p>{PHASE_CONFIG[phaseNumber].quote}</p>
          {phaseNumber === 3 && <p className="final-message">You're almost there...</p>}
        </div>
      </div>
    </div>
  );
}