import Box from '@mui/material/Box';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from './Workspace';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { deleteDesign, getDesigns } from '../utils/fetchRequests';
import {
  resetApp,
  setMessage,
  setUserDesigns,
} from '../utils/reducers/appSlice';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function UserDesigns() {
  const userDesigns = useSelector((state) => state.app.userDesigns);
  console.log('userDesigns in userDesigns', userDesigns);
  const currentDesign = useSelector((state) => state.design);
  const dispatch = useDispatch();
  console.log(userDesigns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const designs = await getDesigns();
        console.log(designs);
        dispatch(setUserDesigns(designs));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (!currentDesign._id) {
    return (
      <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={2}>
        {userDesigns.map((design) => (
          <DesignCard design={design} key={design._id} />
        ))}
      </Box>
    );
  } else {
    const { title, created_at, _id } = currentDesign;
    return (
      <Fragment>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <TextField name='title' label='Title' defaultValue={title} />
          <Typography>created_at: {created_at}</Typography>
          <DeleteDesign designId={_id} />
        </Box>
        <Workspace />
      </Fragment>
    );
  }
}

function DeleteDesign({ designId }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  return (
    <Fragment>
      <Button
        variant='contained'
        color='error'
        startIcon={<Delete />}
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this design?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              try {
                await deleteDesign(designId);
                dispatch(
                  setMessage({
                    severity: 'success',
                    text: 'Delete a design successfully.',
                  })
                );
                setTimeout(() => dispatch(resetApp()), 1000);
              } catch (err) {
                dispatch(
                  setMessage({
                    severity: 'error',
                    text: 'Delete failed' + err,
                  })
                );
              }
            }}
          >
            Yes
          </Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
