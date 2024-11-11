import React, { useState } from "react";

const TextLessMore = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="content-container">
      <p
        className={`content-text mb-0 ${!isExpanded ? "text-truncate" : ""}`}
        style={{ maxHeight: isExpanded ? "none" : "4rem", overflow: "hidden" }}
        dir="rtl"
      >
        {text}
      </p>
      <button
        className="btn btn-link"
        onClick={toggleText}
        style={{ color: "black", padding: "0" }}
      >
        {isExpanded ? "פחות" : "עוד"}
      </button>
    </div>
  );
};

export default TextLessMore;
