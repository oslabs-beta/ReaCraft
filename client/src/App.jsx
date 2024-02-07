import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Cookies from 'js-cookie';
import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeLight, themeDark } from './styles/ThemeGlobal.js';
import TopBar from './components/TopBar/TopBar';
import MainContainer from './components/MainContainer/MainContainer';
import { useDispatch, useSelector } from 'react-redux';
import { goToPage, setMessage, setWindowSize } from './utils/reducers/appSlice';
import ButtonBuyCoffee from './components/ButtonBuyCoffee';
import SideDrawer from './components/TopBar/SideDrawer';

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

  const error = useSelector((state) => state.designV3.error);
  if (error) {
    setMessage({
      severity: 'error',
      text: error,
    });
  }
  const { getUser } = useAuth();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { page } = useSelector((state) => state.app);
  const currentTheme = darkMode ? themeDark : themeLight;
  const { _id } = useSelector((state) => state.designV3);
  const [isWorkspaceReady, setIsWorkspaceReady] = useState(false);

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

  useEffect(() => {
    // close the SideDrawer if it's open before rendering the Workspace
    if (page === 'DESIGN' && _id && drawerOpen) {
      setDrawerOpen(false);
      // set a timeout to ensure the closing animation completes before rendering Workspace
      const transitionDuration = currentTheme.transitions ? currentTheme.transitions.duration.leavingScreen : 225;
      setTimeout(() => {
        // after the transition duration, set Workspace as ready
        setIsWorkspaceReady(true);
      }, transitionDuration);
    } else {
      // if not 'DESIGN' or _id is not present, workspaceReady is false
      setIsWorkspaceReady(false);
    }
  }, [page, drawerOpen, _id, currentTheme.transitions]);

  // toggle drawer function
  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const mode = window.localStorage.getItem('mode');
  const [darkMode, setDarkMode] = useState(Boolean(mode));
  const theme = darkMode ? themeDark : themeLight;
  if (!darkMode) window.localStorage.removeItem('mode');
  else window.localStorage.setItem('mode', 'dark');

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        drawerOpen={drawerOpen}
        handleDrawerOpen={handleDrawerOpen}
      />
      <SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Main open={drawerOpen}>
        <MainContainer
          isWorkspaceReady={isWorkspaceReady}
          sx={{
            top: '10%',
          }}
        />
        <ButtonBuyCoffee />
      </Main>
    </ThemeProvider>
  );
}
