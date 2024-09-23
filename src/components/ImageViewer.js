import React, { useEffect, useState, useRef } from 'react';
import { Slider, IconButton, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import ProgressOverlay from './ProgressOverlay';
import PropTypes from 'prop-types'; // Ajoute cette ligne

dayjs.extend(dayOfYear);

const requireImageLists = require.context('../data', false, /\.js$/);

const imageSets = requireImageLists.keys().reduce((sets, file) => {
  const name = file.replace('./', '').replace('.js', '');
  sets[name] = requireImageLists(file).default;
  return sets;
}, {});

const ImageViewer = ({ imageSet, startDate, endDate, autoplaySpeed }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const preloadedImages = useRef([]);

  useEffect(() => {
    const allImages = imageSets[imageSet] || [];

    if (allImages.length === 0) {
      console.error(`Aucun jeu d'images trouvé pour "${imageSet}"`);
      setLoadingProgress(100);
      setLoading(false);
      return;
    }

    const filteredImages = allImages.filter((url) => {
      const match = url.match(/(\d{8})/);
      if (match) {
        const dateStr = match[0];
        const year = parseInt(dateStr.slice(0, 4), 10);
        const dayOfYearNum = parseInt(dateStr.slice(4, 7), 10);
        const date = dayjs().year(year).dayOfYear(dayOfYearNum);
        return date.isAfter(startDate) && date.isBefore(endDate.add(1, 'day'));
      }
      return false;
    });

    setLoading(true);
    preloadedImages.current = [];
    const totalImages = filteredImages.length;

    if (totalImages === 0) {
      setLoadingProgress(100);
      setLoading(false);
    } else {
      filteredImages.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          preloadedImages.current[index] = img.src;
          setLoadingProgress(((index + 1) / totalImages) * 100);
          if (index === totalImages - 1) {
            setLoading(false);
            setImages(preloadedImages.current);
          }
        };
      });
    }
  }, [imageSet, startDate, endDate]);

  useEffect(() => {
    let timeoutId;
    if (isPlaying && images.length > 0) {
      const playImages = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        timeoutId = setTimeout(playImages, autoplaySpeed);
      };
      timeoutId = setTimeout(playImages, autoplaySpeed);
      return () => clearTimeout(timeoutId);
    }
  }, [isPlaying, images, autoplaySpeed]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box
      sx={{
        textAlign: 'center',
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto',
        marginTop: '50px',
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
            sx={{ width: '80%', margin: '20px auto', marginBottom: '0px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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

ImageViewer.propTypes = {
  imageSet: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(dayjs).isRequired,
  endDate: PropTypes.instanceOf(dayjs).isRequired,
  autoplaySpeed: PropTypes.number.isRequired,
};

export default ImageViewer;
