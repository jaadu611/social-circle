import React from "react";

const Loading = ({ height = "100vh" }) => (
  <div
    style={{ height }}
    className="flex items-center justify-center"
    role="status"
    aria-busy="true"
  >
    <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loading;
