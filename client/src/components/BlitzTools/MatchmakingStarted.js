// client/src/components/MatchmakingStarted.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MatchmakingStarted = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <Typography variant="h4" gutterBottom>
        Matchmaking Started
      </Typography>
      <Typography variant="body1" paragraph>
        We have begun looking for your group! You will receive an email notification once a group is found.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/home')}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default MatchmakingStarted;
