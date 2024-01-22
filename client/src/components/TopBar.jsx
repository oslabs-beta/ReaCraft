import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* MUI Material Imports */

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

/* MUI Icon Imports */
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import Padding from '@mui/icons-material';

import DarkModeSwitch from './functionalButtons/DarkModeSwitch';
import DeleteDesignButton from './functionalButtons/DeleteDesignButton';
import DesignTitleInput from './userInputs/DesignTitleInput';
import PanToolButton from './functionalButtons/PanHandButton';
import UserImageUpload from './functionalButtons/UserImageUploadButton';
import UserMenu from './functionalButtons/UserMenu';
import SideDrawer from './SideDrawer';
import ViewKeyboardShortcut from './functionalButtons/ViewKeyboardShortcut';
import { goToPage } from '../utils/reducers/appSlice';
import { resetDesign } from '../utils/reducers/designSliceV2';
import { useAuth } from '../hooks/useAuth';
import {
  AppBarButtonsStyleLight,
  AppBarButtonsStyleDark,
} from '../styles/ThemeGlobal';

export default function TopBar({
  toggleDarkMode,
  darkMode,
  drawerOpen,
  setDrawerOpen,
}) {
  const dispatch = useDispatch();
  function handlePageClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }

  const designId = useSelector((state) => state.designV2._id);

  const { user } = useAuth();
  const theme = useTheme();

  //GlobalTheme Light/Dark Mode Switch
  const AppBarButtonsStyle =
    theme.palette.mode === 'dark'
      ? AppBarButtonsStyleDark
      : AppBarButtonsStyleLight;

  function handlePageClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }

  return (
    <AppBar display='block' position='fixed' height='56px'>
      <Toolbar
        disableGutters={true}
        sx={{
          display: 'flex',
          height: '56px',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}>
          {!designId && (
            <Fragment>
              <Button
                variant='contained'
                size='large'
                disableElevation
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={AppBarButtonsStyle}>
                <MenuIcon />
              </Button>
              <SideDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
            </Fragment>
          )}
          <Typography fontSize='25px'>ReaCraft</Typography>
          <DesignTitleInput />
        </Box>
        <Tooltip title='Delete Current Project'>
          {/* <DeleteDesignButton designId={_id} /> */}
        </Tooltip>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}>
          <Button
            variant='contained'
            disableElevation
            onClick={() => handlePageClick('NEW_DESIGN')}
            sx={{
              ...AppBarButtonsStyle,
              backgroundColor: darkMode ? '#2a3f5a' : '#736c6c',
              color: '#e2e2d3',
              boxShadow: '1px 1px 5px white',
            }}
            startIcon={<AddPhotoAlternateIcon />}>
            New Design
          </Button>
          <PanToolButton />
          <ViewKeyboardShortcut
            sx={{ position: 'absolute', justifySelf: 'end' }}
          />
          <UserImageUpload height='64px' />
          <DarkModeSwitch
            size='xs'
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
          />

          <Tooltip title='Home Button'>
            <IconButton
              variant='contained'
              disableElevation
              onClick={() => handlePageClick('HOME')}
              width='30px'
              size='sm'>
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='User Settings Dropdown'>
            {user && <UserMenu />}
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
