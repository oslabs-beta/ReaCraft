import React, { useDebugValue, useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Cookies from 'js-cookie';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import TopBar from './components/TopBar';
import MainContainer from './components/MainContainer';
import { getDesigns } from './utils/fetchRequests';
import { setUserDesigns } from './utils/reducers/appSlice';
import { useDispatch } from 'react-redux';

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
        const designs = await getDesigns();
        console.log(designs);
        dispatch(setUserDesigns(designs));
      } catch (error) {
        console.error('Error fetching user data:', error);
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
