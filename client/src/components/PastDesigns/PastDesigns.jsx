import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from '../Workspace/Workspace';
import { getDesigns } from '../../utils/fetchRequests';

export default function UserDesigns() {
  const [pastDesigns, setPastDesigns] = useState([]);
  const selectedDesign = useSelector((state) => state.designV2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const designs = await getDesigns();
        designs.sort((a, b) => a._id - b._id);
        setPastDesigns(designs);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [selectedDesign._id]);

  if (!selectedDesign._id) {
    return (
      <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={2}>
        {pastDesigns.map((design) => (
          <DesignCard design={design} key={design._id} />
        ))}
      </Box>
    );
  } else {
    return <Workspace />;
  }
}
