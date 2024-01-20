import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from '../Workspace/Workspace';
import { getDesigns } from '../../utils/fetchRequests';
import { Typography } from '@mui/material';

export default function UserDesigns() {
  const [pastDesigns, setPastDesigns] = useState([]);
  const selectedDesign = useSelector((state) => state.designV2);
  const searchTerm = useSelector((state) => state.designV2.searchTerm);
  const [localSelectedDesignId, setLocalSelectedDesignId] = useState(null);
  const selectedDesignId = useSelector((state) => state.designV2._id);

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

  // useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const designs = await getDesigns();
  //         setPastDesigns(designs.sort((a, b) => a._id - b._id));
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     if (!selectedDesignId) {
  //       fetchData();
  //     }
  // }, [selectedDesign._id]);

  // useEffect(() => {
  //   setLocalSelectedDesignId(selectedDesignId);
  // }, [selectedDesignId]);

  // ensures if there's no search term, all past designs are displayed OR when the user types in the search bar, only the designs whose titles match the search term are displayed
  const getFilteredDesigns = () => {
    if (!searchTerm) {
      return pastDesigns;
    }
    return pastDesigns.filter((design) =>
      design.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const visibleDesigns = getFilteredDesigns();

  // if (localSelectedDesignId) {
  //   return <Workspace />
  // }

  // if (selectedDesign._id) {
  //   return <Workspace />
  // };

  if (!selectedDesign._id) {
    return (
      <Box>
        <Typography 
        sx={{
          fontSize: "16", 
          color: "black",
          fontWeight: "bold",
          marginBottom: 2,
        }}
        >
          Recent designs
        </Typography>
        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={2}>
          {visibleDesigns.map((design) => ( // used pastDesigns here before
            <DesignCard design={design} key={design._id}
            setLocalSelectedDesignId={setLocalSelectedDesignId} />
          ))}
        </Box>
      </Box>
    );
  } else {
    return <Workspace />;
  }
}
