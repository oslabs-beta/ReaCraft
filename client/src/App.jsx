import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Cookies from 'js-cookie';
import { ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeLight, themeDark } from './styles/ThemeGlobal';
import TopBar from './components/TopBar';
import MainContainer from './components/MainContainer';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setWindowSize } from './utils/reducers/appSlice';
import Fab from '@mui/material/Fab';
import FreeBreakfastRoundedIcon from '@mui/icons-material/FreeBreakfastRounded';
import BuyMeCoffee from './components/functionalButtons/BuyMeCoffee';

const drawerWidth = 100;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  })
);

export default function App() {
  const sessionID = Cookies.get('sessionID');
  if (!sessionID) {
    window.location.href = '/home';
    return;
  }

  const error = useSelector((state) => state.designV2.error);
  if (error) {
    setMessage({
      severity: 'error',
      text: error,
    });
  }
  const { getUser } = useAuth();
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);

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

  useEffect(() => {
    function handleResize() {
      dispatch(
        setWindowSize({ height: window.innerHeight, width: window.innerWidth })
      );
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mode = window.localStorage.getItem('mode');
  const [darkMode, setDarkMode] = useState(Boolean(mode));
  const theme = darkMode ? themeDark : themeLight;
  if (!darkMode) window.localStorage.removeItem('mode');
  else window.localStorage.setItem('mode', 'dark');

  const toggleDarkMode = () => setDarkMode(!darkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Main open={drawerOpen}>
        <TopBar
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />

        <MainContainer
          sx={{
            top: '10%',
          }}
        />
        <BuyMeCoffee />
      </Main>
    </ThemeProvider>
  );
}
