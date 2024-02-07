import { createTheme } from '@mui/material/styles';

const root = {
  accent: '#d9d0c7',
  background: '#f4f3f7',
  text: '#2c2c2c',
  darkbackground: '#415a77',
  accentLogo: '#bdbbb6',
};

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
    color: root.accentLogo,
  },
  palette: {
    mode: 'light',
    primary: {
      main: root.accentLogo,
      dark: root.accent,
      light: root.accent,
    },
    secondary: {
      main: root.accentLogo,
    },
    background: {
      default: root.background,
      paper: root.accentLogo,
    },
    text: {
      primary: root.background,
      secondary: root.accentLogo,
    },
  },

  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: root.accentLogo,
        },
      },
    },

    // MuiListItemText: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiTypography-root': {
    //         // fontWeight: '800',
    //       },
    //     },
    //   },
    // },

    MuiTextField: {
      styleOverrides: {
        root: {
          '&.designTitle': {
            color: root.text,
            backgroundColor: root.background,
            // backgroundColor: 'transparent',
            borderRadius: '2px',
            boxShadow: '5px 5px 15px 0.5rem rgb(53, 53, 53)',
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

  MuiIconButton: {
    styleOverrides: {
      root: {
        '&.designTitle': {
          color: root.text,
          backgroundColor: root.text,
        },
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
      main: '#bdbbb6',
    },
    background: {
      default: '#415a77',
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
  color: '#787774',
  '&:hover': {
    backgroundColor: '#D9D0C7',
  }
};

export const AppBarButtonsStyleDark = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: '#F1F1ED',
};
