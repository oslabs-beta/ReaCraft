import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import { toggleIsDraggable, setCursorMode } from '../../utils/reducers/designSliceV2';

export default function PanToolButton() {
  const dispatch = useDispatch();

  const handlePanToolClick = () => {
    dispatch(toggleIsDraggable(true));
    dispatch(setCursorMode('pan'));
  };

  const handleCursorClick = () => {
    dispatch(toggleIsDraggable(false));
    dispatch(setCursorMode('default'));
  }

  return (
    <Fragment>
      <Tooltip title='Pan Tool Button'>
        <IconButton 
          size='small' 
          component='label' 
          variant='contained'
          onClick={handlePanToolClick}>
          <PanToolRoundedIcon size='sm' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Cursor'>
        <IconButton 
        size='small' 
        component='label' 
        variant='contained'
        onClick={handleCursorClick}>
          <NearMeRoundedIcon size='sm' />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
}
