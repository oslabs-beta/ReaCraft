import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BackupTableIcon from '@mui/icons-material/BackupTable';

import SideDrawer from './SideDrawer';
import UserMenu from './functionalButtons/UserMenu';
import DarkModeSwitch from './functionalButtons/DarkModeSwitch';

import { goToPage } from '../utils/reducers/appSlice';
import { resetDesign } from '../utils/reducers/designSliceV2';
import { useAuth } from '../hooks/useAuth';

export default function TopBar({ toggleDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  function handlePageClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }
  const { user } = useAuth();
  return (
    <AppBar position='static'>
      <Toolbar disableGutters={true}>
        <Button
          variant='contained'
          disableElevation
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <MenuIcon />
        </Button>
        <SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        <Typography>Reactraft</Typography>
        {user && <UserMenu />}
        <DarkModeSwitch toggleDarkMode={toggleDarkMode} />
        <Button
          variant='contained'
          disableElevation
          onClick={() => handlePageClick('HOME')}
        >
          <HomeIcon />
        </Button>
        <Button
          variant='contained'
          disableElevation
          onClick={() => handlePageClick('PAST_DESIGNS')}
        >
          <BackupTableIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
