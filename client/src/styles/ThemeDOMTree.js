import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);

export const themeDOMTreeLight = createTheme({
  // palette: {
  //   mode: 'light',
  //   primary: {
  //     main: '#729EA1',
  //     //if the following props are commented out -> React will auto calc
  //     // light: '#B5BD89',
  //     // dark: '#DFBE99',
  //     // contrastText: '#EC9192',
  //   },
  //   secondary: {
  //     main: '#DB5375',
  //   },
  // },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          m: '10',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#d9d0c7',
          color: '#333333',
          fontSize: '15px',
          height: `40px`,
          borderWidth: `6px`,
        },
      },
    },
    List: {
      styleOverrides: {
        root: {
          fontSize: 'small',
          fill: 'black',
          strokeWidth: '1',
          x: '0',
          y: '0',
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        size: 'sm',
      },
    },
  },
});

export const themeDOMTreeDark = createTheme({
  typography: {
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
