import React from 'react';
import Container from '@mui/material/Container';
import HorizontalStepper from './HorizontalStepper';
import { useDispatch, useSelector } from 'react-redux';
import { resetMessage } from '../utils/reducers/appSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserDesigns from './UserDesigns';
import Home from './HomePage';

export default function MainContainer() {
  const { message, page } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  return (
    <Container>
      {page === 'NEW_DESIGN' && <HorizontalStepper />}
      {page === 'HOME' && <Home />}
      {page === 'PAST_DESIGNS' && <UserDesigns />}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(message)}
        onClose={() => dispatch(resetMessage())}
        autoHideDuration={6000}
      >
        {message && <Alert severity={message.severity}>{message.text}</Alert>}
      </Snackbar>
    </Container>
  );
}
