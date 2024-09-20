import React, { useEffect, useState } from 'react';
import imageUrls678 from '../data/images678';
import imageUrls1808 from '../data/images1808';
import { Slider, IconButton, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import ProgressOverlay from './ProgressOverlay';

dayjs.extend(dayOfYear);

const ImageViewer = ({ imageSet, startDate, endDate }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(40);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allImages = imageSet === 'images678' ? imageUrls678 : imageUrls1808;

    const filteredImages = allImages.filter((url) => {
      const dateStr = url.match(/(\d{8})/)[0];
      const year = parseInt(dateStr.slice(0, 4), 10);
      const dayOfYearNum = parseInt(dateStr.slice(4, 7), 10);
      const date = dayjs().year(year).dayOfYear(dayOfYearNum);
      return date.isAfter(startDate) && date.isBefore(endDate.add(1, 'day'));
    });

    setLoading(true); 
    setImages(filteredImages);
    setCurrentIndex(0);
    
    const totalImages = filteredImages.length;
    filteredImages.forEach((_, index) => {
      setTimeout(() => {
        setLoadingProgress(((index + 1) / totalImages) * 100);
        if (index === totalImages - 1) {
          setLoading(false);
        }
      }, index * 100);
    });
  }, [imageSet, startDate, endDate]);

  useEffect(() => {
    if (isPlaying && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [isPlaying, images, autoplayInterval]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {loading ? (
        <ProgressOverlay progress={loadingProgress} />
      ) : (
        <>
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex}`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              width: '600px',
              maxHeight: '600px',
              objectFit: 'contain',
            }}
          />
          <Slider
            value={currentIndex}
            min={0}
            max={images.length - 1}
            onChange={(event, newValue) => setCurrentIndex(newValue)}
            sx={{ width: '80%', margin: '20px auto' }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <IconButton
              onClick={handlePlayPause}
              sx={{
                color: 'white',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ImageViewer;
