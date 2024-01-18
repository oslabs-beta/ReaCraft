import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { getDesignDetails } from '../../utils/reducers/designSliceV2';

export default function DesignCard({ design }) {
  const dispatch = useDispatch();
  const created_at = new Date(design.created_at).toLocaleDateString();
  const last_updated = new Date(design.last_updated).toLocaleDateString();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        aling='center'
        sx={{
          height: 140,
        }}
        image={design.image_url}
        title={design.title}
      />
      <CardContent name='CardContent_DesignCard'>
        <Typography
          sx={{
            fontSize: '2vw',
            textAlign: 'center',
          }}
          gutterBottom
          variant='h5'
          component='div'>
          {design.title}
        </Typography>
        <Typography
          sx={{
            fontSize: '1vw',
          }}
          variant='body2'
          color='text.secondary'>
          Created On: {created_at.toLocaleString()}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
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
          onClick={async () => {
            try {
              dispatch(getDesignDetails(design._id));
            } catch (err) {
              console.log('error: ' + err);
            }
          }}>
          View design
        </Button>
      </CardActions>
    </Card>
  );
}
