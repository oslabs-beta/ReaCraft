import React, { Fragment } from 'react';
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

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const designId = useSelector((state) => state.designV2._id);
  const { image_url, components } = useSelector((state) => state.designV2);
  const theme = useTheme();

  function handleFileChange(file) {
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
    <Box
      sx={{
        ' label': {
          borderColor: theme.palette.mode === 'light' ? '#736c6c' : 'beige',
          padding: '80px',
          marginTop: '150px',
        },
        ' svg *': {
          fill: theme.palette.mode === 'light' ? '#736c6c' : 'beige',
        },
      }}
    >
      {!designId ? (
        <FileUploader
          label='Upload or Drop Your Design Image'
          handleChange={handleFileChange}
          name='userImage'
          types={['JPG', 'PNG']}
        />
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
