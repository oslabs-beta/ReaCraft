import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPageIdx } from '../../../utils/reducers/appSlice';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function ButtonsPrevNextPage({ pageIdx }) {
  const pageLen = useSelector((state) => state.designV3.pages).length;
  console.log('current page', pageIdx, 'pageLen', pageLen);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <Tooltip title='Previous Page'>
        <Fab
          size='small'
          onClick={() => dispatch(setSelectedPageIdx(Math.max(pageIdx - 1, 0)))}
        >
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Tooltip>
      <Tooltip
        title='Next Page'
        onClick={() =>
          dispatch(setSelectedPageIdx(Math.min(pageIdx + 1, pageLen - 1)))
        }
      >
        <Fab size='small'>
          <KeyboardArrowDownRoundedIcon />
        </Fab>
      </Tooltip>
    </Fragment>
  );
}
