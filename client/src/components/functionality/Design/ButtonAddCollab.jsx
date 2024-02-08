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
import { useTheme } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function ButtonAddCollab({ designId, ownerId, ownerName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          // onClick={(e) => setAnchorEl(e.currentTarget)}
          onClick={handleClick}
          sx={{ marginRight: '0.3rem' }}>
          <FontAwesomeIcon icon={faUserPlus} />
        </Fab>
      </Tooltip>
      <ClickAwayListener onClickAway={handleClose}>
      <Popper
        open={Boolean(anchorEl)}
        placement='bottom-start'
        anchorEl={anchorEl}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#9f9f9f' : '#8D8D8D',
          zIndex: 10000,
        }}
        modifiers={[
          {
            name: 'offset',
            options: {
              // first value is for horizontal offset, second is for vertical offset
              offset: [0, 20],
            },
          },
        ]}
        >
        <Box
          component='form'
          sx={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSumbit}>
          <TextField
            label='Collaborator username'
            name='collaboratorUsername'
            InputLabelProps={{
              style: { color: 'white' }
            }}
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
            sx={{ marginLeft: '.01rem' }}
          />
        </Box>
      </Popper>
      </ClickAwayListener>
    </Fragment>
  );
}
