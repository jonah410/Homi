import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Button, Typography } from '@mui/material';
import '../../styles/auth.css';
import logo from '../../Logo.jpg'; // Ensure the logo path is correct

function AuthPage() {
  return (
    <Container maxWidth="sm" className="auth-container">
      <Box className="auth-box">
        <img src={logo} alt="Homi Logo" className="auth-logo" />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Homi!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Connect with people in real life based on shared interests.
        </Typography>
        <Box className="auth-buttons">
          <Button component={Link} to="/register" variant="contained" className="auth-button">
            Register
          </Button>
          <Button component={Link} to="/login" variant="contained" className="auth-button">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AuthPage;



