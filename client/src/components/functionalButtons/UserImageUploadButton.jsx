import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileUploader } from 'react-drag-drop-files';
import Fab from '@mui/material/Fab';
import { setMessage } from '../../utils/reducers/appSlice';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import Tooltip from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import {
  newDesign,
  updateDesign,
  updateRootHeight,
} from '../../utils/reducers/designSliceV2';
import { Box } from '@mui/material';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

// to handle actual upload process and update the progress bar accordingly, we'll have to implement the logic for file uploading to the server

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const designId = useSelector((state) => state.designV2._id);
  const { image_url, components } = useSelector((state) => state.designV2);
  const theme = useTheme();
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '70vh',
  };

  const uploadAreaStyles = {
    backgroundColor: 'transparent',
    border: '2px dashed black',
    padding: '100px',
    borderRadius: '12px',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    cursor: 'pointer', // to indicate the area is clickable
  };

  function handleFileChange(file) {
    // set file details
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + 'MB'); // Convert bytes to MB

    // simulate upload progress - this isn't showing
    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    if (file) {
      dispatch(setMessage({ severity: 'success', text: 'Upload successful.' }));

      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();

        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
          if (!designId) {
            try {
              dispatch(newDesign({ userImage, imageHeight }));
            } catch (err) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'App: add new design ' + err,
                })
              );
            }
          } else {
            const url = new URL(image_url);
            try {
              dispatch(
                updateDesign({
                  designId,
                  body: {
                    userImage,
                    imageToDelete: url.pathname.slice(1),
                    imageHeight,
                    rootId: components[0]._id,
                  },
                })
              );
              dispatch(updateRootHeight(imageHeight));
            } catch (err) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'App: replace design image' + err,
                })
              );
            }
          }
        };
        img.src = userImage;
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Fragment>
      {!designId ? (
        // render a Box as a flex container styled with containerStyles
        <Box sx={containerStyles}>
          {/* render another Box as a flex container with uploadAreaStyles */}
          <Box sx={uploadAreaStyles}>
            <FileUploader
              handleChange={handleFileChange}
              name='file'
              types={['JPG', 'PNG']}
              children={
                <>
                  <CloudUploadRoundedIcon
                    style={{ fontSize: '64px', color: 'black' }}
                  />
                  <div style={{ margin: '20px 0', color: 'black' }}>
                    Drag & Drop your files here
                  </div>
                  <Button
                    variant='contained'
                    component='label'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#8D99AE',
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
                      },
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
                </>
              }
            />
            {/* if fileName is set, render a Box with fileName, fileSize, and a LinearProgress component for uploadProgress */}
            {fileName && (
              <Box
                sx={{ textAlign: 'center', color: 'black', marginTop: '10px' }}
              >
                <span>{fileName}</span> - <span>{fileSize}</span>
                <LinearProgress
                  variant='determinate'
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
                  onClick={() => {
                    /* logic to handle file removal */
                  }}
                >
                  X
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Tooltip title='Replace Current Image'>
          <Fab component='label' variant='contained' size='small' color='info'>
            <CloudUploadRoundedIcon />
            <VisuallyHiddenInput
              type='file'
              name='userImage'
              accept='image/*'
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </Fab>
        </Tooltip>
      )}
    </Fragment>
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

// import React, { Fragment } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { FileUploader } from 'react-drag-drop-files';
// import Fab from '@mui/material/Fab';
// import { setMessage } from '../../utils/reducers/appSlice';
// import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
// import Tooltip from '@mui/material/Tooltip';
// import { styled, useTheme } from '@mui/material/styles';
// import {
//   newDesign,
//   updateDesign,
//   updateRootHeight,
// } from '../../utils/reducers/designSliceV2';
// import { Box } from '@mui/material';
// import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';

// export default function UserImageUploadButton() {
//   const dispatch = useDispatch();
//   const designId = useSelector((state) => state.designV2._id);
//   const { image_url, components } = useSelector((state) => state.designV2);
//   const theme = useTheme();

//   function handleFileChange(file) {
//     if (file) {
//       dispatch(setMessage({ severity: 'success', text: 'Upload successful.' }));

//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const userImage = reader.result;
//         const img = new Image();

//         img.onload = () => {
//           const setWidth = 800;
//           const imageHeight = img.height * (setWidth / img.width);
//           if (!designId) {
//             try {
//               dispatch(newDesign({ userImage, imageHeight }));
//             } catch (err) {
//               dispatch(
//                 setMessage({
//                   severity: 'error',
//                   text: 'App: add new design ' + err,
//                 })
//               );
//             }
//           } else {
//             const url = new URL(image_url);
//             try {
//               dispatch(
//                 updateDesign({
//                   designId,
//                   body: {
//                     userImage,
//                     imageToDelete: url.pathname.slice(1),
//                     imageHeight,
//                     rootId: components[0]._id,
//                   },
//                 })
//               );
//               dispatch(updateRootHeight(imageHeight));
//             } catch (err) {
//               dispatch(
//                 setMessage({
//                   severity: 'error',
//                   text: 'App: replace design image' + err,
//                 })
//               );
//             }
//           }
//         };
//         img.src = userImage;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   return (
//     <Fragment>
//       {!designId ? (
//         <Box
//           sx={{
//             ' label': {
//               borderColor: theme.palette.mode === 'light' ? '#736c6c' : 'beige',
//               padding: '80px',
//               marginTop: '150px',
//             },
//             ' svg *': {
//               fill: theme.palette.mode === 'light' ? '#736c6c' : 'beige',
//             },
//           }}
//         >
//           <FileUploader
//             label='Upload or Drop Your Design Image'
//             handleChange={handleFileChange}
//             name='userImage'
//             types={['JPG', 'PNG']}
//           />
//         </Box>
//       ) : (
//         <Tooltip title='Replace Current Image'>
//           <Fab component='label' variant='contained' size='small' color='info'>
//             <CloudUploadRoundedIcon />
//             <VisuallyHiddenInput
//               type='file'
//               name='userImage'
//               accept='image/*'
//               onChange={(e) => handleFileChange(e.target.files[0])}
//             />
//           </Fab>
//         </Tooltip>
//       )}
//     </Fragment>
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
