import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessage,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { addNewPage } from '../../../utils/reducers/designSliceV3';

export default function ButtonAddPage({ pageIdx }) {
  const { _id, pages } = useSelector((state) => state.designV3);
  const page = pages[pageIdx];
  console.log(page);
  const dispatch = useDispatch();
  return (
    <Tooltip title='Add Page'>
      <Fab
        size='small'
        onClick={() => {
          try {
            dispatch(
              addNewPage({
                designId: _id,
                body: {
                  pageIdx,
                  imageUrl: page.image_url,
                  imageHeight: page.components[0].rectangle.height,
                },
              })
            );
            // dispatch(setSelectedPageIdx(pageIdx + 1));
          } catch (error) {
            dispatch(
              setMessage({ severity: 'error', text: 'add new page ' + error })
            );
          }
        }}
        color='succuss'
      >
        <AddCircleRoundedIcon />
      </Fab>
    </Tooltip>
  );
}
