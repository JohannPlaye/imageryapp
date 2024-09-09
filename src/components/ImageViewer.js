import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import './ImageViewer.css';

const ImageViewer = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(null);

  // Fonction pour démarrer ou arrêter la lecture automatique
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Lecture automatique des images
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000); // Intervalles de 2 secondes
    } else {
      clearInterval(playRef.current);
    }

    return () => clearInterval(playRef.current);
  }, [isPlaying, images.length]);

  // Fonction pour gérer le changement d'index et le scroll dans la liste
  const handleSliderChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    setCurrentIndex(newIndex);
  };

  // Composant pour afficher une image unique
  const ImageItem = ({ index, style }) => (
    <div style={style} className="image-container">
      {index === currentIndex && (
        <img
          src={images[index]}
          alt={`Image ${index}`}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );

  return (
    <div>
      {/* Liste virtuelle pour le défilement des images */}
      <List
        height={500}
        itemCount={images.length}
        itemSize={500} // Taille d'une image
        width={500}
        scrollToIndex={currentIndex} // Assure le défilement à l'index actuel
      >
        {ImageItem}
      </List>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={images.length - 1}
        value={currentIndex}
        onChange={handleSliderChange}
        style={{ width: '100%', marginTop: '10px' }}
      />

      {/* Bouton de lecture */}
      <div className="controls">
        <button onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
