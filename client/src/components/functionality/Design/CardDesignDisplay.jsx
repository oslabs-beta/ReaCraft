import React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import InputDesignTitle from './InputDesignTitle_DesignCard';
import Paper from '@mui/material/Paper';
import {
  getDesignDetailsAndSetApp,
  setMessage,
} from '../../../utils/reducers/appSlice';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faPenToSquare,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';

export default function CardDesignDisplay({ design }) {
  const dispatch = useDispatch();
  const { created_at, last_updated, canEdit, last_updated_by } = design;

  const handleViewDesign = async () => {
    try {
      dispatch(getDesignDetailsAndSetApp(design._id, canEdit));
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
      }}
      elevation={3}
      square={false}
    >
      {typeof canEdit === 'boolean' && (
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <Tooltip title='Collaboartion design'>
            <Fab size='small' sx={{ boxShadow: 'none' }}>
              <FontAwesomeIcon icon={faUsers} />
            </Fab>
          </Tooltip>
        </Box>
      )}
      <CardMedia
        align='center'
        sx={{
          borderRadius: '5px',
          height: 140,
          boxShadow: '0px 15px 200px -9px #5B5B5B',
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
        />
        <Typography gutterBottom variant='h5' component='div'></Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            fontSize: {
              md: 12,
              sm: 11,
              xs: 10,
            },
          }}
        >
          Created at: {created_at.toLocaleString()}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            fontSize: {
              md: 12,
              sm: 11,
              xs: 10,
            },
          }}
        >
          Updated at: {last_updated.toLocaleString()}
        </Typography>
        {last_updated_by && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              fontSize: {
                md: 12,
                sm: 11,
                xs: 10,
              },
            }}
          >
            last_updated_by: {last_updated_by}
          </Typography>
        )}
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Tooltip title={canEdit === false ? 'View Design' : 'Edit Design'}>
          <IconButton
            size='medium'
            // color={canEdit === false ? 'info' : 'success'}
            onClick={handleViewDesign}
            sx={{ boxShadow: 'none', color: 'white' }}
          >
            {canEdit === false ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faPenToSquare} />
            )}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Paper>
  );
}
