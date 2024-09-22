import React from 'react';

const ImageSet = ({ imageSet, onImageSetChange }) => {
  const handleChange = (event) => {
    onImageSetChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="image-set-select">Jeu d'images:</label>
      <select id="image-set-select" value={imageSet} onChange={handleChange}>
        <option value="geocolor678">Images 678</option>
        <option value="geocolor1808">Images 1808</option>
      </select>
    </div>
  );
};

export default ImageSet;
