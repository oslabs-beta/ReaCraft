import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import {
  toggleIsDraggable,
  setCursorMode,
} from '../../../utils/reducers/designSliceV3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faArrowPointer } from '@fortawesome/free-solid-svg-icons';

export default function ButtonPanHand() {
  const dispatch = useDispatch();

  const handlePanToolClick = () => {
    dispatch(toggleIsDraggable(true));
    dispatch(setCursorMode('pan'));
  };

  const handleCursorClick = () => {
    dispatch(toggleIsDraggable(false));
    dispatch(setCursorMode('default'));
  };

  return (
    <Fragment>
      <Tooltip title='Pan Tool Button'>
        <IconButton
          size='small'
          component='label'
          variant='contained'
          onClick={handlePanToolClick}
        >
          <FontAwesomeIcon icon={faHand} />
        </IconButton>
      </Tooltip>
      <Tooltip title='Cursor'>
        <IconButton
          size='small'
          component='label'
          variant='contained'
          onClick={handleCursorClick}
        >
          <FontAwesomeIcon icon={faArrowPointer} />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
}
