import React from 'react';
import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { useDispatch } from 'react-redux';
import { goToPage, resetStep } from '../utils/reducers/appSlice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';
import { resetDesign } from '../utils/reducers/designSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  function handleClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
    dispatch(resetStep());
  }
  if (user)
    return (
      //Box container below controlls margin size @ homepage
      <Box display='grid' margin='30px' gridTemplateColumns='1fr 1fr' gap={2}>
        <Typography variant='h4' gridColumn='span 2'>
          Welcome back, {user.username}
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => handleClick('NEW_DESIGN')}
        >
          New Design
        </Button>
        <Button
          variant='contained'
          startIcon={<BackupTableIcon />}
          onClick={() => handleClick('PAST_DESIGNS')}
        >
          Past Designs
        </Button>
      </Box>
    );
}
