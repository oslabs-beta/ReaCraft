import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';
import KonvaStage from '../KonvaStage';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import DesignTitleInput from '../userInputs/DesignTitleInput';
import UserImageUpload from '../functionalButtons/UserImageUploadButton';
import ViewKeyboardShortcut from '../functionalButtons/ViewKeyboardShortcut';

export default function Workspace() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const { image_url, _id, components } = useSelector((state) => state.designV2);
  if (selectedIdx === components.length) setSelectedIdx(null);

  const handleKeyPress = (e) => {
    if (e.key === 'w' || e.key === 'W') {
      if (selectedIdx === null) setSelectedIdx(0);
      else {
        setSelectedIdx(Math.max(selectedIdx - 1, 0));
      }
    }
    if (e.key === 's' || e.key === 'S') {
      if (selectedIdx === null) setSelectedIdx(components.length - 1);
      else {
        setSelectedIdx(Math.min(selectedIdx + 1, components.length - 1));
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedIdx]);

  return (
    <Box maxWidth='false' display='grid' gridTemplateColumns='repeat(12, 1fr)'>
      <Box
        gridColumn='span 12'
        sx={{ display: 'flex', justifyContent: 'center' }}>

        <DesignTitleInput />
        <UserImageUpload />
        <DeleteDesignButton designId={_id} />
        <ViewKeyboardShortcut />
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
        }}>
        <WorkspaceRight selectedIdx={selectedIdx} />
      </Box>
    </Box>
  );
}
