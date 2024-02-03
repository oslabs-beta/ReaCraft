import React, { Fragment, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { addCollaboratorRequest } from '../../../utils/fetchRequests';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../utils/reducers/appSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function ButtonAddCollab({ designId, ownerId, ownerName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  async function handleSumbit(e) {
    e.preventDefault();
    const collaboratorUsername = e.target.collaboratorUsername.value;
    const canEdit = e.target.canEdit.checked;
    if (collaboratorUsername === '') {
      dispatch(
        setMessage({
          severity: 'error',
          text: 'Collaborator username cannot be empty.',
        })
      );
    } else if (collaboratorUsername === ownerName) {
      dispatch(
        setMessage({
          severity: 'error',
          text: 'Cannot set yourself as a collaborator',
        })
      );
    }
    try {
      const res = await addCollaboratorRequest(designId, {
        ownerId,
        collaboratorUsername,
        canEdit,
      });
      dispatch(
        setMessage({
          severity: 'success',
          text: res.message,
        })
      );
      setAnchorEl(null);
    } catch (err) {
      dispatch(
        setMessage({ severity: 'error', text: 'Adding Collaborator: ' + err })
      );
    }
  }
  return (
    <Fragment>
      <Tooltip title='Add Collaborator'>
        <Fab
          size='small'
          color='info'
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ marginRight: '0.3rem' }}
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </Fab>
      </Tooltip>
      <Popper
        open={Boolean(anchorEl)}
        placement='bottom-start'
        anchorEl={anchorEl}
        sx={{
          backgroundColor: '#736c6c',
          zIndex: 10000,
        }}
      >
        <Box
          component='form'
          sx={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSumbit}
        >
          <TextField
            label='Collaborator username'
            name='collaboratorUsername'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton type='submit' sx={{ color: 'white' }}>
                    <PersonAddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox name='canEdit' defaultChecked />}
            label='They can edit'
          />
        </Box>
      </Popper>
    </Fragment>
  );
}
