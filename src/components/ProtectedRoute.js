import { loadProgress } from '../utils/progress';
import { Navigate, useParams } from 'react-router-dom';
import { clues } from '../data/clues';

export default function ProtectedRoute({ element: Element }) {
  const { id } = useParams();
  const clueId = parseInt(id);
  const progress = loadProgress();

  // If no progress saved, start from clue 1
  if (!progress || !progress.currentClueId) {
    return <Navigate to="/clue/1" replace />;
  }

  // If trying to access beyond current progress, block
  if (clueId > progress.currentClueId) {
    return <Navigate to={`/clue/${progress.currentClueId}`} replace />;
  }

  // Validate clue exists in data
  const currentPhase = clueId <= 5 ? 'phase1' : clueId <= 10 ? 'phase2' : 'phase3';
  if (!clues[currentPhase]?.some(clue => clue.id === clueId)) {
    return <Navigate to="/" replace />;
  }

  return <Element />;
}
