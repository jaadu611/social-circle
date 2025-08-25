import React from "react";

const LogOutAnimated = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`group ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Log out"
    >
      {/* Door (static) */}
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

      {/* Arrow (animated) */}
      <path
        d="M22 17l5-5-5-5M27 12H9"
        className="transition-transform duration-300 ease-in-out group-hover:translate-x-2"
      />
    </svg>
  );
};

export default LogOutAnimated;
