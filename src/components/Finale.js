import { FaRing } from 'react-icons/fa';
import { useEffect } from 'react';

function Finale({ onProposalReached }) {
  useEffect(() => {
    onProposalReached(); // Trigger confetti when component mounts
  }, [onProposalReached]);
  return (
    <div className="proposal-container">
      <h1>You've Completed the Adventure!</h1>
      <div className="proposal-content">
        <p>Every step of this journey represents our love story...</p>
        <p>Now turn around!</p>
        <div className="ring">
          <FaRing size={50} />
        </div>
      </div>
    </div>
  );
}

export default Finale;