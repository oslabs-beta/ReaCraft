import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setMessage,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { deletePage } from '../../../utils/reducers/designSliceV3';

export default function ButtonDeletePage({ pageId, pageIdx }) {
  const dispatch = useDispatch();
  return (
    <Tooltip title='Delete Page'>
      <Fab
        size='small'
        onClick={() => {
          try {
            dispatch(deletePage(pageId));
            dispatch(setSelectedPageIdx(pageIdx - 1));
          } catch (error) {
            dispatch(
              setMessage({ severity: 'error', text: 'Delete page ' + error })
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
