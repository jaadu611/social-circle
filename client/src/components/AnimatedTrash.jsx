import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedTrash = ({ size = 24, onClick, className = "" }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick?.();
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 1500); // reset after animation
  };

  // Variants for the lid + handle wobble
  const lidVariants = {
    rest: { rotate: 0, y: 0 },
    hover: { rotate: -20, y: -3 },
    delete: {
      rotate: [-20, -60, -30, -45],
      y: [-3, -12, -6, -15],
      transition: { duration: 1.2 },
    },
  };

  // Variants for body content lines
  const contentVariants = {
    rest: { y: 0, opacity: 1, scale: 1 },
    delete: {
      y: [0, -3, -8, -15],
      opacity: [1, 0.8, 0.4, 0],
      scale: [1, 0.9, 0.7, 0.3],
      transition: { duration: 1, delay: 0.3 },
    },
  };

  const containerSize = size * 1.5;

  return (
    <motion.div
      className={`inline-flex items-center justify-center cursor-pointer relative ${className}`}
      style={{ width: containerSize, height: containerSize }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient
            id="trashGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* Lid */}
        <motion.g
          variants={lidVariants}
          animate={isDeleting ? "delete" : isHovered ? "hover" : "rest"}
          style={{ originX: 0.5, originY: 1 }}
        >
          <motion.rect
            x="3"
            y="4"
            width="18"
            height="2"
            rx="1"
            fill="url(#trashGradient)"
          />
          <motion.rect
            x="10"
            y="2"
            width="4"
            height="2"
            rx="1"
            fill="url(#trashGradient)"
          />{" "}
          {/* handle */}
        </motion.g>

        {/* Body */}
        <motion.path
          d="M5 7L6 20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20L19 7H5Z"
          fill="rgba(239,68,68,0.1)"
          stroke="url(#trashGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Content lines */}
        <motion.g
          variants={contentVariants}
          animate={isDeleting ? "delete" : "rest"}
        >
          <motion.line
            x1="10"
            y1="11"
            x2="10"
            y2="17"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <motion.line
            x1="14"
            y1="11"
            x2="14"
            y2="17"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Deletion particles */}
        <AnimatePresence>
          {isDeleting &&
            [...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              return (
                <motion.circle
                  key={i}
                  r="1.5"
                  fill="#EF4444"
                  initial={{ cx: 12, cy: 14, opacity: 1, scale: 1 }}
                  animate={{
                    cx: 12 + Math.cos(angle) * 20,
                    cy: 14 + Math.sin(angle) * 20,
                    opacity: 0,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
        </AnimatePresence>
      </motion.svg>
    </motion.div>
  );
};

export default AnimatedTrash;
