import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';
import KonvaStage from '../KonvaStage';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import DesignTitleInput from '../userInputs/DesignTitleInput';
import UserImageUpload from '../functionalButtons/UserImageUploadButton';

export default function Workspace() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const { image_url, _id } = useSelector((state) => state.designV2);
  return (
    <Box
      maxWidth='false'
      display='grid'
      gridTemplateColumns='repeat(12, 1fr)'
      marginTop='10px'
    >
      <Box
        gridColumn='span 12'
        sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
      >
        <DesignTitleInput />
        <UserImageUpload />
        <DeleteDesignButton designId={_id} />
      </Box>
      <Box gridColumn='span 2'>
        <WorkspaceLeft
          selectedIdx={selectedIdx}
          setSelectedIdx={setSelectedIdx}
        />
      </Box>
      <Box gridColumn='span 8' align-items='center'>
        {/* <img src={image_url} style={{ maxWidth: '100%' }} /> */}
        {image_url && (
          <KonvaStage
            userImage={image_url}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
          />
        )}
      </Box>
      <Box
        gridColumn='span 2'
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <WorkspaceRight selectedIdx={selectedIdx} />
      </Box>
    </Box>
  );
}
