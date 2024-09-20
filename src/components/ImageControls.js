import React from 'react';
import { IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const ImageControls = ({ isPlaying, onPlayPause, currentIndex, onSliderChange, filteredImageUrls }) => {
  return (
    <div>
      <Slider
        value={currentIndex}
        onChange={onSliderChange}
        min={0}
        max={filteredImageUrls.length - 1}
        style={{ width: '80%', marginTop: '20px' }}
      />
      <IconButton onClick={onPlayPause} color="primary">
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </div>
  );
};

export default ImageControls;
