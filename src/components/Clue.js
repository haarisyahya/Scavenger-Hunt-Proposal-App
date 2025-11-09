import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { clues } from '../data/clues';
import { saveProgress } from '../utils/progress'; // removed loadProgress (unused)

function Clue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupAnswer, setBackupAnswer] = useState('');
  const [showBackupOption, setShowBackupOption] = useState(false);

  const clueId = parseInt(id);
  const currentPhase =
    clueId <= 5 ? 'phase1' :
    clueId <= 10 ? 'phase2' :
    'phase3';

  const currentClue = clues[currentPhase]?.find(clue => clue.id === clueId) || {
    text: "Clue not found",
    location: { lat: 0, lng: 0 },
    backupKeyword: ""
  };

  const isLastClueOfPhase =
    (currentPhase === 'phase1' && clueId === 5) ||
    (currentPhase === 'phase2' && clueId === 10) ||
    (currentPhase === 'phase3' && clueId === 14);

  // Reset verification when clue ID changes
  useEffect(() => {
    setVerified(false);
    setShowBackupOption(false);
    setBackupAnswer('');
    saveProgress(currentPhase, parseInt(id));
  }, [id, currentPhase]); // added currentPhase as dependency ✅

  const handleVerificationSuccess = () => {
    setVerified(true);
    saveProgress(clueId, currentPhase);
  };

  const verifyLocation = () => {
    setIsVerifying(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const distance = calculateDistance(
            userLat,
            userLng,
            currentClue.location.lat,
            currentClue.location.lng
          );

          if (distance < 2) {
            handleVerificationSuccess();
          } else {
            alert("You're not quite at the right location yet. Keep searching!");
          }
          setIsVerifying(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsVerifying(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Try manual verification.");
    }
  };

  const handleContinue = () => {
    if (isLastClueOfPhase) {
      navigate(`/phase-transition/${
        currentPhase === 'phase1' ? 1 :
        currentPhase === 'phase2' ? 2 :
        3
      }`);
    } else {
      navigate(`/clue/${clueId + 1}`);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const verifyBackupAnswer = () => {
    if (backupAnswer.toLowerCase() === currentClue.backupKeyword.toLowerCase()) {
      setVerified(true);
      saveProgress(currentClue.id, currentPhase);
      setBackupAnswer('');
    } else {
      alert("That's not quite right! Try again or use GPS.");
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '75vh',
      position: 'relative',
      zIndex: 1,
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="clue-container"
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: '15px',
            padding: '0.5rem',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '75vh',
              width: '100%',
              margin: 0,
              padding: '20px',
              boxSizing: 'border-box',
              background: 'linear-gradient(to right, #fff5f5, #ffecec)'
            }}>
              <div className="clue-container" style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h2 style={{ color: '#e75480', marginBottom: '1.5rem' }}>
                  Clue #{id} <FaHeart color="red" />
                </h2>

                <p className="clue-text" style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  margin: '2rem 0',
                  fontStyle: 'italic'
                }}>
                  {currentClue.text}
                </p>

                <button
                  onClick={verifyLocation}
                  disabled={isVerifying}
                  style={{
                    background: '#e75480',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '1rem auto'
                  }}
                >
                  {isVerifying ? (
                    <span>Verifying... <LoadingSpinner /></span>
                  ) : (
                    <span><FaMapMarkerAlt /> Verify Location</span>
                  )}
                </button>

                {verified && (
                  <div style={{ marginTop: '2rem' }}>
                    <p style={{ marginBottom: '1.5rem' }}>Well done, my love! You found it!</p>
                    <button
                      onClick={handleContinue}
                      style={{
                        background: '#e75480',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isLastClueOfPhase ? 'Continue to Next Phase' : 'Continue to Next Clue'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!verified && (
            <>
              <button
                onClick={() => setShowBackupOption(!showBackupOption)}
                className="backup-toggle"
                style={{
                  marginTop: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#666',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {showBackupOption ? 'Hide' : 'Too much baby? Here is a shortcut :) '}
              </button>

              {showBackupOption && (
                <div style={{ marginTop: '15px' }}>
                  <p>Enter the location name:</p>
                  <input
                    type="text"
                    value={backupAnswer}
                    onChange={(e) => setBackupAnswer(e.target.value)}
                    placeholder="Where should you be right now?"
                    style={{
                      padding: '8px',
                      width: '95%',
                      marginBottom: '10px'
                    }}
                  />
                  <button
                    onClick={verifyBackupAnswer}
                    style={{
                      background: '#4CAF50',
                      color: 'white'
                    }}
                  >
                    Verify Location Name
                  </button>
                  <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
                    Hint: {currentClue.backupHint || "Think about where this clue is leading you"}
                  </p>
                </div>
              )}
            </>
          )}

          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f8f8',
            borderRadius: '5px',
            fontSize: '0.8rem',
            color: '#666',
            border: '1px dashed #ccc'
          }}>
            <h4>🚨 Use this to check whether you are getting closer or not. You need to be within 2km! 🚨</h4>
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition(position => {
                  const distance = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    currentClue.location.lat,
                    currentClue.location.lng
                  );
                  alert(`You're ${distance.toFixed(3)} km (${(distance * 1000).toFixed(0)} meters) away`);
                });
              }}
              style={{
                padding: '5px 10px',
                margin: '8px 0 0 8px',
                fontSize: '0.8rem'
              }}
            >
              Check Real Distance
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Clue;
