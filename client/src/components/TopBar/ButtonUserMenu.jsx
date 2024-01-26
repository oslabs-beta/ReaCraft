import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../../hooks/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
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
import { updateProfilePictureRequest } from '../../utils/fetchRequests';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../utils/reducers/appSlice';

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
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor:
      theme.palette.mode === 'light'
        ? '#ffffff'
        : theme.palette.background.paper,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
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
            : theme.palette.text.secondary,
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
  const [modal, setModal] = useState(false);

  const { username, email, profile_image } = user;
  const [avatar, setAvatar] = useState(profile_image);
  const created_at = new Date(
    new Date(user.created_at).toString().split('-')[0]
  );
  const last_login = new Date(
    new Date(user.last_login).toString().split('-')[0]
  );
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
        sx={{ backgroundColor: 'transparent', color: '#736c6c' }}
      >
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
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setModal(true);
            setAnchorEl(null);
          }}
          disableRipple
        >
          <InfoIcon />
          Account
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => logout()} disableRipple>
          <LogoutIcon />
          Logout
        </MenuItem>
      </StyledMenu>
      {user && (
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          aria-labelledby='modal-user-menu'
          aria-describedby='modal-user-menu'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Account Info
            </Typography>

            <UserProfileImage avatar={avatar} setAvatar={setAvatar} />

            <TableContainer component={Paper}>
              <Table aria-label='simple table'>
                <TableBody>
                  <UserData label='username' data={username} />
                  <UserData label='email' data={email} />
                  <UserData
                    label='created_at'
                    data={created_at.toLocaleString()}
                  />
                  <UserData
                    label='last_login'
                    data={last_login.toLocaleString()}
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

function UserData({ label, data }) {
  return (
    <TableRow
      key={label}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
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
      }}
    >
      <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
      <Stack direction='row'>
        <Button component='label'>
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
                    text: 'Upload profile picutre successfully',
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
            }}
          >
            Delete
          </Button>
        )}
      </Stack>
    </Box>
  );
}
