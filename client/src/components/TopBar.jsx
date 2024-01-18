import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';

import SideDrawer from './SideDrawer';
import UserMenu from './functionalButtons/UserMenu';
import DarkModeSwitch from './functionalButtons/DarkModeSwitch';

import { goToPage } from '../utils/reducers/appSlice';
import { resetDesign } from '../utils/reducers/designSliceV2';
import { useAuth } from '../hooks/useAuth';
import {
  AppBarButtonsStyleLight,
  AppBarButtonsStyleDark,
} from '../styles/ThemeGlobal';
import ViewKeyboardShortcut from './functionalButtons/ViewKeyboardShortcut';

export default function TopBar({ toggleDarkMode, darkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  function handlePageClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }
  const { user } = useAuth();
  const theme = useTheme();
  const AppBarButtonsStyle =
    theme.palette.mode === 'dark'
      ? AppBarButtonsStyleDark
      : AppBarButtonsStyleLight;
  return (
    <AppBar position='static'>
      <Toolbar
        disableGutters={true}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          <Button
            variant='contained'
            disableElevation
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={AppBarButtonsStyle}
          >
            <MenuIcon />
          </Button>
          <SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          <Typography>ReaCraft</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}>
          <DarkModeSwitch toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Tooltip title='Home'>
            <Button
              variant='contained'
              disableElevation
              onClick={() => handlePageClick('HOME')}
              sx={AppBarButtonsStyle}
            >
              <HomeIcon />
            </Button>
          </Tooltip>

          <Tooltip title='Past designs'>
            <Button
              variant='contained'
              disableElevation
              onClick={() => handlePageClick('PAST_DESIGNS')}
              sx={AppBarButtonsStyle}
            >
              <BackupTableIcon />
            </Button>
          </Tooltip>

          {user && <UserMenu />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
