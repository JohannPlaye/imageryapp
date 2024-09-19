import React from 'react';
import { Drawer, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'; // Import de TextField
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Sidebar = ({
  isOpen,
  onClose,
  onDateChange,
  startDate,
  endDate,
  onImageSetChange,
  imageSet,
}) => {

  // Gestion du changement de jeu de données
  const handleImageSetChange = (event) => {
    const { value } = event.target; 
    onImageSetChange(value); // Passer la valeur correcte
  };
  

  const handleDateChange = (date, type) => {
    onDateChange(type, date);
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <div style={{ width: 300, padding: 20 }}>
        {/* Bouton de fermeture avec icône */}
        <IconButton onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        {/* Sélecteur de jeu d'images */}
        <FormControl fullWidth style={{ marginBottom: 20 }}>
          <InputLabel>Jeu d'images</InputLabel>
          <Select value={imageSet} onChange={handleImageSetChange}>
            <MenuItem value="images678">Images 678</MenuItem>
            <MenuItem value="images1808">Images 1808</MenuItem>
          </Select>
        </FormControl>

        {/* Sélection de la date */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={(date) => handleDateChange(date, 'start')}
            format="DD/MM/YYYY" // Spécifiez le format JJ/MM/AAAA
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="Date de fin"
            value={endDate}
            onChange={(date) => handleDateChange(date, 'end')}
            format="DD/MM/YYYY" // Spécifiez le format JJ/MM/AAAA
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </div>
    </Drawer>
  );
};

export default Sidebar;
