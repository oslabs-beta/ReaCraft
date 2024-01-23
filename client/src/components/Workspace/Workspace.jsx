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
    <Box sx={{ flexGrow: 1 }} maxWidth='1500px' minWidth='1000px'>
      <Grid container spacing={1}>
        <Grid item xs={3} sx={{ paddingTop: 0 }}></Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            height: '50px',
            paddingTop: 0,
          }}>

          {selectedIdx !== null && components[selectedIdx] && (
            <WorkspaceToolbar
              rectangle={components[selectedIdx].rectangle}
              key={selectedIdx}
            />
          )}
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: 0 }}></Grid>
        <Grid item xs={3}>
          <WorkspaceLeft />
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          {image_url && <KonvaStage userImage={image_url} />}
        </Grid>
        <Grid item xs={1}>
          <WorkspaceRight />
        </Grid>
      </Grid>
    </Box>
  );
}
