import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from '../Workspace/Workspace';
import { getDesigns } from '../../utils/fetchRequests';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { setMessage } from '../../utils/reducers/appSlice';

export default function UserDesigns() {
  const [pastDesigns, setPastDesigns] = useState([]);
  const selectedDesign = useSelector((state) => state.designV2);
  const searchTerm = useSelector((state) => state.designV2.searchTerm);
  const [localSelectedDesignId, setLocalSelectedDesignId] = useState(null);
  const selectedDesignId = useSelector((state) => state.designV2._id);
  const dispatch = useDispatch();

  const theme = useTheme();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const designs = await getDesigns();
        designs.sort((a, b) => a._id - b._id);
        setPastDesigns(designs);
      } catch (err) {
        dispatch(
          setMessage({
            severity: 'error',
            text: 'App: fetch past designs ' + err,
          })
        );
      }
    };

    fetchData();
  }, [selectedDesign._id]);

  const getFilteredDesigns = () => {
    if (!searchTerm) {
      return pastDesigns;
    }
    return pastDesigns.filter((design) =>
      design.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const visibleDesigns = getFilteredDesigns();

  if (!selectedDesign._id) {
    return (
      <Box>
        <Typography
          sx={{
            fontSize: '16',
            color: theme.palette.mode === 'light' ? 'black' : '#F5EBE0',
            fontWeight: 'bold',
            textShadow: '4px 3px 10px rgba(47, 47, 47, 0.124)',
            marginBottom: 2,
          }}
        >
          Recent designs
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {visibleDesigns.map(
            (
              design // used pastDesigns here before
            ) => (
              <Grid item xs={2} sm={4} md={3} key={design._id}>
                <DesignCard
                  design={design}
                  setLocalSelectedDesignId={setLocalSelectedDesignId}
                />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    );
  } else {
    return <Workspace />;
  }
}
