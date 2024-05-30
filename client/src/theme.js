// client/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#2e7d32', // Green
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    tertiary: {
      main: '#0277bd', // Purple
    },
  },
  typography: {
    h2: {
      fontWeight: 'bold',
    },
  },
});

export default theme;

