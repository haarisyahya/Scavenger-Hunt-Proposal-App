import { useNavigate } from 'react-router-dom';
import { loadProgress } from '../utils/progress'; 

export default function Home({ progress = loadProgress() }) {
  const navigate = useNavigate();
  
    const handleStart = () => {
    
  // 1. Validate progress exists
  if (!progress) {
    navigate('/clue/1'); // Start from beginning
    return;
  }

  // 2. Validate currentClueId
  const clueId = parseInt(progress.currentClueId);
  const isValidClue = !isNaN(clueId) && clueId >= 1 && clueId <= 15;
  
  // 3. Navigate safely
  navigate(`/clue/${isValidClue ? clueId : 1}`); 
};
  return (
    <div className="romantic-container">
      <h1>Our Journey of Love</h1>
      {progress.currentClueId > 1 && (
        <p>Welcome back! You'll continue from where you left off.</p>
      )}
      <p>Follow the clues to discover something special, baby...</p>
     
      <button onClick={handleStart}>
        {progress.currentClueId > 1 ? 'Continue the Hunt!' : 'Start the Hunt!'}
      </button>
    </div>
  );
}

