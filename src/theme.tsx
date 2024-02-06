// styles/theme.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Define the color modes configurations
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Define the color palette for light and dark modes
const colors = {
  // Light mode colors
  light: {
    text: 'rgb(61, 0, 183)', // Example primary text color
    bg: 'white', // White background
    primary: 'rgb(61, 0, 183)', // Primary brand color
    // ... other colors for light mode
  },
  // Dark mode colors
  dark: {
    text: 'white', // White text for dark mode
    bg: 'black', // Black background for dark mode
    primary: 'rgb(61, 0, 183)', // Primary brand color stays the same
    // ... other colors for dark mode
  },
};

// Create the theme object
const theme = extendTheme({
  config,
  colors: {
    // Here you can add shared colors between light and dark modes
    // and reference colors.light or colors.dark in components based on the color mode
  },
  // Other theme customizations like fonts, components, etc.
  // ...
});

export default theme;
