import { createTheme } from '@mui/material/styles';

export const WorkspaceLeftLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#BBBBBB',
          '&.Mui-selected': {
            '& .MuiListItemText-root': {
              color: '#415A77',
            },
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& .componentEditor': {
            color: '#415A77',
          },
        },
      },
    },
  },
});
