import React, { Fragment, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { addCollaborator } from '../../../../../server/controllers/designController';

export default function ButtonAddCollab({ designId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');
  return (
    <Fragment>
      <Tooltip title='Add Collaborator'>
        <Fab
          size='small'
          color='info'
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <PersonAddIcon />
        </Fab>
      </Tooltip>
      <Popper
        open={Boolean(anchorEl)}
        placement='bottom-start'
        anchorEl={anchorEl}
        sx={{ backgroundColor: '#736c6c', zIndex: 10000 }}
      >
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton sx={{ color: 'white' }}>
                  <PersonAddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Popper>
    </Fragment>
  );
}
