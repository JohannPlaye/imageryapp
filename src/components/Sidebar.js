import React, { useState } from 'react';
import { Drawer, Box, Divider, TextField, MenuItem, Button, Slider, Typography, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import eventsData from '../data/events.json'; // Importation des événements
import imageSetsData from '../data/imageSets.json'; // Importation du fichier JSON des jeux d'images
import PropTypes from 'prop-types';
import './Sidebar.css';

dayjs.locale('fr');

const Sidebar = ({ isOpen, onClose, onImageSetChange, dateRange = [null, null], setDateRange, autoplaySpeed, setAutoplaySpeed }) => {
  const [imageSet, setImageSet] = useState('geocolor678');
  const [startDate, setStartDate] = useState(dateRange[0]);
  const [endDate, setEndDate] = useState(dateRange[1]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventLinks, setSelectedEventLinks] = useState([]);
  const [isEventSearch, setIsEventSearch] = useState(false); // État pour le switch "Rechercher un événement naturel"

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
        setSelectedEventLinks(selectedEventObj.links || []);
      }
    } else {
      setStartDate(null);
      setEndDate(null);
      setSelectedEventLinks([]);
    }
  };

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate ? dayjs(newStartDate) : null);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate ? dayjs(newEndDate) : null);
  };

  const handleValidation = () => {
    console.log("Validation appelée");
    console.log("Jeu d'images sélectionné :", imageSet);
    console.log("Plage de dates sélectionnée :", startDate, endDate);

    // Forcer la mise à jour des dates avec l'événement sélectionné
    if (isEventSearch && selectedEvent) {
      const selectedEventObj = eventsData.find((evt) => evt.name === selectedEvent);
      if (selectedEventObj) {
        const newStartDate = dayjs(selectedEventObj.startDate, 'DDMMYYYY');
        const newEndDate = dayjs(selectedEventObj.endDate, 'DDMMYYYY');
        setDateRange([newStartDate, newEndDate]); // Mettre à jour la plage de dates avec l'événement sélectionné
      }
    } else {
      setDateRange([startDate, endDate]); // Mettre à jour la plage de dates avec les sélecteurs
    }

    onImageSetChange(imageSet); // Mise à jour du jeu d'images
    onClose();
  };

  const handleSpeedChange = (event, newValue) => {
    setAutoplaySpeed(newValue);
  };

  const handleEventSearchToggle = (event) => {
    setIsEventSearch(event.target.checked);
    setSelectedEvent(null); // Réinitialiser l'événement sélectionné lorsque le switch est changé
  };

  const selectedImageSet = imageSetsData.find((set) => set.value === imageSet);

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
          {/* Sélecteur de jeu d'images avec données du fichier JSON */}
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
            {imageSetsData.map((set) => (
              <MenuItem key={set.value} value={set.value}>
                {set.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Lien externe pour le jeu d'image sélectionné */}
          {selectedImageSet && selectedImageSet.url && (
            <Box sx={{ marginBottom: 2 }}>
              <Typography sx={{ fontSize: '10px', color: 'grey.900' }}>
                Plus d&apos;informations sur ce jeu d&apos;images sur{' '}
                <a
                  href={selectedImageSet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-link"
                >
                  cette page
                </a>.
              </Typography>
            </Box>
          )}

          {/* Switch pour rechercher un événement naturel avec libellé aligné */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: '0.8rem', marginRight: 'auto' }} // Alignement à gauche
            >
              Rechercher un événement naturel
            </Typography>
            <Switch
              checked={isEventSearch}
              onChange={handleEventSearchToggle}
              sx={{ marginLeft: 'auto' }} // Alignement à droite
            />
          </Box>

          {/* Affichage conditionnel des événements ou des datepickers */}
          {isEventSearch ? (
            <>
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

              {/* Affichage des liens de l'événement sélectionné */}
              {selectedEventLinks.length > 0 && (
                <Box sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: '10px', color: 'grey.900' }}>
                    Pour plus d&apos;informations sur cet événement :
                  </Typography>
                  <Typography sx={{ fontSize: '10px', color: 'grey.900' }}>
                    {selectedEventLinks.map((link, index) => (
                      <span key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="custom-link"
                        >
                          {link.name}
                        </a>
                        {index < selectedEventLinks.length - 1 && ' - '}
                      </span>
                    ))}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
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

              {/* Date de fin */}
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
              min={30}
              max={1000}
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
