import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Wedges';
    src: url('/fonts/Wedges.woff2') format('woff2'),
         url('/fonts/Sniglet-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Sniglet';
    src: url('/fonts/Sniglet-Regular.woff2') format('woff2'),
         url('/fonts/Sniglet-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'Sniglet', 'Wedges', 'Montserrat', 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4; 
    color: #4a4a4a;
  }

  html, body, #root {
    font-family: 'Sniglet', 'Wedges', 'Montserrat', 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #ffffff; /* Set background color to white */
    color: #333;
    height: 100%;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Wedges', 'Montserrat', 'Arial', sans-serif;
  }

  input, textarea {
    font-family: 'Sniglet', 'Arial', sans-serif;
  }
  button {
    font-family: 'Wedges', 'Arial', sans-serif;
  }
`;

export default GlobalStyle;


