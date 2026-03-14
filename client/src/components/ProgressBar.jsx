import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${progress}%` }}
      >
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
