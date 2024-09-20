import React from 'react';
import { Slider, Box } from '@mui/material';

const ImageSlider = ({ currentImageIndex, images, setCurrentImageIndex }) => {
  const handleSliderChange = (event, newValue) => {
    setCurrentImageIndex(newValue);
  };

  return (
    <Box>
      <Slider
        value={currentImageIndex}
        min={0}
        max={images.length - 1}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
        style={{ position: 'fixed', bottom: 20, left: '10%', width: '80%' }} // Slider at the bottom
      />
    </Box>
  );
};

export default ImageSlider;
