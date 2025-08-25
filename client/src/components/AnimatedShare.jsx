import React, { useState } from "react";

const AnimatedShare = ({ size = 28, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

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
            transition: all 0.3s ease;
          }
        `}
      </style>

      <div
        className={`share-container ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className="share-svg"
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

          {/* Main paper plane */}
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
