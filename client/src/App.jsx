import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Cookies from 'js-cookie';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import TopBar from './components/TopBar';
import MainContainer from './components/MainContainer';
import { useDispatch } from 'react-redux';
import { setMessage } from './utils/reducers/appSlice';

export default function App() {
  const sessionID = Cookies.get('sessionID');
  if (!sessionID) {
    window.location.href = '/login';
    return;
  }
  const { getUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error('Error fetching user data:', error);
        dispatch(
          setMessage({
            severity: 'error',
            text: 'Error fetching user data:' + error,
          })
        );
      }
    };
    fetchData();
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TopBar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <MainContainer />
      </Container>
    </ThemeProvider>
  );
}
