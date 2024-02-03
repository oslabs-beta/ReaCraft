import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { toggleIsDraggable, setCursorMode } from '../../../utils/reducers/appSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faArrowPointer } from '@fortawesome/free-solid-svg-icons';

export default function ButtonPanHand() {
  const dispatch = useDispatch();
  const [selectedTool, setSelectedTool] = useState('default');

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
      backgroundColor: '#B1B1B1', 
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
          style={{ backgroundColor: selectedTool === 'pan' ? '#E0E1DD' : 'transparent', borderRadius: '4px' }}
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
          style={{ backgroundColor: selectedTool === 'default' ? '#E0E1DD' : 'transparent', borderRadius: '4px' }}
        >
          <FontAwesomeIcon icon={faArrowPointer} />
        </IconButton>
      </Tooltip>
      </div>
    // </Fragment>
  );
}
