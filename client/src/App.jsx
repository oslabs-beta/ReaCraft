import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Cookies from 'js-cookie';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeLight, themeDark } from './styles/ThemeGlobal';
import Container from '@mui/material/Container';
import TopBar from './components/TopBar';
import MainContainer from './components/MainContainer';
import { useDispatch } from 'react-redux';
import { setMessage } from './utils/reducers/appSlice';

export default function App() {
  const sessionID = Cookies.get('sessionID');
  if (!sessionID) {
    window.location.href = '/home';
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


  const [darkMode, setDarkMode] = useState(true);

  const mode = window.localStorage.getItem('mode');
  const [darkMode, setDarkMode] = useState(Boolean(mode));
  const theme = darkMode ? themeDark : themeLight;
  if (!darkMode) window.localStorage.removeItem('mode');
  else window.localStorage.setItem('mode', 'dark');

  const toggleDarkMode = () => setDarkMode(!darkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container>
        <TopBar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
        <MainContainer
          sx={{
            position: 'absolute',
            top: '10%',
          }}
        />

      </Container>
    </ThemeProvider>
  );
}
