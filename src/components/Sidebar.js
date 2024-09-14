import React from 'react';
import { Drawer, IconButton, FormControl, InputLabel, Select, MenuItem, Divider, Typography, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Sidebar = ({ isOpen, onClose, onImageSetChange, imageSet, startDate, endDate, onDateChange }) => {
  const handleDateChange = (newDate, isStartDate) => {
    if (isStartDate) {
      onDateChange('start', newDate);
    } else {
      onDateChange('end', newDate);
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
        },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Paramètres
        </Typography>
        <IconButton onClick={onClose} style={{ color: 'black' }}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
      <div style={{ padding: '16px' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="image-set-select-label">Choisir un jeu d'images</InputLabel>
          <Select
            labelId="image-set-select-label"
            value={imageSet}
            onChange={onImageSetChange}
            fullWidth
          >
            <MenuItem value="images678">Images 678</MenuItem>
            <MenuItem value="images1808">Images 1808</MenuItem>
          </Select>
        </FormControl>
        <Divider />
        <Typography variant="h6" style={{ margin: '16px 0' }}>
          Période
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <DatePicker
              label="Début"
              value={startDate}
              onChange={(newValue) => handleDateChange(newValue, true)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Fin"
              value={endDate}
              onChange={(newValue) => handleDateChange(newValue, false)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>
      </div>
    </Drawer>
  );
};

export default Sidebar;
