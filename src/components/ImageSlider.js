// src/components/ImageSlider.js
import React from 'react';
import Slider from 'react-slick';

const ImageSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          <img src={img} alt={`slide-${index}`} style={{ width: '100%', height: 'auto' }} />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
