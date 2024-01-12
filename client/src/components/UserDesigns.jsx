import { Box } from '@mui/material';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from './Workspace';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function UserDesigns() {
  const userDesigns = useSelector((state) => state.app.userDesigns);
  console.log('userDesigns in userDesigns', userDesigns);
  const designId = useSelector((state) => state.design)._id;
  const design = userDesigns.filter((item) => {
    console.log(item);
    return item._id === designId;
  })[0];

  console.log(userDesigns);

  if (!designId) {
    return (
      <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={2}>
        {userDesigns.map((design) => (
          <DesignCard design={design} key={design._id} />
        ))}
      </Box>
    );
  } else
    return (
      <Fragment>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <TextField name='title' label='Title' defaultValue={design.title} />
          <Typography>created_at: {design.created_at}</Typography>
        </Box>
        <Workspace />
      </Fragment>
    );
}
