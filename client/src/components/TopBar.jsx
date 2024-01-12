import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import UserMenu from './UserMenu';
import DarkModeSwitch from './DarkModeSwitch';
import SideDrawer from './SideDrawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar({ toggleDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
          <MenuIcon />
        </IconButton>
        <SideDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        <Typography>Reactraft</Typography>
        <UserMenu />
        <DarkModeSwitch toggleDarkMode={toggleDarkMode} />
      </Toolbar>
    </AppBar>
  );
}
