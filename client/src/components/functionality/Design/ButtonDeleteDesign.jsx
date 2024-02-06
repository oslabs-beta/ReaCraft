import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDesign } from '../../../utils/fetchRequests';
import { goToPage, setMessage } from '../../../utils/reducers/appSlice';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { resetDesign } from '../../../utils/reducers/designSliceV3';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function ButtonDeleteDesign({ designId }) {
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
      <MenuItem onClick={() => setOpen(true)}>
        <ListItemIcon sx={{ color: 'white' }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </ListItemIcon>
        <ListItemText>Delete Design</ListItemText>
      </MenuItem>

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
