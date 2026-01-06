import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ThreeDShapes: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const yMove = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bgPrimary">
      {/* 3D Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <motion.div 
          style={{ y: yMove }}
          className="absolute inset-0 origin-center"
        >
          {/* Horizontal Grid Lines */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(46, 204, 113, 0.3) 95%)',
              backgroundSize: '100% 50px',
              transform: 'rotateX(60deg) scale(2.5) translateY(-20%)',
            }}
          />
          {/* Vertical Grid Lines */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to right, transparent 95%, rgba(46, 204, 113, 0.3) 95%)',
              backgroundSize: '50px 100%',
              transform: 'rotateX(60deg) scale(2.5) translateY(-20%)',
            }}
          />
        </motion.div>
      </div>

      {/* Floating 3D Cube */}
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          y: [0, -60, 0],
          x: [0, 30, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[15%] left-[5%] w-40 h-40 border-2 border-accent/30 rounded-2xl preserve-3d glass"
      >
        <div className="absolute inset-0 border border-accent/10 rounded-2xl translate-z-10" />
        <div className="absolute inset-0 border border-accent/10 rounded-2xl -translate-z-10" />
      </motion.div>

      {/* Floating Tetrahedron-like shape */}
      <motion.div
        animate={{
          rotateZ: [0, 360],
          rotateX: [360, 0],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] right-[10%] w-64 h-64 border border-white/10 rounded-[30%] preserve-3d flex items-center justify-center opacity-40"
      >
        <div className="w-full h-full border border-accent/20 rounded-full rotate-45 animate-pulse" />
        <div className="absolute w-full h-full border border-accent/20 rounded-full -rotate-45 animate-pulse" />
        <div className="absolute w-1/2 h-1/2 bg-accent/5 rounded-full blur-2xl" />
      </motion.div>

      {/* Floating Particles/Dust */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{
            y: [null, Math.random() * -200],
            x: [null, (Math.random() - 0.5) * 100],
            opacity: [0, 0.4, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_rgba(46,204,113,0.8)]"
        />
      ))}

      {/* Ambient Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,15,15,0.8)_100%)]" />
    </div>
  );
};
