import React, { Fragment, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../../hooks/useAuth';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import {
  updateProfilePictureRequest,
  updateUsernameRequest,
} from '../../utils/fetchRequests';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../utils/reducers/appSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faRightFromBracket,
  faPenToSquare,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 1,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor:
      theme.palette.mode === 'light'
        ? '#ffffff'
        : theme.palette.background.paper,
    color: theme.palette.mode === 'light' ? '#bdbbb6' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color:
          theme.palette.mode === 'light'
            ? 'rgb(55, 65, 81)'
            : theme.palette.text,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function ButtonUserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout, user } = useAuth();
  const [modal, setModal] = useState(false)
  const { username, email, profile_image } = user;
  const [avatar, setAvatar] = useState(profile_image);
  const created_at = new Date(
    new Date(user.created_at).toString().split('-')[0]
  );
  const last_login = new Date(
    new Date(user.last_login).toString().split('-')[0]
  );
  const theme = useTheme();

  return (
    <div>
      <Button
        size='sm'
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ backgroundColor: 'transparent', color: theme.palette.mode === 'light'? '#787774' : '#F1F1ED' }}>
        <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        size='sm'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setModal(true);
            setAnchorEl(null);
          }}
          disableRipple
          sx={{ display: 'flex', gap: '10px', alignItems: 'center', color: theme.palette.mode === 'light' ? '#85827f' : ''  }}>
          <FontAwesomeIcon icon={faCircleInfo} />
          Account
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => logout()}
          disableRipple
          sx={{ display: 'flex', gap: '10px', alignItems: 'center', color: theme.palette.mode === 'light' ? '#85827f' : '' }}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </MenuItem>
      </StyledMenu>
      {user && (
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          aria-labelledby='modal-user-menu'
          aria-describedby='modal-user-menu'>
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Account Info
            </Typography>

            <UserProfileImage avatar={avatar} setAvatar={setAvatar} />

            <TableContainer component={Paper}>
              <Table aria-label='simple table'>
                <TableBody>
                  <UserName username={username} />
                  <UserData label='Email' data={email} />
                  <UserData
                    label='Created at'
                    data={created_at.toLocaleDateString()}
                  />
                  <UserData
                    label='Last login'
                    data={last_login.toLocaleDateString()}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      )}
    </div>
  );
}

function UserName({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(username);
  const dispatch = useDispatch();
  const { updateUsername } = useAuth();
  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}>
      <TableCell component='th' scope='row'>
        Username
      </TableCell>
      <TableCell>
        {!isEditing && (
          <Fragment>
            {text}
            <IconButton
              size='small'
              sx={{
                color: 'white',
                '& svg': {
                  transform: 'scale(0.5)',
                },
              }}
              onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </IconButton>
          </Fragment>
        )}
        {isEditing && (
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={async () => {
                      try {
                        if (text !== username) {
                          const res = await updateUsernameRequest({
                            newUsername: text,
                          });
                          if (res.message === 'Username in use') {
                            dispatch(
                              setMessage({
                                severity: 'error',
                                text: res.message,
                              })
                            );
                            setText(username);
                          } else {
                            updateUsername(text);
                            dispatch(
                              setMessage({
                                severity: 'success',
                                text: res.message,
                              })
                            );
                          }
                        }
                        setIsEditing(false);
                      } catch (err) {
                        dispatch(
                          setMessage({
                            severity: 'error',
                            text: 'Updating username ' + err,
                          })
                        );
                      }
                    }}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );
}

function UserData({ label, data }) {
  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}>
      <TableCell component='th' scope='row'>
        {label}
      </TableCell>
      <TableCell>{data}</TableCell>
    </TableRow>
  );
}

function UserProfileImage({ avatar, setAvatar }) {
  let url;
  if (avatar) url = new URL(avatar);

  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
      <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
      <Stack direction='row'>
        <Button component='label' sx={{ color: '#F4F3F7' }}>
          {avatar ? 'Change' : 'Upload'}
          <VisuallyHiddenInput
            type='file'
            name='user-profile'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                dispatch(
                  setMessage({
                    severity: 'success',
                    text: 'Upload profile picture successfully',
                  })
                );
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const userImage = reader.result;
                  const response = await updateProfilePictureRequest({
                    userImage,
                    imageToDelete: url ? url.pathname.slice(1) : null,
                  });
                  setAvatar(response.imageUrl);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>
        {avatar && (
          <Button
            color='error'
            onClick={async () => {
              await updateProfilePictureRequest({
                imageToDelete: url.pathname.slice(1),
              });
              setAvatar(null);
              dispatch(
                setMessage({
                  severity: 'success',
                  text: 'Delete profile picutre successfully',
                })
              );
            }}>
            Delete
          </Button>
        )}
      </Stack>
    </Box>
  );
}
