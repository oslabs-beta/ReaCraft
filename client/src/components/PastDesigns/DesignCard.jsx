import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import {
  setSearchTerm,
  getDesignDetails,
} from '../../utils/reducers/designSliceV3';
import EditableText from '../userInputs/EditableText';
import Paper from '@mui/material/Paper';
import {
  goToPage,
  setMessage,
  setSelectedPageIdx,
} from '../../utils/reducers/appSlice';

export default function DesignCard({ design }) {
  const dispatch = useDispatch();
  const { created_at, last_updated } = design;

  const handleViewDesign = async () => {
    try {
      dispatch(getDesignDetails(design._id));
      dispatch(setSelectedPageIdx(0));
      dispatch(goToPage('WORKSPACE'));
      // resets the search term in redux state
      dispatch(setSearchTerm(''));
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
        <EditableText
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
          justifyContent: 'space-around',
        }}
      >
        <Button variant='outlined' size='small'>
          Share
        </Button>
        <Button size='small' variant='outlined' onClick={handleViewDesign}>
          View design
        </Button>
      </CardActions>
    </Paper>
  );
}
