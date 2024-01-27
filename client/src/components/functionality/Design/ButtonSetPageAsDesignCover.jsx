import React from 'react';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch } from 'react-redux';
import { updateDesignCoverOrTitleRequestAndUpdateState } from '../../../utils/reducers/designSliceV3';
import { setMessage } from '../../../utils/reducers/appSlice';

export default function ButtonSetPageAsDesignCover({ designId, imageUrl }) {
  const dispatch = useDispatch();
  console.log('imageUrl', imageUrl);
  return (
    <Tooltip
      title='Set Page as Design Cover'
      onClick={() => {
        try {
          dispatch(
            updateDesignCoverOrTitleRequestAndUpdateState({
              designId,
              imageUrl,
            })
          );
        } catch (error) {
          dispatch(
            setMessage({ severity: 'error', text: 'Set design cover failed' })
          );
        }
      }}
    >
      <Fab size='small'>
        <CenterFocusStrongIcon />
      </Fab>
    </Tooltip>
  );
}
