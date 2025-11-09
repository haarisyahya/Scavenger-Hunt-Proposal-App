import { useEffect, useRef } from 'react';
import romanticMusic from '../assets/sounds/romantic.mp3'; //fake audio file
const AudioPlayer = ({ muted }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(romanticMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // 30% volume
    
    if (!muted) {
      audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  return null;
};

export default AudioPlayer;