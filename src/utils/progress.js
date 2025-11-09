/*const PHASE_BOUNDARIES = {
  phase1: 5,
  phase2: 10,
  phase3: 15
};*/

export const initializeProgress = () => {
  const defaultProgress = {
  phase: 'phase1',
  currentClueId: 1,
  completedClues: [],
  lastAccessed: new Date().toISOString(),
  phase1Completed: false,
  phase2Completed: false,
  phase3Completed: false
};
  localStorage.setItem('scavengerHuntProgress', JSON.stringify(defaultProgress));
  return defaultProgress;
};


// debug version of saveProgress
export const saveProgress = (clueId, phase) => {
  const progress = loadProgress();

  // Log caller & inputs
  const stack = (new Error()).stack;
  console.groupCollapsed(`[saveProgress] called with clueId=${clueId}, phase=${phase}`);
  console.log('stack trace:', stack);
  console.log('stored BEFORE:', JSON.parse(JSON.stringify(progress)));

  // normalize & validate
  const numericClueId = Number(clueId);
  if (!Number.isInteger(numericClueId) || numericClueId < 1 || numericClueId > 15) {
    console.error('Invalid clueId (not saved):', clueId);
    console.groupEnd();
    return progress;
  }

  // compute phase from clueId and warn on mismatch
  const computedPhase = numericClueId <= 5 ? 'phase1' : numericClueId <= 10 ? 'phase2' : 'phase3';
  if (phase && phase !== computedPhase) {
    console.warn(`Phase mismatch — arg phase="${phase}" vs computed="${computedPhase}" (will use computed).`);
  }
  const finalPhase = computedPhase;

  const cleanedClues = (progress.completedClues || [])
    .map(n => Number(n))
    .filter(n => Number.isInteger(n) && n >= 1 && n <= 15);

  const updatedClues = Array.from(new Set([...cleanedClues, numericClueId])).sort((a,b)=>a-b);

  const updatedProgress = {
    ...progress,
    currentClueId: numericClueId,
    phase: finalPhase,
    completedClues: updatedClues,
    phase1Completed: updatedClues.includes(5),
    phase2Completed: updatedClues.includes(10),
    phase3Completed: updatedClues.includes(15),
    lastAccessed: new Date().toISOString()
  };

  try {
    localStorage.setItem('scavengerHuntProgress', JSON.stringify(updatedProgress));
    console.log('stored AFTER:', JSON.parse(JSON.stringify(updatedProgress)));
    window.dispatchEvent(new CustomEvent('progressUpdated', { detail: updatedProgress }));

  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
  console.groupEnd();

  return updatedProgress;
};

//3. Admin/Reset Functions
export const resetProgress = () => {
  localStorage.removeItem('scavengerHuntProgress');
  return initializeProgress();
};



export const loadProgress = () => {
  const saved = localStorage.getItem('scavengerHuntProgress');
  return saved ? JSON.parse(saved) : initializeProgress();
};

export const getCompletionStats = () => {
  const progress = loadProgress();
  return {
    phase1: {
      completed: progress.phase1Completed,
      percent: Math.round((progress.completedClues.filter(id => id <= 5).length / 5) * 100),
      completedClues: progress.completedClues.filter(id => id <= 5).length
    },
    phase2: {
      completed: progress.phase2Completed,
      percent: Math.round((progress.completedClues.filter(id => id > 5 && id <= 10).length / 5) * 100),
      completedClues: progress.completedClues.filter(id => id > 5 && id <= 10).length
    },
    phase3: {
      completed: progress.phase3Completed,
      percent: Math.round((progress.completedClues.filter(id => id > 10).length / 5) * 100),
      completedClues: progress.completedClues.filter(id => id > 10).length
    },
    totalPercent: Math.round((progress.completedClues.length / 15) * 100)
  };
  
};
