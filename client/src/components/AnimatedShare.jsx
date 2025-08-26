import React, { useState } from "react";

const AnimatedShare = ({ size = 28, className = "", onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 700); // reset after flight
    if (onClick) onClick(e);
  };

  return (
    <>
      <style>
        {`
          .share-container {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: transform 0.15s ease, filter 0.3s ease;
          }

          .share-container:hover {
            transform: translateY(-2px) scale(1.1);
            filter: drop-shadow(0 6px 15px rgba(16,185,129,0.3));
          }

          .share-svg {
            transition: transform 0.3s ease;
          }

          .share-hover {
            animation: wiggle 0.4s ease-in-out infinite;
          }

          .share-clicked {
            animation: flightCurve 0.7s cubic-bezier(0.25, 0.8, 0.4, 1) forwards;
          }

          @keyframes wiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
            75% { transform: rotate(-3deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes flightCurve {
  0% {
    transform: translate(0,0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(70px,-50px) rotate(-25deg) scale(0.9);
    opacity: 0;
  }
}
          }
        `}
      </style>

      <div
        className={`share-container ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label="Share post"
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`share-svg ${
            isClicked ? "share-clicked" : isHovered ? "share-hover" : ""
          }`}
        >
          <defs>
            <linearGradient
              id="shareGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Paper plane */}
          <polygon
            points="3,21 21,12 3,3 8,12 3,21"
            fill="rgba(16,185,129,0.2)"
            stroke="url(#shareGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="3"
            y1="3"
            x2="12.4"
            y2="12.4"
            stroke="url(#shareGradient)"
            strokeWidth="1.2"
          />
          <line
            x1="12"
            y1="12"
            x2="4"
            y2="20"
            stroke="url(#shareGradient)"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </>
  );
};

export default AnimatedShare;
