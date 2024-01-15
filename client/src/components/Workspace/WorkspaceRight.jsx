import React from 'react';
import Box from '@mui/material/Box';
import ViewDomTreeButton from '../functionalButtons/ViewDomTreeButton';

export default function WorkspaceRight() {
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <ViewDomTreeButton />
    </Box>
  );
}
