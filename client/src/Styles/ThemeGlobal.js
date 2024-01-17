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
    fontFamily: globalFont,
    fontSize: 12,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#729EA1',
      //if the following props are commented out -> React will auto calc
      light: '#B5BD89',
      dark: '#DFBE99',
      contrastText: '#EC9192',
    },
    secondary: {
      main: '#DB5375',
    },
    info: {
      main: '#B118A2',
    },
    error: {
      main: '##DB5375',
    },
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application!
      },
    },
  },
});

export const themeDark = createTheme({
  typography: {
    fontFamily: globalFont,
    fontSize: 12,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#B5BD89',
      //if the following props are commented out -> React will auto calc
      light: '#B5BD89',
      dark: '#DFBE99',
      contrastText: '#EC9192',
    },
    secondary: {
      main: '#DB5375',
    },
    info: {
      main: '#B118A2',
    },
    error: {
      main: '##DB5375',
    },
  },
});
