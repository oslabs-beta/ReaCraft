import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDesign } from '../../utils/fetchRequests';
import { goToPage, setMessage } from '../../utils/reducers/appSlice';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { resetDesign } from '../../utils/reducers/designSliceV3';

export default function DeleteDesignButton() {
  const designId = useSelector((state) => state.designV3._id);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  const handleKeyPress = (e) => {
    if (e.altKey && e.keyCode === 68) setOpen(true);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [open]);

  return (
    <Fragment>
      <Fab size='small' onClick={() => setOpen(true)} color='error'>
        <Delete />
      </Fab>
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
                    text: 'Design deleted.',
                  })
                );
                dispatch(goToPage('HOME'));
                dispatch(resetDesign());
              } catch (err) {
                console.log(err);
                dispatch(
                  setMessage({
                    severity: 'error',
                    text: 'Design: delete design ' + err,
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
