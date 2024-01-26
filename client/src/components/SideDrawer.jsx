import React from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeIcon from '@mui/icons-material/Home';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import { goToPage } from '../utils/reducers/appSlice';
import { resetDesign } from '../utils/reducers/designSliceV3';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';

export default function SideDrawer({ drawerOpen, setDrawerOpen }) {
  const dispatch = useDispatch();

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
        },
      }}
    >
      <Button onClick={() => setDrawerOpen(false)} sx={{ height: '56px' }}>
        <ChevronLeftIcon />
      </Button>
      <Divider />
      <Stack gap={2} sx={{ alignItems: 'center', marginTop: '15px' }}>
        <Tooltip title='New Design'>
          <Fab color='primary' onClick={() => handleClick('NEW_DESIGN')}>
            <AddPhotoAlternateIcon />
          </Fab>
        </Tooltip>
        <Tooltip title='Home'>
          <Fab color='primary' onClick={() => handleClick('HOME')}>
            <HomeIcon />
          </Fab>
        </Tooltip>
      </Stack>
    </Drawer>
  );
}
