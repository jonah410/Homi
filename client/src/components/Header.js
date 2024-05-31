import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../Logo.jpg'; // Ensure the logo path is correct

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#0072ff' }}>
      <Toolbar>
        <Box style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Homi" style={{ height: '60px', marginRight: '0px' }} />
          </Link>
        </Box>
        <nav>
        <Button color="inherit" component={Link} to="/home" style={{ marginRight: '10px' }}>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/profile" style={{ marginRight: '10px' }}>
          Profile
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



