import React, { useState } from "react";
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const API_URL = `https://homi-p50f.onrender.com`;// `http://localhost:3000`;

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '1rem',
  padding: '1rem',
  fontSize: '1rem',
  textTransform: 'none',
}));

const StartBlitzButton = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleStartBlitz = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const user = auth.currentUser;
  
        if (user) {
          try {
            // Set the user's "looking" status to true
            await updateDoc(doc(db, 'users', user.uid), {
              looking: true,
              location: { latitude, longitude },
            });
  
            const response = await enterMatchmaking({ userId: user.uid, location: { latitude, longitude } });
            if (response.success) {
              setMessage(`We've begun looking for your group! Check your email for updates.`);
              navigate('/matchmaking-started');
            } else {
              setMessage(`We haven't found any suitable matches for you. But we're looking!`);
              navigate('/matchmaking-started');
            }
          } catch (error) {
            console.error('Error starting matchmaking:', error);
            setMessage('An error occurred. Please try again.');
            await updateDoc(doc(db, 'users', user.uid), { looking: false });
            navigate('/matchmaking-error');
          }
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  

  const enterMatchmaking = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/matchmaking/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error entering matchmaking:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <div>
      <StyledButton
        onClick={handleStartBlitz}
        variant="contained"
        color="secondary"
        fullWidth
      >
        Begin Searching
      </StyledButton>
      {message && <Typography variant="body1">{message}</Typography>}
    </div>
    );
  };
export default StartBlitzButton;





