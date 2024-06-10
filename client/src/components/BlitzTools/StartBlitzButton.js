import React, { useState } from "react";
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLoading } from '../../contexts/LoadingContext';

const API_URL = process.env.LOCAL_API_URL; // figure out the issues with .env at somepoint

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '1rem',
  padding: '1rem',
  fontSize: '1rem',
  textTransform: 'none',
  backgroundColor: '#00c6ff',
  color: '#fff',
  fontFamily: 'Wedges, Arial, sans-serif', // Ensure Wedges font
  '&:hover': {
    backgroundColor: '#0B9FB8',
  },
}));

const StartBlitzButton = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  const checkGeolocationPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      return permissionStatus.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'unknown';
    }
  };

  const handleStartBlitz = async () => {
    setDialogOpen(true);
  };

  const handleDialogClose = async (confirmed) => {
    setDialogOpen(false);
    if (!confirmed) return;

    const permissionState = await checkGeolocationPermission();

    if (permissionState === 'denied') {
      setMessage(`Location access denied. Please enable location services for this browser in your settings and try again.`);
      return;
    }

    if (navigator.geolocation) {
      showLoading();
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const user = auth.currentUser;

        if (user) {
          try {
            await updateLookingStatus(user.uid, true, { latitude, longitude });
            fetch(`https://homi-p50f.onrender.com/api/matchmaking/start`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.uid, location: { latitude, longitude } }),
            });

            setMessage(`We've begun looking for your group! Check your email for updates.`);
            navigate('/matchmaking-started');
          } catch (error) {
            console.error('Error starting matchmaking:', error);
            setMessage('An error occurred. Please try again.');
            await updateLookingStatus(user.uid, false);
            navigate('/matchmaking-error');
          } finally {
            hideLoading();
          }
        }
      }, (error) => {
        hideLoading();
        if (error.code === error.PERMISSION_DENIED) {
          setMessage('Location access is denied. Please enable location services in your browser settings and try again.');
        } else {
          setMessage('An error occurred while retrieving your location. Please try again.');
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const updateLookingStatus = async (userId, isLooking, location = {}) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        looking: isLooking,
        location: location,
      });

      /* we may implement this later to cut down search time: if (isLooking) {
        const lookingUserDocRef = doc(db, 'lookingUsers', userId);
        await setDoc(lookingUserDocRef, { userId });
      } else {
        const lookingUserDocRef = doc(db, 'lookingUsers', userId);
        await deleteDoc(lookingUserDocRef);
      }*/
    } catch (error) {
      console.error("Error updating looking status:", error);
      throw error;
    }
  };

  return (
    <Box>
      <StyledButton
        onClick={handleStartBlitz}
        variant="contained"
        color="secondary"
        fullWidth
      >
        Begin Searching
      </StyledButton>
      {message && <Typography variant="body1" color="error">{message}</Typography>}

      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Searching in Progress</DialogTitle>
        <DialogContent>
          <Typography>This process may take up to a minute or two, but we're working on making it faster!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartBlitzButton;









