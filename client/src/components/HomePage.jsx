import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import PastDesigns from './PastDesigns/PastDesigns';
import { Container } from '@mui/material';
import HomePageSearch from './HomePageSearch';
import Box from '@mui/material/Box';

export default function Home() {
  const { user } = useAuth();
  const selectedDesignId = useSelector((state) => state.designV2._id);
  if (user)
    return (
      <Box width='1300px' display='flex' maxWidth='1300px'>
        <Container disableGutters={true}>
          {/* conditional rendering of HomPageSearch. if a design is selected, the search bar will not appear in the workspace */}
          {selectedDesignId ? null : <HomePageSearch />}
          <PastDesigns />
        </Container>
      </Box>
    );
}
