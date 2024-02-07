import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { toggleIsDraggable, setCursorMode } from '../../../utils/reducers/appSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material';

export default function ButtonPanHand() {
  const dispatch = useDispatch();
  const [selectedTool, setSelectedTool] = useState('default');
  const theme = useTheme();

  const handlePanToolClick = () => {
    dispatch(toggleIsDraggable(true));
    dispatch(setCursorMode('pan'));
    setSelectedTool('pan');
  };

  const handleCursorClick = () => {
    dispatch(toggleIsDraggable(false));
    dispatch(setCursorMode('default'));
    setSelectedTool('default');
  };

  return (
    // <Fragment>
    <div style={{ 
      display: 'flex', 
      backgroundColor: theme.palette.mode === 'light' ? '#B1B1B1' : '#8d8d8d', 
      borderRadius: '10px', 
      padding: '5px', 
      marginLeft: '.3rem', 
      marginRight: '.3rem',
    }}>
      <Tooltip title='Pan Tool Button'>
        <IconButton
          size='small'
          component='label'
          variant='contained'
          onClick={handlePanToolClick}
          style={{ backgroundColor: selectedTool === 'pan' ? (theme.palette.mode === 'light' ? '#E0E1DD' : '#c9cac6') : 'transparent', borderRadius: '4px' }}
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
          style={{ backgroundColor: selectedTool === 'default' ? (theme.palette.mode === 'light' ? '#E0E1DD' : '#c9cac6') : 'transparent', borderRadius: '4px' }}
        >
          <FontAwesomeIcon icon={faArrowPointer} />
        </IconButton>
      </Tooltip>
      </div>
    // </Fragment>
  );
}
