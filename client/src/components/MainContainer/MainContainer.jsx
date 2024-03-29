import React from 'react';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { resetMessage } from '../../utils/reducers/appSlice';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Home from './Home/HomePage';
import Design from './Design/DesignPage';

export default function MainContainer({ isWorkspaceReady }) {
  const { message, page } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  return (
    <Container
      value='WorkSpaceContainer'
      disableGutters={true}
      maxWidth='1500px'
      minWidth='1000px'
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: '60px',
      }}
    >
      {page === 'DESIGN' && <Design 
      isWorkspaceReady={isWorkspaceReady}
      />}
      {page === 'HOME' && (
        <Box display='flex' justifyContent='center'>
          <Home maxWidth='false' />
        </Box>
      )}
      <Snackbar
        value='SnackbarUnderWorkSpaceCont'
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
