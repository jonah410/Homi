import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Sniglet, Wedges, Montserrat, Arial, sans-serif', // Include Sniglet
    h1: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
    },
    h2: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
    },
    h4: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
    },
    h5: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
    },
    h6: {
      fontFamily: 'Wedges, Montserrat, Arial, sans-serif',
    },
    body1: {
      fontFamily: 'Sniglet, Montserrat, Arial, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    body2: {
      fontFamily: 'Sniglet, Montserrat, Arial, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: '#00c6ff', // Light Blue
    },
    secondary: {
      main: '#ffffff', // White
    },
    tertiary: {
      main: '#545454', // Dark Gray
    },
  },
});

export default theme;


