import './App.css';
import React, { useState, useEffect } from 'react';
import ImageSlider from './components/ImageSlider';
import imageUrls from './data/images678'; // Importez la liste générée

const App = () => {
  const [images, setImages] = useState([]);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    setImages(imageUrls);
  }, []);

  const toggleAutoplay = () => {
    //setAutoplay(!autoplay);
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