import React, { useRef, useState } from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import InputDesignTitle from './InputDesignTitle_DesignCard';
import Paper from '@mui/material/Paper';
import { setMessage } from '../../../utils/reducers/appSlice';
import { getDesignDetailsAndSetApp } from '../../../utils/reducers/designSliceV3';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faPenToSquare,
  faEye,
  faEllipsis,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import ButtonDeleteDesign from './ButtonDeleteDesign';
import { useAuth } from '../../../hooks/useAuth';

export default function CardDesignDisplay({ design }) {
  const { created_at, last_updated, canEdit, last_updated_by } = design;
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const viewOnly = canEdit === false;

  const menuRef = useRef(null);
  const openMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(true);
  };

  const handleClick = async (designId, viewOnly) => {
    try {
      dispatch(getDesignDetailsAndSetApp(designId, !viewOnly));
    } catch (err) {
      dispatch(
        setMessage({
          severity: 'error',
          text: 'Design: view past design detail ' + err,
        })
      );
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 345,
        minWidth: 200,
        position: 'relative',
        '&:hover': {
          transform: 'scale(1.1)',
          cursor: 'pointer',
        },
      }}
      elevation={3}
      square={false}
    >
      {typeof canEdit === 'boolean' && (
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <Tooltip title='Collaboartion design'>
            <Fab size='small' sx={{ boxShadow: 'none', cursor: 'initial' }}>
              <FontAwesomeIcon icon={faUsers} />
            </Fab>
          </Tooltip>
        </Box>
      )}
      <CardMedia
        onClick={openMenu}
        align='center'
        sx={{
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          height: 140,
          // boxShadow: '3px 5px 5px -3px rgba(44, 44, 44, 1)',
        }}
        image={design.image_url}
        title={design.title}
      />
      <CardContent name='CardContent_DesignCard'>
        <InputDesignTitle
          designId={design._id}
          initialText={design.title}
          canEdit={canEdit}
          align='center'
          sx={{
            fontSize: 'xl',
          }}
        />
        <Box onClick={openMenu}>
          <Typography gutterBottom variant='h5' component='div'></Typography>
          <Typography
            variant='body2'
            color='text'
            sx={{
              fontSize: 'lg',
              // fontSize: {
              //   md: 12,
              //   sm: 11,
              //   xs: 10,
              // },
            }}
          >
            Created: {created_at.toLocaleDateString()}
          </Typography>
          <Typography variant='body2' color='text' sx={{ fontSize: 'lg' }}>
            Updated: {last_updated.toLocaleDateString()}
          </Typography>
          {last_updated_by && (
            <Typography variant='body2' color='text' sx={{ fontSize: 'lg' }}>
              Last Updated By: {last_updated_by}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
        onClick={openMenu}
      >
        <IconButton
          size='medium'
          onClick={openMenu}
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          sx={{ boxShadow: 'none', color: 'white' }}
          ref={menuRef}
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </IconButton>
        <DesignMenu
          anchorEl={menuRef.current}
          open={menuOpen}
          setMenuOpen={setMenuOpen}
          viewOnly={viewOnly}
          handleClick={(e) => {
            e.stopPropagation();
            handleClick(design._id, viewOnly);
          }}
          designId={design._id}
          isOwner={design.user_id === user._id}
        />
      </CardActions>
    </Paper>
  );
}

function DesignMenu({
  anchorEl,
  open,
  setMenuOpen,
  viewOnly,
  designId,
  isOwner,
  handleClick,
}) {
  return (
    <Menu
      id='basic-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={(e) => {
        e.stopPropagation();
        setMenuOpen(false);
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={handleClick}>
        <ListItemIcon sx={{ color: 'white' }}>
          <FontAwesomeIcon icon={viewOnly ? faEye : faPenToSquare} />
        </ListItemIcon>
        <ListItemText>{viewOnly ? 'View' : 'Edit'} Design</ListItemText>
      </MenuItem>
      {isOwner && <Divider />}
      {isOwner && <ButtonDeleteDesign designId={designId} />}
    </Menu>
  );
}
