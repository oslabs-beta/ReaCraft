import React from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';
import KonvaStage from './KonvaStage';

export default function Workspace() {
  const userImage = useSelector((state) => state.design.userImage);
  return (
    <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' gap={2}>
      <Box gridColumn='span 2'>
        <WorkspaceLeft />
      </Box>
      <Box gridColumn='span 8' align-items='center'>
        {/* <img src={userImage} style={{ maxWidth: '100%' }} /> */}
        {userImage && <KonvaStage userImage={userImage} />}
      </Box>
      <Box gridColumn='span 2'>
        <WorkspaceRight />
      </Box>
    </Box>
  );
}
