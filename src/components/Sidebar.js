import React, { useState } from 'react';
import { Drawer, Box, Divider, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const Sidebar = ({ isOpen, onClose, onImageSetChange, dateRange = [null, null], setDateRange }) => {
  const [imageSet, setImageSet] = useState('images678');
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const handleImageSetChange = (event) => {
    setImageSet(event.target.value);
  };

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate ? dayjs(newStartDate) : null);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate ? dayjs(newEndDate) : null);
  };

  const handleValidation = () => {
    setDateRange([startDate, endDate]);
    onImageSetChange(imageSet);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{ width: 250, flexShrink: 0 }}
    >
      <Box sx={{ width: 250, bgcolor: 'background.paper' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            bgcolor: 'grey.900',
            color: 'white',
          }}
        >
          <h1>Paramètres</h1> {/* Suppression du bouton en forme de croix */}
        </Box>
        <Divider />
        <Box sx={{ padding: 2 }}>
          {/* Sélecteur de jeu d'images avec espacement ajouté */}
          <TextField
            select
            label="Jeu d'images"
            value={imageSet}
            onChange={handleImageSetChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ marginBottom: 2 }} // Espacement ajouté ici
          >
            <MenuItem value="images678">Images 678</MenuItem>
            <MenuItem value="images1808">Images 1808</MenuItem>
          </TextField>

          {/* Date de début */}
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={handleStartDateChange}
            open={openStart}
            onOpen={() => setOpenStart(true)}
            onClose={() => setOpenStart(false)}
            format="DD/MM/YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                onClick={() => setOpenStart(true)}
              />
            )}
          />

          {/* Espacement entre Date de début et Date de fin */}
          <Box sx={{ marginTop: 2 }}>
            <DatePicker
              label="Date de fin"
              value={endDate}
              onChange={handleEndDateChange}
              open={openEnd}
              onOpen={() => setOpenEnd(true)}
              onClose={() => setOpenEnd(false)}
              format="DD/MM/YYYY"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  onClick={() => setOpenEnd(true)}
                />
              )}
            />
          </Box>

          {/* Bouton Valider */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidation}
            sx={{ marginTop: 2, width: '100%' }}
          >
            Valider
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
