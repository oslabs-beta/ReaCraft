import React, { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeIcon from '@mui/icons-material/Home';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import { goToPage } from '../../utils/reducers/appSlice';
import { resetDesign } from '../../utils/reducers/designSliceV3';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import { useTheme } from '@emotion/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

export default function SideDrawer({ drawerOpen, setDrawerOpen }) {
  const dispatch = useDispatch();
  const theme = useTheme();
 
  function handleClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }

  return (
    <Drawer
      anchor='left'
      variant='persistent'
      open={drawerOpen}
      sx={{
        width: drawerOpen ? 100 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 100,
          boxSizing: 'border-box',
          marginTop: '64px',
        },
      }}>
      <Divider />
      <Stack gap={2} sx={{ alignItems: 'center', marginTop: '15px' }}>
        <Tooltip title='New Design'>
          <Fab color='primary' onClick={() => handleClick('DESIGN')}>
            <AddPhotoAlternateIcon />
          </Fab>
        </Tooltip>
        <Tooltip title='Home'>
          <Fab
            color='primary'
            onClick={() => handleClick('HOME')}
            sx={{
              '& svg': {
                transform: 'scale(1.2)',
              },
            }}>
            <FontAwesomeIcon icon={faHouse} />
          </Fab>
        </Tooltip>
      </Stack>
    </Drawer>
  );
}
