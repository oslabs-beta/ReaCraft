import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startDesign } from '../utils/reducers/designSlice';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { setMessage } from '../utils/reducers/appSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

export default function UserImageUpload() {
  const dispatch = useDispatch();
  const userImage = useSelector((state) => state.design.userImage);
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        height: 100,
        alignItems: 'center',
      }}
    >
      <Box
        component='form'
        onSubmit={(e) => {
          e.preventDefault();
          const file = e.target.userImage.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const dataUrl = reader.result;
              dispatch(startDesign(dataUrl));
            };
            reader.readAsDataURL(file);
          }
        }}
      >
        <Button
          component='label'
          variant='contained'
          startIcon={<CloudUploadIcon />}
        >
          {userImage ? 'Replace Image' : 'Upload Image'}
          <VisuallyHiddenInput
            type='file'
            name='userImage'
            accept='image/*'
            onChange={(e) => {
              dispatch(
                setMessage({ severity: 'success', text: 'Upload successfully' })
              );
              const file = e.target.files[0];
              console.log(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const dataUrl = reader.result;
                  dispatch(startDesign(dataUrl));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>
      </Box>
    </Box>
  );
}

const VisuallyHiddenInput = styled('input')({
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
