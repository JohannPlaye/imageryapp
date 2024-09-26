import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';  // Utiliser le thème pour la couleur
import PropTypes from 'prop-types';  // Importation de PropTypes pour la validation

const ProgressOverlay = ({ progress }) => {
  const theme = useTheme();  // Récupérer le thème Material UI pour utiliser la couleur principale

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fond noir semi-transparent
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // S'assurer que l'overlay est au-dessus de tout
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px', // 2/3 de la hauteur de la page
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={200} // Taille du cercle
          thickness={4} // Épaisseur du cercle
          sx={{
            color: theme.palette.primary.main, // Appliquer la couleur principale du thème
            position: 'absolute',
          }}
        />
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: 'white',
            position: 'absolute',
          }}
        >
          Loading... {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  );
};

// Validation des props avec PropTypes
ProgressOverlay.propTypes = {
  progress: PropTypes.number.isRequired,  // Validation du prop "progress"
};

export default ProgressOverlay;
