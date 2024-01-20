import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';
import KonvaStage from '../KonvaStageV2';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import UserImageUpload from '../functionalButtons/UserImageUploadButton';
import DesignTitleInput from '../userInputs/DesignTitleInput';
import ViewKeyboardShortcut from '../functionalButtons/ViewKeyboardShortcut';
import WorkspaceToolbar from './WorkspaceToolbar';

export default function Workspace() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const { image_url, _id, components } = useSelector((state) => state.designV2);
  if (selectedIdx === components.length) setSelectedIdx(null);

  const handleKeyPress = (e) => {
    if (e.altKey && e.keyCode === 87) {
      if (selectedIdx === null) setSelectedIdx(0);
      else {
        setSelectedIdx(Math.max(selectedIdx - 1, 0));
      }
    }
    if (e.altKey && e.keyCode === 83) {
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
    <Box maxWidth='false' display='flex'>
      <Box
        sx={{
          display: 'flex',
        }}>
        <DesignTitleInput />
      </Box>

      <Box
        gridColumn='span 12'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '10px',
          gap: '10px',
        }}>
        {selectedIdx !== null && (
          <WorkspaceToolbar
            rectangle={components[selectedIdx].rectangle}
            key={selectedIdx}
          />
        )}
      </Box>

      <Box gridColumn='span 2'>
        <WorkspaceLeft
          selectedIdx={selectedIdx}
          setSelectedIdx={setSelectedIdx}
        />
      </Box>

      <Box gridColumn='span 8' align-items='center'>
        {/* <img src={image_url} style={{ maxWidth: '100%' }} />
        {image_url && (
          <KonvaStage
            userImage={image_url}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
          />
        )} */}
      </Box>
      <Box
        gridColumn='span 2'
        sx={{
          display: 'flex',

          justifyContent: 'center',
        }}>
        <WorkspaceRight selectedIdx={selectedIdx} />
      </Box>
    </Box>
  );
}
