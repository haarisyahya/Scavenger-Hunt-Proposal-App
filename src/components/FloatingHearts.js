import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const FloatingHearts = ({ count = 15 }) => {
  const hearts = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    const left = Math.random() * 100;
    
    return (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: '-10%',
          color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)`, // Pink/red shades
          fontSize: `${size}px`,
          zIndex: 0,
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [`${left}%`, `${left + (Math.random() * 20 - 10)}%`],
          rotate: [0, 360],
          opacity: [0.8, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <FaHeart />
      </motion.div>
    );
  });

  return <>{hearts}</>;
};

export default FloatingHearts;