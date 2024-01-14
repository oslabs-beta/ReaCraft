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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={design.image_url}
        title={design.title}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {design.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {design.created_at}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Share</Button>
        <Button
          size='small'
          onClick={async () => {
            try {
              dispatch(getDesignDetails(design._id));
            } catch (err) {
              console.log('error: ' + err);
            }
          }}
        >
          View design
        </Button>
      </CardActions>
    </Card>
  );
}
