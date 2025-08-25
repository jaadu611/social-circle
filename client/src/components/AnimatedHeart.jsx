import React, { useState } from "react";

const AnimatedHeart = ({ size = 24, liked = false, onClick }) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = () => {
    onClick?.();

    // Trigger bounce animation
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    // Only generate particles if unliked
    if (!liked) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: i * 45 + Math.random() * 20 - 10,
        distance: 30 + Math.random() * 20,
        delay: Math.random() * 200,
        size: 2 + Math.random() * 3,
      }));

      setParticles((prev) => [...prev, ...newParticles]);

      // Remove particles after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 800);
    }
  };

  return (
    <div
      className="heart-container relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-110 hover:-translate-y-1"
      onClick={handleClick}
      style={{ position: "relative" }}
    >
      {/* Particles */}
      {particles.map((particle) => {
        const rad = (particle.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * particle.distance;
        const ty = Math.sin(rad) * particle.distance;

        return (
          <div
            key={particle.id}
            className="particle absolute rounded-full bg-red-500 pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              transform: `translate(0, 0)`,
              animation: `particleFloat 0.8s ease-out forwards`,
              animationDelay: `${particle.delay}ms`,
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
            }}
          />
        );
      })}

      {/* Heart */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`heart-svg ${liked ? "liked" : ""} ${
          isBouncing ? "bounce" : ""
        } transition-transform duration-200`}
      >
        <defs>
          <linearGradient
            id="likedGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#ff5252" />
            <stop offset="100%" stopColor="#e53e3e" />
          </linearGradient>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={liked ? "url(#likedGradient)" : "transparent"}
          stroke={liked ? "none" : "#64748b"}
          strokeWidth="2"
        />
      </svg>

      {/* Styles */}
      <style>{`
        @keyframes bounceHeart {
          0% { transform: scale(1); }
          20% { transform: scale(1.15); }
          40% { transform: scale(0.95); }
          60% { transform: scale(1.05); }
          80% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }

        .heart-svg.bounce {
          animation: bounceHeart 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes particleFloat {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedHeart;
