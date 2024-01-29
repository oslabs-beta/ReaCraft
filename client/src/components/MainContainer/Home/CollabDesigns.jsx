import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import CardDesignDisplay from '../../functionality/Design/CardDesignDisplay';
import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { setMessage } from '../../../utils/reducers/appSlice';
import { useDispatch } from 'react-redux';
import { getCollabDesignsRequest } from '../../../utils/fetchRequests';

export default function CollabDesigns() {
  const [collabDesigns, setCollabDesigns] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collabDesigns = await getCollabDesignsRequest();
        setCollabDesigns(collabDesigns);
      } catch (err) {
        dispatch(
          setMessage({
            severity: 'error',
            text: 'fetching collab designs ' + err,
          })
        );
      }
    };
    fetchData();
  }, []);

  const theme = useTheme();
  if (collabDesigns.length > 0)
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
            marginTop: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: '16',
              color: theme.palette.mode === 'light' ? '#2B2B2B' : '#F5EBE0',
              fontWeight: 'bold',
            }}
          >
            Collaboration designs
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {collabDesigns.map(
            (
              design // used pastDesigns here before
            ) => (
              <Grid item xs={2} sm={4} md={3} key={design._id}>
                <CardDesignDisplay design={design} />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    );
}
