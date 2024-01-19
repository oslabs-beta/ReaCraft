import React, { Fragment, useState } from 'react';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import BackdropSnackbar from './BackdropSnackbar';
import Backdrop from '@mui/material/Backdrop';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import {
  TbSquareLetterT,
  TbSquareLetterD,
  TbSquareLetterW,
  TbSquareLetterS,
} from 'react-icons/tb';

import '../../styles/keyboardShortcut.scss';

export default function ViewKeyboardShortcut() {
  const [open, setOpen] = useState(false);
  return (
    <Fragment
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
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
      onDoubleClick={() => setOpen(false)}>
      <List className='keyboard-shortcuts'>
        <ListItem className='shortcut'>
          <ListItemIcon>esc</ListItemIcon>
          <ListItemText>Exit full screen</ListItemText>
        </ListItem>

        <Shortcut
          icon={<TbSquareLetterT size='20px' />}
          text='Toggle view Dom tree'
        />

        <Shortcut icon={<TbSquareLetterD size='20px' />} text='Delete Design' />
        <Shortcut
          icon={<TbSquareLetterW size='20px' />}
          text='Select Previous Component'
        />
        <Shortcut
          icon={<TbSquareLetterW size='20px' />}
          text='Select Next Component'
        />
      </List>
    </Backdrop>
  );
}

function Shortcut({ icon, text }) {
  return (
    <Fragment>
      <Divider />
      <ListItem className='shortcut'>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItem>
    </Fragment>
  );
}
