import { createTheme } from '@mui/material/styles';

const globalFont = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

export const themeLight = createTheme({
  typography: {
    // fontFamily: 'Avenir',
    fontFamily: "'Baloo Bhaijaan 2', cursive",
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#e0e1dd',
      dark: '#CACBC8',
      light: '#FCFFF1',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fefffb',
      paper: '#989897',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#D8D6D6',
    },
  },

  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#BBBBBB',
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontWeight: '800',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '&.designTitle': {
            backgroundColor: '#BBBBBB',
            // backgroundColor: 'transparent',
            borderRadius: '5px',
          },
        },
      },
    },
  },

  MuiToolbar: {
    disableGutters: 'true',
    styleOverrides: {
      root: {
        display: 'flex',
        flexDiretion: 'column',
        width: '100%',
      },
    },
  },
});

export const themeDark = createTheme({
  typography: {
    fontFamily: "'Baloo Bhaijaan 2', cursive",
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#e0e1dd',
      dark: '#80817f',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0d1b2a',
    },
    text: {
      primary: '#f1f1ed',
      secondary: 'rgba(197,197,199,0.6)',
    },
  },
});

export const AppBarButtonsStyleLight = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: '#736c6c',
};

export const AppBarButtonsStyleDark = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: '#E0E1DD',
};
