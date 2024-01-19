import React from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';
import PastDesigns from './PastDesigns/PastDesigns';
import { Container } from '@mui/material';

export default function Home() {
  const { user } = useAuth();
  const designId = useSelector((state) => state.designV2._id);
  if (user)
    return (
      <Container maxWidth='false'>
        <Box marginBottom='2vw'>
          {!designId && (
            <Typography variant='h3' gridColumn='span 2' color='text.disabled'>
              Welcome back, {user.username}!
            </Typography>
          )}
        </Box>
        <PastDesigns />
      </Container>
    );
}
