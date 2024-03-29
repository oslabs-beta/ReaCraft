import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceLeft from './WorkspaceLeft';
import WorkspaceRight from './WorkspaceRight';

import KonvaStage from '../../../functionality/KonvaCanvas/KonvaStageV2';
import Drawer from '@mui/material/Drawer';

import { setSelectedIdx } from '../../../../utils/reducers/appSlice';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material';

export default function Workspace() {
  const { pages } = useSelector((state) => state.designV3);
  const { selectedIdx, windowWidth, zoom, windowHeight, selectedPageIdx } =
    useSelector((state) => state.app);

  const { image_url } = pages[selectedPageIdx];
  const dispatch = useDispatch();
  const theme = useTheme();
  const components = pages[selectedPageIdx].components;
  const rootWidth = components[0].rectangle.width;
  const rootHeight = components[0].rectangle.height;
  const canvasMaxHeight = windowHeight - 180;
  const canvasMaxWidth = windowWidth - 350;

  let canvasHeight;
  let canvasWidth;
  let canvasRootRatio;

  canvasWidth = (canvasMaxWidth * zoom) / 100;
  canvasRootRatio = canvasWidth / rootWidth;
  canvasHeight = rootHeight * canvasRootRatio;

  if (canvasHeight > canvasMaxHeight) {
    canvasHeight = (canvasMaxHeight * zoom) / 100;
    canvasRootRatio = canvasHeight / rootHeight;
    canvasWidth = rootWidth * canvasRootRatio;
  }

  if (selectedIdx === components.length) dispatch(setSelectedIdx(null));

  const verticalRight = windowWidth - 350 > canvasWidth;

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
    <Box>
      <Drawer
        variant='permanent'
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '250px',
            marginTop: '100px',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.mode === 'light' ? '#2c2c2c' : '#f4f3f7',
          },
          '& .Mui-selected': {
            backgroundColor: '#d9d0c7 !important',
          },
        }}
        open>
        <WorkspaceLeft />
      </Drawer>
      <Grid
        container
        spacing={2}
        sx={{
          position: 'absolute',
          left: '250px',
          width: windowWidth - 270,
          paddingRight: '20px',
          minWidth: 800,
        }}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            height: '50px',
            paddingTop: 0,
          }}>
          {!verticalRight && <WorkspaceRight isVertical={false} />}
        </Grid>
        <Grid item xs sx={{ display: 'flex', justifyContent: 'center' }}>
          {image_url && (
            <KonvaStage
              userImage={image_url}
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}
              canvasRootRatio={canvasRootRatio}
            />
          )}
        </Grid>
        <Grid item xs='auto' sx={{ display: verticalRight ? 'block' : 'none' }}>
          <WorkspaceRight isVertical={true} />
        </Grid>
      </Grid>
    </Box>
  );
}
