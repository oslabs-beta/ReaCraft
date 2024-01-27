import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FileUploader } from 'react-drag-drop-files';
import {
  setMessage,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { styled } from '@mui/material/styles';
import { newDesign } from '../../../utils/reducers/designSliceV3';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import '../../../styles/UserImageUploadButton.css';

// to handle actual upload process and update the progress bar accordingly, we'll have to implement the logic for file uploading to the server

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(file) {
    // set file details
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + 'MB'); // convert bytes to MB

    // simulate upload progress - this isn't showing
    // const interval = setInterval(() => {
    //   setUploadProgress((oldProgress) => {
    //     if (oldProgress === 100) {
    //       clearInterval(interval);
    //       return 100;
    //     }
    //     const diff = Math.random() * 10;
    //     return Math.min(oldProgress + diff, 100);
    //   });
    // }, 500);

    // function to generate a unique identifier
    function generateUniqueIdentifier() {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
      }

    if (file) {
      // generate a unique client identifier with the upload request for the websocket connection
      const clientId = generateUniqueIdentifier();

      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();

        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
            try {
              dispatch(newDesign({ userImage, imageHeight, clientId }));
              dispatch(setSelectedPageIdx(0));
              dispatch(
                setMessage({ severity: 'success', text: 'Upload successful.' })
              );
             } catch (err) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'App: add new design ' + err,
                })
              );
            }
        };
        img.src = userImage

        // communicates the start of the upload process to the server by initiating the WebSocket communication 
        socket.send(JSON.stringify({
          action: 'startUpload',
          clientId: clientId,
        }));
      };
      // update progress bar when a message is received from the server
      // onmessage is an event listener to be called when a message is received. the listener receives a MessageEvent named 'message'
      socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        console.log('this is the message from userimageupload', message);
        if (message.type === 'progressUpdate') {
          console.log('this is message.progress from userimageupload', message.progress);
          setUploadProgress(message.progress);
        }
      };
      reader.readAsDataURL(file);
    };
  }

  return (
      <Box className='container'>
        <Box className='svgBackground'>
          <img src='/assets/Dotted_Box.svg' alt='Dotted box' /> 
        </Box>
        <Box className='content'>
            <FileUploader
              handleChange={handleFileChange} 
              name="file" 
              types={['JPG', 'PNG']} 
              children={(
                <Box>
                  <CloudUploadRoundedIcon style={{ fontSize: '70px', color: '#736C6C', marginLeft: '60px' }} />
                  <div style={{ margin: '20px 0', color: 'black' }}>Drag & Drop your files here</div>
                  <Box>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#8D99AE',
                      marginLeft: '50px',
                      '&:hover': {
                        backgroundColor: '#E0E0E0',
                      },
                      '&:focus': {
                        outline: 'none',
                      },
                      '&:active': {
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    BROWSE
                    <VisuallyHiddenInput
                      type='file'
                      name='userImage'
                      accept='image/*'
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </Button>
                    </Box>
                </Box>
              )}
            />
              {/* if fileName is set, render a Box with fileName, fileSize, and a LinearProgress component for uploadProgress */}
              {fileName && (
                <Box sx={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>
                  <span>{fileName}</span> - <span>{fileSize}</span>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
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
            </Box>
          </Box>
  );
}

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

// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { FileUploader } from 'react-drag-drop-files';
// import {
//   setMessage,
//   setSelectedPageIdx,
// } from '../../../utils/reducers/appSlice';
// import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
// import { styled } from '@mui/material/styles';
// import { newDesign } from '../../../utils/reducers/designSliceV3';
// import { Box } from '@mui/material';
// import LinearProgress from '@mui/material/LinearProgress';
// import Button from '@mui/material/Button';
// import '../../../styles/UserImageUploadButton.css';

// export default function FileUploaderNewDesign() {
//   const dispatch = useDispatch();
//   const [fileName, setFileName] = useState('');
//   const [fileSize, setFileSize] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const containerStyles = {
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: '70vh',
//   };

//   const uploadAreaStyles = {
//     backgroundColor: 'transparent',
//     border: '2px dashed black',
//     padding: '100px',
//     borderRadius: '12px',
//     color: 'black',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     maxWidth: '600px',
//     cursor: 'pointer', // to indicate the area is clickable
//   };

//   function handleFileChange(file) {
//     // set file details
//     setFileName(file.name);
//     setFileSize((file.size / 1024 / 1024).toFixed(2) + 'MB'); // Convert bytes to MB

//     // simulate upload progress - this isn't showing
//     const interval = setInterval(() => {
//       setUploadProgress((oldProgress) => {
//         if (oldProgress === 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         const diff = Math.random() * 10;
//         return Math.min(oldProgress + diff, 100);
//       });
//     }, 500);

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const userImage = reader.result;
//         const img = new Image();

//         img.onload = () => {
//           const setWidth = 800;
//           const imageHeight = img.height * (setWidth / img.width);
//           try {
//             dispatch(newDesign({ userImage, imageHeight }));
//             dispatch(setSelectedPageIdx(0));
//             dispatch(
//               setMessage({ severity: 'success', text: 'Upload successful.' })
//             );
//           } catch (err) {
//             dispatch(
//               setMessage({
//                 severity: 'error',
//                 text: 'App: add new design ' + err,
//               })
//             );
//           }
//         };
//         img.src = userImage;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   return (
//     <Box sx={containerStyles}>
//       {/* render another Box as a flex container with uploadAreaStyles */}
//       <Box sx={uploadAreaStyles}>
//         <FileUploader
//           handleChange={handleFileChange}
//           name='file'
//           types={['JPG', 'PNG']}
//           children={
//             <>
//               <CloudUploadRoundedIcon
//                 style={{ fontSize: '64px', color: 'black' }}
//               />
//               <div style={{ margin: '20px 0', color: 'black' }}>
//                 Drag & Drop your files here
//               </div>
//               <Button
//                 variant='contained'
//                 component='label'
//                 sx={{
//                   backgroundColor: '#FFFFFF',
//                   color: '#8D99AE',
//                   '&:hover': {
//                     backgroundColor: '#E0E0E0',
//                   },
//                   '&:focus': {
//                     outline: 'none',
//                   },
//                   '&:active': {
//                     outline: 'none',
//                     border: 'none',
//                     boxShadow: 'none',
//                   },
//                 }}
//               >
//                 BROWSE
//                 <VisuallyHiddenInput
//                   type='file'
//                   name='userImage'
//                   accept='image/*'
//                   onChange={(e) => handleFileChange(e.target.files[0])}
//                 />
//               </Button>
//             </>
//           }
//         />
//         {/* if fileName is set, render a Box with fileName, fileSize, and a LinearProgress component for uploadProgress */}
//         {fileName && (
//           <Box sx={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>
//             <span>{fileName}</span> - <span>{fileSize}</span>
//             <LinearProgress
//               variant='determinate'
//               value={uploadProgress}
//               sx={{
//                 width: '100%',
//                 marginTop: '10px',
//                 color: 'black',
//               }}
//             />
//             <Button
//               sx={{
//                 marginTop: '10px',
//                 color: 'black',
//                 borderColor: '#8D99AE',
//               }}
//               onClick={() => {
//                 /* logic to handle file removal */
//               }}
//             >
//               X
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });
