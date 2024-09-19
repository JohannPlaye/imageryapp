import React, { useState, useEffect, useRef } from 'react';
import { Slider, IconButton, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from './Sidebar';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'; // Importer le plugin dayOfYear
import './ImageViewer.css';

dayjs.extend(dayOfYear); // Activer le plugin dayOfYear

const ImageViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().subtract(2, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [imageSet, setImageSet] = useState('images678');
  const [filteredImageUrls, setFilteredImageUrls] = useState([]);
  const playRef = useRef(null);

  // Fonction pour démarrer l'autoplay
  const startPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImageUrls.length);
      }, 40); // Utiliser 40 ms pour l'autoplay
    }
  };

  // Fonction pour arrêter l'autoplay
  const stopPlay = () => {
    clearInterval(playRef.current);
    setIsPlaying(false);
  };

  // Fonction pour précharger les images
  const preloadImages = () => {
    if (filteredImageUrls.length === 0) return;

    console.log('Preloading images:', filteredImageUrls); // Log URLs to verify

    let loadedCount = 0;
    filteredImageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount += 1;
        setLoadingProgress((loadedCount / filteredImageUrls.length) * 100);
        if (loadedCount === filteredImageUrls.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = (error) => {
        console.error(`Failed to load image at ${url}`, error);
      };
    });
  };

  // Fonction pour charger les images
  const loadImages = async () => {
    try {
      const module = await import(`../data/${imageSet}`); // Charger dynamiquement le fichier correspondant
      const imageUrls = module.default;
  
      // Filtrer les images par date
      const filterImagesByDateRange = () => {
        const filteredImages = imageUrls.filter((url) => {
          const match = url.match(/\/(\d{4})(\d{3})(\d{2})(\d{2})_/);
          if (match) {
            const [_, year, dayOfYear, hour, minute] = match;
            const date = dayjs()
              .year(parseInt(year))
              .dayOfYear(parseInt(dayOfYear))
              .hour(parseInt(hour))
              .minute(parseInt(minute));
  
            return date.isBetween(startDate, endDate, null, '[]');
          }
          return false;
        });
  
        setFilteredImageUrls(filteredImages);
      };
  
      filterImagesByDateRange();
    } catch (error) {
      console.error('Error loading image set:', error);
    }
  };  

  useEffect(() => {
    // Réinitialiser les index et arrêter l'autoplay lors du changement de jeu d'images
    setCurrentIndex(0);
    setImagesLoaded(false);
    stopPlay();
    loadImages();
  }, [imageSet, startDate, endDate]);

  useEffect(() => {
    preloadImages();
  }, [filteredImageUrls]);

  // Gestion du changement du slider
  const handleSliderChange = (e, newValue) => {
    setCurrentIndex(newValue);
    if (isPlaying) stopPlay();
  };

  // Gestion de l'ouverture/fermeture de la sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Gestion du changement de date
  const handleDateChange = (type, date) => {
    if (type === 'start') setStartDate(date);
    if (type === 'end') setEndDate(date);
  };

  // Gestion du changement de jeu d'images
  const handleImageSetChange = (value) => {
    if (value !== imageSet) {
      setImageSet(value);
    }
  };  

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarToggle}
        onDateChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        onImageSetChange={handleImageSetChange}
        imageSet={imageSet}
      />

      {/* Bouton d'ouverture de la sidebar */}
      <IconButton
        onClick={handleSidebarToggle}
        style={{ position: 'fixed', top: '10px', left: '10px', color: 'white', zIndex: 1200 }}
      >
        <SettingsIcon />
      </IconButton>

      {/* Overlay de chargement */}
      {!imagesLoaded && (
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
      )}

      {/* Conteneur des images, rendu visible une fois le chargement terminé */}
      <div className="viewer-container" style={{ visibility: imagesLoaded ? 'visible' : 'hidden' }}>
        <div className="image-container">
          {filteredImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Slide ${index}`}
              className={`image-slide ${currentIndex === index ? 'active' : ''}`}
            />
          ))}
        </div>

        <Slider
          value={currentIndex}
          onChange={handleSliderChange}
          min={0}
          max={filteredImageUrls.length - 1}
          style={{ width: '80%', marginTop: '20px' }}
        />
        
        <div style={{ marginTop: '10px' }}>
          <IconButton onClick={isPlaying ? stopPlay : startPlay} color="primary">
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
