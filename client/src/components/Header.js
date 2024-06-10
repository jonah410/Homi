import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../Logo.jpg'; // Ensure the logo path is correct
import { styled } from '@mui/material/styles';

// Custom styled button
const CustomButton = styled(Button)(({ theme }) => ({
  color: '#00c6ff',
  fontFamily: 'Wedges, Arial, sans-serif',
  textTransform: 'none',
  fontSize: '1.25rem', // Increase font size
  padding: '10px 20px', // Increase padding
  marginRight: '10px',
  '&:hover': {
    backgroundColor: 'rgba(0, 198, 255, 0.1)', // Light blue hover effect
  },
}));

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#f4f4f4' }}>
      <Toolbar>
        <Box style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Homi" style={{ height: '60px', marginRight: '0px' }} />
          </Link>
        </Box>
        <nav>
          <CustomButton component={Link} to="/home">
            Home
          </CustomButton>
          <CustomButton component={Link} to="/profile">
            Profile
          </CustomButton>
          <CustomButton component={Link} to="/about">
            About
          </CustomButton>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;





