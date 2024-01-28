import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedIdx,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export default function ButtonsPrevNextPage({ pageIdx }) {
  const pageLen = useSelector((state) => state.designV3.pages).length;
  const dispatch = useDispatch();
  const previousPage = (prev) => {
    dispatch(
      setSelectedPageIdx(
        prev ? Math.max(pageIdx - 1, 0) : Math.min(pageIdx + 1, pageLen - 1)
      )
    );
    dispatch(setSelectedIdx(null));
  };
  return (
    <Fragment>
      <Tooltip title='Previous Page'>
        <Fab size='small' onClick={() => previousPage(true)}>
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Tooltip>
      <Tooltip title='Next Page' onClick={() => previousPage(false)}>
        <Fab size='small'>
          <KeyboardArrowDownRoundedIcon />
        </Fab>
      </Tooltip>
    </Fragment>
  );
}
