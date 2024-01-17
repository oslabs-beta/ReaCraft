import React from 'react';
import UserImageUploadButton from './functionalButtons/UserImageUploadButton';
import Workspace from './Workspace/Workspace';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

export default function NewDesign() {
  const designId = useSelector((state) => state.designV2)._id;
  return designId ? (
    <Workspace />
  ) : (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        height: 100,
        alignItems: 'center',
      }}>
      <UserImageUploadButton />
    </Box>
  );
}
