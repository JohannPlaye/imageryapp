import React, { useState } from 'react';
import { Drawer, Box, Divider, TextField, MenuItem, Button, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import eventsData from '../data/events.json'; // Importation des événements
import PropTypes from 'prop-types'; // Ajoute cette ligne pour PropTypes

dayjs.locale('fr');

const Sidebar = ({ isOpen, onClose, onImageSetChange, dateRange = [null, null], setDateRange, autoplaySpeed, setAutoplaySpeed }) => {
  const [imageSet, setImageSet] = useState('geocolor678');
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Nouveau state pour l'événement

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
    console.log("Validation appelée"); // Log pour vérifier si la validation est appelée
    console.log("Jeu d'images sélectionné :", imageSet); // Log pour vérifier l'imageSet sélectionné
    console.log("Plage de dates sélectionnée :", startDate, endDate); // Log pour vérifier les dates sélectionnées

    setDateRange([startDate, endDate]);
    onImageSetChange(imageSet);
    onClose();
  };

  const handleSpeedChange = (event, newValue) => {
    setAutoplaySpeed(newValue);
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
            <MenuItem value="geocolor678">Geocolor 678</MenuItem>
            <MenuItem value="geocolor1808">Geocolor 1808</MenuItem>
            <MenuItem value="nearIRCirrus678">Near IR Cirrus 678</MenuItem>
            <MenuItem value="nearIRCirrus5424">Near IR Cirrus 5424</MenuItem>
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
                format="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                  />
                )}
              />

              <Box sx={{ marginTop: 2 }}>
                <DatePicker
                  label="Date de fin"
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </>
          )}

          {/* Slider pour la vitesse d'autoplay */}
          <Box sx={{ marginTop: 4 }}>
            <label>Vitesse de défilement (ms): {autoplaySpeed}</label>
            <Slider
              value={autoplaySpeed}
              min={10}
              max={2000}
              step={10}
              onChange={handleSpeedChange}
              sx={{ marginBottom: 4 }}
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

// Ajoute la validation des props
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImageSetChange: PropTypes.func.isRequired,
  dateRange: PropTypes.arrayOf(PropTypes.instanceOf(dayjs)),
  setDateRange: PropTypes.func.isRequired,
  autoplaySpeed: PropTypes.number.isRequired,
  setAutoplaySpeed: PropTypes.func.isRequired,
};

export default Sidebar;
