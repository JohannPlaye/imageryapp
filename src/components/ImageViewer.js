import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Slider, IconButton, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ProgressOverlay from './ProgressOverlay';
import PropTypes from 'prop-types';

dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Créer un cache en mémoire pour les images
const imageCache = new Map();

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

  // Log des props reçues
  useEffect(() => {
    console.log("Changement détecté dans ImageViewer :");
    console.log("Jeu d'images :", imageSet);
    console.log("Plage de dates :", startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    console.log("Vitesse d'autoplay :", autoplaySpeed);
  }, [imageSet, startDate, endDate, autoplaySpeed]);

  useEffect(() => {
    const allImages = imageSets[imageSet] || [];

    if (allImages.length === 0) {
      console.error(`Aucun jeu d'images trouvé pour "${imageSet}"`);
      setLoadingProgress(100);
      setLoading(false);
      return;
    }

    // Filtrage des images basées sur la plage de dates sans tri supplémentaire
    const filteredImages = allImages.filter((url) => {
      const match = url.match(/(\d{4})(\d{3})(\d{2})(\d{2})/); // Correspond à l'année, jour de l'année, heure, et minute
      if (match) {
        const year = parseInt(match[1], 10);
        const dayOfYear = parseInt(match[2], 10);

        // Créer un objet date basé sur l'année et le jour de l'année
        const imageDate = dayjs().set('year', year).dayOfYear(dayOfYear);

        // Comparer l'image avec la plage de dates sélectionnée
        return imageDate.isSameOrAfter(startDate, 'day') && imageDate.isSameOrBefore(endDate, 'day');
      }
      return false;
    });

    setLoading(true);
    preloadedImages.current = Array(filteredImages.length).fill(null); // Tableau vide pour stocker les images chargées
    const totalImages = filteredImages.length;

    const batchSize = 100;
    let batchIndex = 0;
    let loadedImagesCount = 0;

    const loadNextBatch = () => {
      const batchImages = filteredImages.slice(batchIndex, batchIndex + batchSize);

      batchImages.forEach((src, index) => {
        const actualIndex = batchIndex + index; // Conserver l'index exact de l'image

        if (imageCache.has(src)) {
          preloadedImages.current[actualIndex] = imageCache.get(src);
          loadedImagesCount += 1;
          setLoadingProgress(Math.min(100, (loadedImagesCount / totalImages) * 100));
          if (loadedImagesCount === totalImages) {
            setLoading(false);
            setImages([...preloadedImages.current]); // Mettez à jour une fois toutes les images chargées
          }
        } else {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            imageCache.set(src, img.src);
            preloadedImages.current[actualIndex] = img.src;
            loadedImagesCount += 1;
            setLoadingProgress(Math.min(100, (loadedImagesCount / totalImages) * 100));
            if (loadedImagesCount === totalImages) {
              setLoading(false);
              setImages([...preloadedImages.current]); // Mettez à jour une fois toutes les images chargées
            }
          };
        }
      });
      batchIndex += batchSize;
      if (batchIndex < filteredImages.length) {
        setTimeout(loadNextBatch, 200);
      }
    };

    if (totalImages === 0) {
      setLoadingProgress(100);
      setLoading(false);
    } else {
      loadNextBatch();
    }
  }, [imageSet, startDate, endDate]);

  useEffect(() => {
    let animationFrameId;
    let startTime;

    const playImages = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= autoplaySpeed) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        startTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(playImages);
    };

    if (isPlaying && images.length > 0) {
      animationFrameId = requestAnimationFrame(playImages);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, images, autoplaySpeed]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause]);

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
