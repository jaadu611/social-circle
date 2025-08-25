import React, { useState } from "react";

const AnimatedShare = ({ size = 28, onClick, className = "" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trails, setTrails] = useState([]);
  const [shareRings, setShareRings] = useState([]);

  const handleClick = () => {
    onClick?.();
    setIsAnimating(true);

    // Reduced trails
    const newTrails = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 50,
      opacity: 1 - i * 0.2,
    }));
    setTrails(newTrails);

    // Reduced share rings
    const newRings = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      delay: i * 100,
    }));
    setShareRings(newRings);

    setTimeout(() => {
      setIsAnimating(false);
      setTrails([]);
      setShareRings([]);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @keyframes planeFly {
          0% { transform: translate(0,0) rotate(0deg) scale(1); opacity:1; }
          50% { transform: translate(15px,-8px) rotate(-20deg) scale(1.1); opacity:0.9; }
          100% { transform: translate(30px,-15px) rotate(-25deg) scale(0.85); opacity:0.5; }
        }

        @keyframes trailFade {
          0% { opacity: var(--trail-opacity); transform: translate(0,0) scale(1); }
          100% { opacity:0; transform: translate(-10px,5px) scale(0.7); }
        }

        @keyframes shareRing {
          0% { transform: scale(0); opacity:0.6; }
          50% { opacity:0.3; }
          100% { transform: scale(3); opacity:0; }
        }

        .share-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          overflow: visible;
          transition: transform 0.2s ease;
        }

        .share-container:hover {
          transform: translateY(-2px) scale(1.05);
        }

        .share-container:active {
          transform: translateY(0px) scale(0.95);
        }

        .share-svg {
          overflow: visible;
        }

        .share-svg.flying {
          animation: planeFly 1s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        .plane-trail {
          animation: trailFade 0.8s ease-out forwards;
        }

        .share-ring {
          animation: shareRing 0.8s ease-out forwards;
        }
      `}</style>

      <div
        className={`share-container ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Share rings */}
        {shareRings.map((ring) => (
          <div
            key={ring.id}
            className="share-ring"
            style={{
              position: "absolute",
              width: size,
              height: size,
              border: "2px solid rgba(16,185,129,0.6)",
              borderRadius: "50%",
              animationDelay: `${ring.delay}ms`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Paper plane trails */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`share-svg ${isAnimating ? "flying" : ""}`}
        >
          <defs>
            <linearGradient
              id="planeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {trails.map((trail) => (
            <polygon
              key={trail.id}
              className="plane-trail"
              points="3,21 21,12 3,3 8,12 3,21"
              fill="rgba(16,185,129,0.25)"
              stroke="url(#planeGradient)"
              strokeWidth="1"
              style={{
                opacity: trail.opacity,
                animationDelay: `${trail.delay}ms`,
              }}
            />
          ))}

          {/* Main plane */}
          <polygon
            points="3,21 21,12 3,3 8,12 3,21"
            fill="rgba(16,185,129,0.15)"
            stroke="url(#planeGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="3"
            y1="3"
            x2="12.4"
            y2="12.4"
            stroke="url(#planeGradient)"
            strokeWidth="1.2"
          />
          <line
            x1="12"
            y1="12"
            x2="4"
            y2="20"
            stroke="url(#planeGradient)"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </>
  );
};

export default AnimatedShare;
