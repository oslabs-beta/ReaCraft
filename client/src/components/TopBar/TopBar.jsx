import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* MUI Material Imports */

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Stack, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';

/* MUI Icon Imports */
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import SwitchDarkMode from './SwitchDarkMode';
import ButtonUserMenu from './ButtonUserMenu';
import SideDrawer from './SideDrawer';
import ButtonKeyboardShortcut from './ButtonKeyboardShortcut';

import InputDesignTitle from '../functionality/Design/InputDesignTitle_Topbar';
import ButtonPanHand from '../functionality/KonvaCanvas/ButtonPanHand';
import SliderZoom from '../functionality/KonvaCanvas/SliderZoom';

import { goToPage } from '../../utils/reducers/appSlice';
import { resetDesign } from '../../utils/reducers/designSliceV3';
import { useAuth } from '../../hooks/useAuth';
import {
  AppBarButtonsStyleLight,
  AppBarButtonsStyleDark,
} from '../../styles/ThemeGlobal';

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

  const designId = useSelector((state) => state.designV3._id);

  const { user } = useAuth();
  const theme = useTheme();

  //GlobalTheme Light/Dark Mode Switch
  const AppBarButtonsStyle =
    theme.palette.mode === 'dark'
      ? AppBarButtonsStyleDark
      : AppBarButtonsStyleLight;

  const logo =
    theme.palette.mode === 'light'
      ? './assets/logo_thickoutline_3.svg'
      : './assets/logo_tiny_mode_DarkMode.svg';

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
        }}
      >
        <Stack direction='row' alignItems='center'>
          {!designId && (
            <Fragment>
              <Button
                variant='contained'
                size='large'
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={AppBarButtonsStyle}
              >
                <MenuIcon />
              </Button>
              <SideDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
              <Typography fontSize='25px'>ReaCraft</Typography>
            </Fragment>
          )}
          {designId && (
            <Fragment>
              <Box
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handlePageClick('HOME')}
              >
                <img
                  src={logo}
                  style={{
                    marginLeft: '20px',
                    width: 40,
                    height: 40,
                    color: '#736c6c',
                  }}
                />
              </Box>

              <InputDesignTitle />
            </Fragment>
          )}
        </Stack>

        <Stack direction='row' alignItems='center'>
          {designId && (
            <Fragment>
              <SliderZoom />
              <Divider orientation='vertical' flexItem />
              <ButtonPanHand />
              <Divider orientation='vertical' flexItem />
            </Fragment>
          )}

          <Button
            variant='contained'
            onClick={() => handlePageClick('DESIGN')}
            sx={{
              ...AppBarButtonsStyle,
              backgroundColor: darkMode ? '#2a3f5a' : '#736c6c',
              color: '#e2e2d3',
              boxShadow: '1px 1px 5px white',
              margin: '0 5px',
            }}
            startIcon={<AddPhotoAlternateIcon />}
          >
            New Design
          </Button>
          <Divider orientation='vertical' flexItem />
          <ButtonKeyboardShortcut
            sx={{ position: 'absolute', justifySelf: 'end' }}
          />
          <Tooltip title='Home Button'>
            <IconButton
              variant='contained'
              onClick={() => handlePageClick('HOME')}
              width='30px'
              size='sm'
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation='vertical' flexItem />
          <SwitchDarkMode
            size='xs'
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
          />
          {user && <ButtonUserMenu />}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
