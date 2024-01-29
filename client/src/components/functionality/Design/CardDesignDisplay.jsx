import React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import InputDesignTitle from './InputDesignTitle_DesignCard';
import Paper from '@mui/material/Paper';
import {
  getDesignDetailsAndSetApp,
  setMessage,
} from '../../../utils/reducers/appSlice';

export default function CardDesignDisplay({ design }) {
  const dispatch = useDispatch();
  const { created_at, last_updated, canEdit } = design;

  const handleViewDesign = async () => {
    try {
      dispatch(getDesignDetailsAndSetApp(design._id));
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
    <Paper sx={{ maxWidth: 345 }} elevation={3} square={false}>
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
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
        }}
      >
        <Button size='small' variant='outlined' onClick={handleViewDesign}>
          {canEdit === false ? 'View' : 'Edit'} design
        </Button>
      </CardActions>
    </Paper>
  );
}
