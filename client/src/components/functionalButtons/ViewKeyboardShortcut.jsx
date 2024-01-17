import React, { Fragment, useState } from 'react';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import BackdropSnackbar from './BackdropSnackbar';
import Backdrop from '@mui/material/Backdrop';

import { TbSquareLetterT } from 'react-icons/tb';

export default function ViewKeyboardShortcut() {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Tooltip title='View keyboard shortcuts'>
        <IconButton onClick={() => setOpen(true)}>
          <KeyboardIcon />
        </IconButton>
      </Tooltip>
      <BackdropSnackbar open={open} setOpen={setOpen} />

      <ShortcutBackdrop open={open} setOpen={setOpen} />
    </Fragment>
  );
}

function ShortcutBackdrop({ open, setOpen }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff4D',
      }}
      open={open}
      onDoubleClick={() => setOpen(false)}
    ></Backdrop>
  );
}
