import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error } = location.state || { error: 'An unknown error occurred' };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <Typography variant="h4" gutterBottom>
        Matchmaking Error
      </Typography>
      <Typography variant="body1" paragraph>
        {error}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
        Go Back Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
