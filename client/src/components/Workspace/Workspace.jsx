import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';
import KonvaStage from '../KonvaStageV2';

import WorkspaceToolbar from './WorkspaceToolbar';
import { setSelectedIdx } from '../../utils/reducers/appSlice';
import Grid from '@mui/material/Grid';

export default function Workspace() {
  const { image_url, components } = useSelector((state) => state.designV2);
  const selectedIdx = useSelector((state) => state.app.selectedIdx);
  const dispatch = useDispatch();

  if (selectedIdx === components.length) dispatch(setSelectedIdx(null));

  const handleKeyPress = (e) => {
    if (e.altKey && e.keyCode === 87) {
      if (selectedIdx === null) dispatch(setSelectedIdx(0));
      else {
        dispatch(setSelectedIdx(Math.max(selectedIdx - 1, 0)));
      }
    }
    if (e.altKey && e.keyCode === 83) {
      if (selectedIdx === null) dispatch(setSelectedIdx(components.length - 1));
      else {
        dispatch(
          setSelectedIdx(Math.min(selectedIdx + 1, components.length - 1))
        );
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
      {/* <Box
        sx={{
          display: 'flex',
        }}
      >
        <DesignTitleInput />
      </Box> */}
      <Box
        gridColumn='span 12'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '10px',
          gap: '10px',
        }}>
        {selectedIdx !== null && components[selectedIdx] && (
          <WorkspaceToolbar
            rectangle={components[selectedIdx].rectangle}
            key={selectedIdx}
          />
        )}
      </Box>

      <Box gridColumn='span 2'>
        <WorkspaceLeft />
      </Box>
      <Box gridColumn='span 8' align-items='center'>
        {image_url && <KonvaStage userImage={image_url} />}
      </Box>
      <Box
        gridColumn='span 2'
        sx={{
          display: 'flex',

          justifyContent: 'center',
        }}>
        <WorkspaceRight />
      </Box>
    </Box>
  );
}
