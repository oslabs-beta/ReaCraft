import React from 'react';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { resetMessage } from '../utils/reducers/appSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserDesigns from './PastDesigns/PastDesigns';
import Home from './HomePage';
import NewDesign from './NewDesign';

export default function MainContainer() {
  const { message, page } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  return (
    <Container
      value='WorkSpaceContainer'
      disableGutters={true}
      maxWidth='false'
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: '7vw',
      }}>
      {page === 'NEW_DESIGN' && <NewDesign />}
      {page === 'HOME' && <Home />}
      {page === 'PAST_DESIGNS' && <UserDesigns />}
      <Snackbar
        value='SnackbarUnderWorkSpaceCont'
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(message)}
        onClose={() => dispatch(resetMessage())}
        autoHideDuration={6000}>
        {message && <Alert severity={message.severity}>{message.text}</Alert>}
      </Snackbar>
    </Container>
  );
}
