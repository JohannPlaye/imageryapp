import React from 'react';

const ImageContainer = ({ filteredImageUrls, currentIndex }) => {
  return (
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
  );
};

export default ImageContainer;
