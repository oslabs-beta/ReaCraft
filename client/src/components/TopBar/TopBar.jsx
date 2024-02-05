import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* MUI Material Imports */

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Box, Stack, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';

/* MUI Icon Imports */
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import SwitchDarkMode from './SwitchDarkMode';
import ButtonUserMenu from './ButtonUserMenu';
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
import ButtonViewTree from '../functionality/Design/ButtonViewTree';
import { convertToTree } from '../../utils/treeNode';
import ButtonDownloadFiles from '../functionality/Design/ButtonDownloadFiles';
import ButtonAddCollab from '../functionality/Design/ButtonAddCollab';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function TopBar({ toggleDarkMode, darkMode, handleDrawerOpen }) {
  const dispatch = useDispatch();
  function handlePageClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }

  const { _id, pages, canEdit, user_id } = useSelector(
    (state) => state.designV3
  );
  const designId = _id;

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

  let tree = {};
  if (designId) {
    tree.name = 'App';
    tree.attributes = { tag: '<div>' };
    tree.children = pages.map((page) => convertToTree(page.components));
  }

  return (
    <AppBar
      display='block'
      position='fixed'
      height='56px'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        disableGutters={true}
        sx={{
          display: 'flex',
          height: '56px',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          '& .MuiButtonBase-root': {
            boxShadow: 'none',
          },
        }}
      >
        <Stack direction='row' alignItems='center'>
          {!designId && (
            <Fragment>
              <Button
                variant='contained'
                size='large'
                onClick={handleDrawerOpen}
                sx={{
                  ...AppBarButtonsStyle,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </Button>
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
                <Tooltip title='Back to home'>
                  <img
                    src='./assets/ReaCraft.png'
                    style={{
                      marginLeft: '20px',
                      width: 40,
                      height: 40,
                      color: '#736c6c',
                    }}
                  />
                </Tooltip>
              </Box>

              <InputDesignTitle />
              {canEdit && (
                <ButtonAddCollab
                  designId={designId}
                  ownerId={user._id}
                  ownerName={user.username}
                />
              )}
              <ButtonViewTree entireApp={true} tree={tree} />
              <ButtonDownloadFiles />
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
          {!designId && (
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
          )}
          <Divider orientation='vertical' flexItem />
          <ButtonKeyboardShortcut
            sx={{ position: 'absolute', justifySelf: 'end' }}
          />
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
