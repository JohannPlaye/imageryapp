import './App.css';
import React, { useState, useEffect } from 'react';
import ImageSlider from './components/ImageSlider';

const App = () => {
  const [images, setImages] = useState([]);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    // Remplacez ce tableau par la liste des images que vous obtenez depuis le backend
    const imageUrls = [
      'src/images/noaa/geocolor/10848/20242421250_GOES16-ABI-FD-GEOCOLOR-10848x10848.jpg',
      'src/images/noaa/geocolor/10848/20242421300_GOES16-ABI-FD-GEOCOLOR-10848x10848.jpg',
      // Ajoutez d'autres images
    ];
    setImages(imageUrls);
  }, []);

  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
  };

  return (
    <div className="App">
      <h1>Image Viewer</h1>
      <ImageSlider images={images} />
      <button onClick={toggleAutoplay}>
        {autoplay ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default App;