import React from 'react';
import ImageViewer from './components/ImageViewer';
import imageUrls from './data/images678'; // Assurez-vous que le chemin est correct

function App() {
  return (
    <div className="App">
      <h1>Image Viewer</h1>
      <ImageViewer images={imageUrls} />
    </div>
  );
}

export default App;
