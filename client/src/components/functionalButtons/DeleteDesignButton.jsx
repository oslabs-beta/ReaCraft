import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDesign } from '../../utils/fetchRequests';
import { setMessage } from '../../utils/reducers/appSlice';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { resetDesign } from '../../utils/reducers/designSliceV2';

export default function DeleteDesignButton({ designId }) {
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
      <Button
        variant='contained'
        color='error'
        startIcon={<Delete />}
        onClick={() => setOpen(true)}
      >
        {/* Delete */}
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
                dispatch(resetDesign());
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
