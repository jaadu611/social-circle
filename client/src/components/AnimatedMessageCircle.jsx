import React, { useState, useEffect } from "react";

const AnimatedMessageCircle = ({ size = 24, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);
  const [messageLines, setMessageLines] = useState([]);

  useEffect(() => {
    // Create typing animation effect
    const lines = [
      { width: 8, delay: 0 },
      { width: 6, delay: 100 },
    ];
    setMessageLines(lines);
  }, []);

  const handleClick = (e) => {
    onClick?.(e);
    setIsAnimating(true);

    // Create particle burst
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      angle: i * 60 + Math.random() * 30,
      distance: 25 + Math.random() * 15,
      delay: Math.random() * 100,
      color: ["#10B981", "#34D399", "#6EE7B7"][Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 800);
  };

  return (
    <>
      <style>
        {`
          @keyframes messageTyping {
            0%, 100% { transform: scaleX(0.8); opacity: 0.6; }
            50% { transform: scaleX(1.1); opacity: 1; }
          }
          
          @keyframes messageBounce {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(-2deg); }
            50% { transform: scale(1.2) rotate(2deg); }
            75% { transform: scale(1.05) rotate(-1deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          @keyframes particleBurst {
            0% {
              opacity: 1;
              transform: translate(0, 0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0);
            }
          }
          
          @keyframes notificationPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
          }
          
          @keyframes backgroundPulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.2; }
          }
          
          .message-container {
            position: relative;
            transform: scale(1.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            border-radius: 50%;
          }
          
          .message-container:hover {
            transform: translateY(-3px) scale(1.25);
            filter: drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3));
          }
          
          .message-svg {
            transition: all 0.3s ease;
          }
          
          .message-svg.bounce {
            animation: messageBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .typing-line {
            animation: messageTyping 1.5s ease-in-out infinite;
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            pointer-events: none;
            animation: particleBurst 0.8s ease-out forwards;
          }
          
          .notification-dot {
            animation: notificationPulse 2s ease-in-out infinite;
          }
          
          .background-circle {
            animation: backgroundPulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div
        className={`message-container ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Particles */}
        {particles.map((particle) => {
          const radian = (particle.angle * Math.PI) / 180;
          const tx = Math.cos(radian) * particle.distance;
          const ty = Math.sin(radian) * particle.distance;

          return (
            <div
              key={particle.id}
              className="particle"
              style={{
                backgroundColor: particle.color,
                animationDelay: `${particle.delay}ms`,
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
              }}
            />
          );
        })}

        <svg
          width={size}
          height={size}
          viewBox="0 0 26 26"
          className={`message-svg ${isAnimating ? "bounce" : ""}`}
        >
          <defs>
            <linearGradient
              id="msgGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
          </defs>

          {/* Chat bubble with gradient */}
          <path
            d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H6l-4 4V6a2 2 0 012-2z"
            fill={
              isHovered ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"
            }
            stroke="url(#msgGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />

          {/* Animated background */}
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="url(#glowGradient)"
            className="background-circle"
          />

          {/* Chat bubble with gradient */}
          <path
            d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H6l-4 4V6a2 2 0 012-2z"
            fill={
              isHovered ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"
            }
            stroke="url(#msgGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "all 0.3s ease",
            }}
          />
        </svg>
      </div>
    </>
  );
};

export default AnimatedMessageCircle;
