import React, { Fragment, useState } from 'react';

import KeyboardIcon from '@mui/icons-material/Keyboard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  TbSquareLetterT,
  TbSquareLetterD,
  TbSquareLetterW,
  TbSquareLetterS,
} from 'react-icons/tb';

import BackdropSnackbar from './BackdropSnackbar';
import '../../styles/keyboardShortcut.scss';

export default function ButtonKeyboardShortcut() {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Tooltip title='View keyboard Shortcuts Button'>
        <IconButton
          size='small'
          component='label'
          variant='contained'
          onClick={() => setOpen(true)}
        >
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
    >
      <List className='keyboard-shortcuts'>
        <ListItem className='shortcut'>
          <ListItemIcon sx={{ color: 'white' }}>esc</ListItemIcon>
          <ListItemText sx={{ marginLeft: '10px' }}>
            Exit full screen
          </ListItemText>
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
          icon={<TbSquareLetterS size='20px' />}
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
        <Stack direction='row'>
          <Typography>alt + </Typography>
          {icon}
        </Stack>
        <ListItemText sx={{ marginLeft: '10px' }}>{text}</ListItemText>
      </ListItem>
    </Fragment>
  );
}
