import { createTheme } from '@mui/material/styles';

const root = {
  accent: '#d9d0c7',
  background: '#f4f3f7',
  text: '#2c2c2c',
  darkbackground: '#415a77',
  accentLogo: '#bdbbb6',
};

export const WorkspaceLeftLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      secondary: root.text,
    },
    secondary: {
      main: '#415a77',
    },
    background: {
      default: root.text,
      paper: root.background,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderColor: root.text,
          backgroundColor: root.darkbackground,
          '&.Mui-selected': {
            '& .MuiListItemText-root': {
              color: root.text,
            },
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& .componentEditor': {
            color: '#415a77',
            backgroundColor: '#415a77',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#415a77',
          backgroundColor: '#415a77',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '& css-eysefw': {
            color: '#415a77',
            backgroundColor: '#415a77',
          },
        },
      },
    },
  },
});
