import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../utils/reducers/appSlice';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { deletePageAndUpdateSelectedPageIdx } from '../../../utils/reducers/designSliceV3';

export default function ButtonDeletePage({ pageId, canDelete }) {
  const dispatch = useDispatch();
  console.log('canDelete', canDelete);
  return (
    <Tooltip title='Delete Page'>
      <Fab
        size='small'
        onClick={() => {
          if (canDelete) {
            try {
              dispatch(deletePageAndUpdateSelectedPageIdx(pageId));
            } catch (error) {
              dispatch(
                setMessage({ severity: 'error', text: 'Delete page ' + error })
              );
            }
          } else {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'Cannot delete the only page',
              })
            );
          }
        }}
        color='error'
      >
        <Delete />
      </Fab>
    </Tooltip>
  );
}
