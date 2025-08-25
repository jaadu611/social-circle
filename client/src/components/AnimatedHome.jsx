import React, { useState } from "react";

const AnimatedHome = ({ size = 24, onClick, className = "" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cozyEffects, setCozyEffects] = useState([]);

  const handleClick = () => {
    onClick?.();
    setIsAnimating(true);

    // Create cozy sparkle effects
    const effects = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      angle: i * 36 + Math.random() * 20,
      distance: 15 + Math.random() * 10,
      delay: Math.random() * 400,
      size: 1 + Math.random() * 2,
      color: ["#FCD34D", "#F59E0B", "#EF4444", "#3B82F6"][
        Math.floor(Math.random() * 4)
      ],
    }));
    setCozyEffects(effects);

    setTimeout(() => {
      setIsAnimating(false);
      setCozyEffects([]);
    }, 1500);
  };

  const activeGlow = "#3B82F6";

  return (
    <>
      <style>{`
        @keyframes homeCozy {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.2) drop-shadow(0 0 20px ${activeGlow}); }
        }
        @keyframes cozySparkle {
          0% { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); }
        }
        @keyframes chimneySmoke {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-10px) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(1.5); }
        }

        .home-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.3);
          cursor: pointer;
          user-select: none;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .home-container:hover {
          transform: translateY(-4px) scale(1.35);
          filter: drop-shadow(0 15px 30px ${activeGlow}33);
        }
        .home-svg.cozy { animation: homeCozy 1.5s cubic-bezier(0.34,1.56,0.64,1); }
        .cozy-sparkle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: cozySparkle 1.2s ease-out forwards;
          box-shadow: 0 0 6px currentColor;
        }
        .chimney-smoke { animation: chimneySmoke 2s ease-out infinite; }
      `}</style>

      <div
        className={`home-container ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cozy sparkles */}
        {cozyEffects.map((effect) => {
          const radian = (effect.angle * Math.PI) / 180;
          const tx = Math.cos(radian) * effect.distance;
          const ty = Math.sin(radian) * effect.distance;

          return (
            <div
              key={effect.id}
              className="cozy-sparkle"
              style={{
                width: effect.size,
                height: effect.size,
                backgroundColor: effect.color,
                animationDelay: `${effect.delay}ms`,
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
              }}
            />
          );
        })}

        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`home-svg ${isAnimating ? "cozy" : ""}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="cozyGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
          </defs>

          <g filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))">
            {/* House body */}
            <rect
              x="5"
              y="9"
              width="14"
              height="12"
              fill={isHovered || isAnimating ? "#F8FAFC" : "#F1F5F9"}
              stroke={activeGlow}
              strokeWidth="2"
              rx="1"
            />
            {/* Roof */}
            <polygon
              points="12,3 4,9 20,9"
              fill={isHovered || isAnimating ? "#DC2626" : "#EF4444"}
              stroke="#B91C1C"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Chimney */}
            <rect x="15" y="5" width="2.5" height="4" fill="#6B7280" rx="0.3" />
            {/* Smoke */}
            {(isHovered || isAnimating) &&
              [0, 0.3, 0.6].map((delay, i) => (
                <circle
                  key={i}
                  cx={16 + i * 0.3}
                  cy={4 - i * 2}
                  r={1 + i * 0.2}
                  fill="#9CA3AF"
                  opacity={0.6 - i * 0.2}
                  className="chimney-smoke"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}

            {/* Door */}
            <rect
              x="10"
              y="15"
              width="4"
              height="6"
              fill="#92400E"
              stroke="#78350F"
              strokeWidth="1.5"
              rx="0.5"
            />
            <circle cx="13.2" cy="18" r="0.4" fill="#FCD34D" />

            {/* Windows */}
            {[6.5, 15].map((x, i) => (
              <rect
                key={i}
                x={x}
                y="12"
                width="2.5"
                height="2.5"
                fill={isHovered || isAnimating ? "#FEF3C7" : "#FDE68A"}
                stroke="#F59E0B"
                strokeWidth="1"
                rx="0.3"
                style={{
                  filter:
                    isHovered || isAnimating
                      ? "drop-shadow(0 0 8px #F59E0B)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}

            {/* Window details */}
            {[
              { x1: 7.75, y1: 12, x2: 7.75, y2: 14.5 },
              { x1: 6, y1: 13.25, x2: 9, y2: 13.25 },
              { x1: 16.25, y1: 12, x2: 16.25, y2: 14.5 },
              { x1: 15, y1: 13.25, x2: 17.5, y2: 13.25 },
            ].map((line, i) => (
              <line key={i} {...line} stroke="#F59E0B" strokeWidth="0.5" />
            ))}
          </g>

          {/* Welcome path */}
          <ellipse
            cx="12"
            cy="21.5"
            rx="4"
            ry="0.8"
            fill="#10B981"
            opacity={isHovered || isAnimating ? 0.8 : 0.6}
            style={{ transition: "opacity 0.3s ease" }}
          />
        </svg>
      </div>
    </>
  );
};

export default AnimatedHome;
