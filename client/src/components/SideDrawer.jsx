import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeIcon from '@mui/icons-material/Home';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import { goToPage } from '../utils/reducers/appSlice';
import { resetDesign } from '../utils/reducers/designSliceV2';

export default function SideDrawer({ drawerOpen, setDrawerOpen }) {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();

  function handleClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }
  return (
    <Drawer
      sx={{ width: 200 }}
      anchor='left'
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Button onClick={() => setDrawerOpen(false)}>
        <ChevronLeftIcon />
      </Button>
      <Divider />
      <Tabs
        orientation='vertical'
        variant='scrollable'
        onChange={(_, val) => setValue(val)}
        value={value}
        aria-label='Vertical tabs example'
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab
          icon={<AddPhotoAlternateIcon />}
          label='New Design'
          onClick={() => handleClick('NEW_DESIGN')}
        />
        <Tab
          icon={<HomeIcon />}
          label='Home'
          onClick={() => handleClick('HOME')}
        />
        <Tab
          icon={<BackupTableIcon />}
          label='Past Desgins'
          onClick={() => handleClick('PAST_DESIGNS')}
        />
      </Tabs>
    </Drawer>
  );
}
