import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { getDesignDetails, setSearchTerm } from '../../utils/reducers/designSliceV2';
import EditableText from '../userInputs/EditableText';

export default function DesignCard({ design, setLocalSelectedDesignId }) {
  const dispatch = useDispatch();
  const created_at = new Date(design.created_at).toLocaleDateString();
  const last_updated = new Date(design.last_updated).toLocaleDateString();
  console.log('design is', design);

  const handleViewDesign = async () => {
    try {
      dispatch(getDesignDetails(design._id));
      // setLocalSelectedDesignId(design._id);
      dispatch(setSearchTerm(''));
    } catch(err) {
      console.log('error ' + err);
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
        <EditableText initialText={design.title} align='center' />
        <Typography gutterBottom variant='h5' component='div'></Typography>
        <Typography
          sx={{
            fontSize: '1vw',
          }}
          variant='body2'
          color='text.secondary'
        >
          Created On: {created_at.toLocaleString()}
        </Typography>
        <Typography
          sx={{
            fontSize: '1vw',
          }}
          variant='body2'
          color='text.secondary'
        >
          Updated On: {last_updated.toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Button variant='outlined' size='small'>
          Share
        </Button>
        <Button
          size='small'
          variant='outlined'
          onClick={handleViewDesign}
          //   async () => {
          //   try {
          //     dispatch(getDesignDetails(design._id));
          //   } catch (err) {
          //     console.log('error: ' + err);
          //   }
          // }}
        >
          View design
        </Button>
      </CardActions>
    </Paper>
  );
}
