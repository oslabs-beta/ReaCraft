import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { setMessage, setSelectedIdx } from '../../../utils/reducers/appSlice';
import { deleteComponent } from '../../../utils/reducers/designSliceV3';

export default function ButtonComponentDelete({
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
    <Box>
      <Tooltip title='Delete component'>
        <IconButton
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
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
