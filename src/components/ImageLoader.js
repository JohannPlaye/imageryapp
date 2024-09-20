import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const ImageLoader = ({ filteredImageUrls, setImagesLoaded }) => {
  useEffect(() => {
    const preloadImages = async () => {
      const promises = filteredImageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };

    if (filteredImageUrls.length > 0) {
      preloadImages();
    }
  }, [filteredImageUrls, setImagesLoaded]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <CircularProgress />
      <div style={{ color: 'white', marginTop: '20px' }}>Chargement des images...</div>
    </div>
  );
};

export default ImageLoader;
