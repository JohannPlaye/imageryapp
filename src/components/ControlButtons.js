import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const ControlButtons = ({ isPlaying, startPlay, stopPlay }) => {
  return (
    <div style={{ marginTop: '10px' }}>
      <IconButton onClick={isPlaying ? stopPlay : startPlay} color="primary">
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </div>
  );
};

export default ControlButtons;
