import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { setMessage, setSelectedIdx } from '../../utils/reducers/appSlice';
import { deleteComponent } from '../../utils/reducers/designSliceV2';

export default function DeleteComponentButton({
  name,
  componentId,
  canDelete,
}) {
  const dispatch = useDispatch();
  const message = canDelete
    ? {
        severity: 'success',
        text: 'Successfully removed a component ' + name,
      }
    : {
        severity: 'error',
        text: `Component ${name} has children. Failed to remove`,
      };

  return (
    <Box sx={{ left: '100px' }}>
      <Tooltip title='Delete component'>
        <IconButton
          sx={{ left: '100px' }}
          onClick={() => {
            try {
              if (canDelete) {
                dispatch(deleteComponent(componentId));
              }
              dispatch(setMessage(message));
              dispatch(setSelectedIdx(null));
            } catch (error) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'Design: delete component ' + error,
                })
              );
            }
          }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
