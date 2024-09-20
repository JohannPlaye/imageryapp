import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingOverlay = ({ loadingProgress }) => {
  return (
    <div className="progress-overlay">
      <p className="progress-text">{Math.round(loadingProgress)}%</p>
      <CircularProgress
        variant="determinate"
        value={loadingProgress}
        size={100}
        thickness={5}
        style={{ color: 'rgb(126, 124, 150)' }}
      />
    </div>
  );
};

export default LoadingOverlay;
