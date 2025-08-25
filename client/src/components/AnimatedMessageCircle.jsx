import React, { useState } from "react";

const AnimatedMessageCircle = ({ size = 140, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  // scale factor for internal elements
  const scale = size / 90;

  return (
    <>
      <style>
        {`
          .icon-container {
            display: inline-flex;
            align-items: center;
            transform: scale(1.3);
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease, filter 0.3s ease;
            user-select: none;
          }

          .icon-container:hover {
            transform: translateY(-4px) scale(1.4);
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
          }

          .bubble {
            transition: all 0.3s ease;
          }

          .dot, .dot1, .dot2 {
            animation: floatDots 1s ease-in-out infinite;
          }

          .dot1 { animation-delay: 0.2s; }
          .dot2 { animation-delay: 0.4s; }

          @keyframes floatDots {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.7; }
            40% { transform: translateY(-4px); opacity: 1; }
          }
        `}
      </style>

      <div
        className={`icon-container ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width={size}
          height={size * 0.7}
          viewBox={`0 0 ${100 * scale} ${70 * scale}`}
          className="bubble"
        >
          {/* Background rectangle / bubble */}
          <rect
            x={5 * scale}
            y={5 * scale}
            width={90 * scale}
            height={60 * scale}
            rx={25 * scale}
            ry={25 * scale}
            fill={isHovered ? "#EFF6FF" : "#F3F4F6"}
            stroke="#3B82F6"
            strokeWidth={3 * scale}
          />

          {/* Tail */}
          <polygon
            points={`${25 * scale},${65 * scale} ${40 * scale},${65 * scale} ${
              25 * scale
            },${75 * scale}`}
            fill={isHovered ? "#EFF6FF" : "#F3F4F6"}
            stroke="#3B82F6"
            strokeWidth={3 * scale}
          />

          {/* Activity dots */}
          <circle
            cx={40 * scale}
            cy={35 * scale}
            r={5 * scale}
            fill="#3B82F6"
            className="dot"
          />
          <circle
            cx={50 * scale}
            cy={35 * scale}
            r={5 * scale}
            fill="#3B82F6"
            className="dot1"
          />
          <circle
            cx={60 * scale}
            cy={35 * scale}
            r={5 * scale}
            fill="#3B82F6"
            className="dot2"
          />
        </svg>
      </div>
    </>
  );
};

export default AnimatedMessageCircle;
