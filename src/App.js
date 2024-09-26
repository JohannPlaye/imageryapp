import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Sidebar from './components/Sidebar';
import ImageViewer from './components/ImageViewer';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImageSet, setSelectedImageSet] = useState('geocolor678');
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'day'), dayjs()]);
  const [autoplaySpeed, setAutoplaySpeed] = useState(40); // Ajout de l'état pour la vitesse d'autoplay

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleImageSetChange = (newImageSet) => {
    console.log("Changement de jeu d'images :", newImageSet); // Log pour vérifier le changement de jeu d'images
    setSelectedImageSet(newImageSet);
  };

  const handleDateRangeChange = (newDateRange) => {
    console.log("Changement de plage de dates :", newDateRange); // Log pour vérifier le changement de plage de dates
    setDateRange(newDateRange);
  };

  const handleAutoplaySpeedChange = (newSpeed) => {
    console.log("Changement de vitesse d'autoplay :", newSpeed); // Log pour vérifier le changement de vitesse d'autoplay
    setAutoplaySpeed(newSpeed);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: 'black',
        }}
      >
        {/* Bouton "+" ou "x" */}
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1500,
          }}
        >
          <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
            {sidebarOpen ? <CloseIcon /> : <AddIcon />} {/* Affiche "+" ou "x" */}
          </IconButton>
        </Box>

        <ImageViewer
          imageSet={selectedImageSet}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          autoplaySpeed={autoplaySpeed} // Assurez-vous de transmettre la vitesse d'autoplay
        />

        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          onImageSetChange={handleImageSetChange}
          dateRange={dateRange}
          setDateRange={handleDateRangeChange}
          autoplaySpeed={autoplaySpeed} // Ajout de la vitesse d'autoplay
          setAutoplaySpeed={handleAutoplaySpeedChange} // Ajout de la fonction pour mettre à jour la vitesse
        />
      </Box>
    </LocalizationProvider>
  );
};

export default App;
