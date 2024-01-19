import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import PastDesigns from './PastDesigns/PastDesigns';
import { Container } from '@mui/material';
import HomePageSearch from './HomePageSearch';

export default function Home() {
  const { user } = useAuth();
  const selectedDesignId = useSelector((state) => state.designV2._id);
  if (user)
    return (
      <Container maxWidth='false'>
        {selectedDesignId ? null : <HomePageSearch />}
        {/* <HomePageSearch /> */}
        <PastDesigns />
      </Container>
    );
}
