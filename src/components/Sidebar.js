import React, { useState, useEffect } from 'react';
import { Drawer, IconButton, Box, Divider, TextField, MenuItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import eventsData from '../data/events.json'; // Importation des événements

dayjs.locale('fr');

const Sidebar = ({ isOpen, onClose, onImageSetChange, dateRange = [null, null], setDateRange }) => {
  const [imageSet, setImageSet] = useState('images678');
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Nouveau state pour l'événement
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const handleImageSetChange = (event) => {
    setImageSet(event.target.value);
  };

  const handleEventChange = (event) => {
    const eventName = event.target.value;
    setSelectedEvent(eventName);

    if (eventName) {
      const selectedEventObj = eventsData.find((evt) => evt.name === eventName);
      if (selectedEventObj) {
        const newStartDate = dayjs(selectedEventObj.startDate, 'DDMMYYYY');
        const newEndDate = dayjs(selectedEventObj.endDate, 'DDMMYYYY');
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }
    } else {
      setStartDate(null);
      setEndDate(null);
    }
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
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            bgcolor: 'grey.900',
            color: 'white',
          }}
        >
          <h1>Paramètres</h1>
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
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="images678">Images 678</MenuItem>
            <MenuItem value="images1808">Images 1808</MenuItem>
          </TextField>

          {/* Sélecteur d'événement */}
          <TextField
            select
            label="Événement"
            value={selectedEvent || ''}
            onChange={handleEventChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="">Aucun événement</MenuItem>
            {eventsData.map((event) => (
              <MenuItem key={event.name} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Affichage conditionnel des datepickers */}
          {!selectedEvent && (
            <>
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
            </>
          )}

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
