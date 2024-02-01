import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../../utils/reducers/appSlice';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { addNewPageAndUpdateSelectedPageIdx } from '../../../utils/reducers/designSliceV3';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ButtonAddPage({ pageIdx }) {
  const { _id, pages } = useSelector((state) => state.designV3);
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   console.log('uploadProgress is now', uploadProgress);
  // }, [uploadProgress]);

  function generateUniqueIdentifier() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  // function to initiate websocket connection with the generated clientId and retryCount (if connection gets disconnected prematurely)
  function initiateWebSocketConnection(clientId, retryCount = 0) {
    // create new websocket connection with clientId
    const ws = new WebSocket(`ws://localhost:8080/ws?clientId=${clientId}`);
  
    // once websocket connection is open, console log
    ws.onopen = () => {
      console.log('websocket connection opened');
    };
  
    // when a websocket message is received
    ws.onmessage = (event) => {
      try {
        // parse the message received from server
        const message = JSON.parse(event.data);
  
        // check if message has the expected strcuture with type
        if (typeof message === 'object' && 'type' in message) {
          // handle different types of messages received from the server
          switch (message.type) {
            case 'progressUpdate':
              console.log('progressUpdate received', message.progress);
              // update the uploadProgress state
              setUploadProgress(message.progress);
              break;
            case 'uploadComplete':
              console.log('uploadComplete received');
              setFileName('');
              setFileSize('');
              setUploadProgress(100);
              setTimeout(() => setUploadProgress(0), 2000); // reset progress after a delay
              break;
            case 'test':
              console.log('test message received:', message.content);
              break;
            default:
              console.log('received an unhandled message type:', message.type);
          }
        } else {
          console.log('received message without type:', message);
        }
      } catch(err) {
        console.error('error parsing from server:', error);
      }
    };
  
    // if there's an error with the websocket 
    ws.onerror = (event) => {
      console.error('websocket error:', event);
      // check if event code is 1006 = abnormal connection
      if (event.code === 1006) {
        console.error('abnormal disconnection');
      }
      // attempt to reconnect after a backoff delay
      const backOffDelay = calculateBackOffDelay(retryCount);
      setTimeout(() => initiateWebSocketConnection(clientId, retryCount + 1));
    }
  
    // when websocket closes
    ws.onclose = () => {
      console.log('websocket connection closed');
    };
    // set websocket connection to state
    setSocket(ws); 
  };
  
  // calculates the delay for reconection attempts 
  function calculateBackOffDelay(retryCount) {
    // exponential back-off formula 
    return Math.min(1000 * (2 ** retryCount), 30000);
  };

  function handleFileChange(e) {
    const file = e.target.files[0];
    console.log(file);
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + 'MB');
    const clientId = generateUniqueIdentifier();
    console.log('Generated clientId:', clientId);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();
        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
          console.log('userImage');
          const currentSocket = initiateWebSocketConnection(clientId); 
          try {
            dispatch(
              addNewPageAndUpdateSelectedPageIdx({
                designId: _id,
                userImage,
                imageHeight,
                clientId,
              })
            );
          } catch (err) {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'App: uploading image for new page' + err,
              })
            );
            // reset state in case of error
            setFileName('');
            setFileSize('');
            setUploadProgress(0);
          }
        };
        img.src = userImage;
      };
      reader.readAsDataURL(file);
    }
  }

  // useEffect to close websocket connection - cleanup function to prevent memory leaks and ensure the components state is always fresh
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        console.log('connection closed');
      }
    }
  }, [socket]);
  

  return (
    <>
      <Tooltip title='Add Page'>
        <Fab size='small' component='label' variant='contained'>
          <AddCircleRoundedIcon />
          <VisuallyHiddenInput
            type='file'
            name='userImage'
            accept='image/*'
            onChange={handleFileChange}
          />
        </Fab>
      </Tooltip>
      {fileName && (uploadProgress < 100 || socket) && (
        <Box sx={{ 
          position: 'fixed', 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#E0E1DD',
          p: 2,
          borderRadius: 4,
          width: 'auto',
          maxWidth: '90%',
          textAlign: 'center', 
          color: 'black', 
          // marginTop: '10px', 
          }}>
          <span>{fileName}</span> - <span>{fileSize}</span>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            color='secondary'
            sx={{
              width: '100%',
              marginTop: '10px',
              color: 'black',
            }}
          />
          <Button
            sx={{
              marginTop: '10px',
              color: 'black',
              borderColor: '#8D99AE',
            }}
            onClick={() => {/* logic to handle file removal */}}
          >
            X
          </Button>
        </Box>
      )}
    </>
  );
}
