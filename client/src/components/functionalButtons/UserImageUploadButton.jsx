import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { setMessage } from '../../utils/reducers/appSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { newDesign, updateDesign } from '../../utils/reducers/designSliceV2';

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const designId = useSelector((state) => state.designV2._id);
  const image_url = useSelector((state) => state.designV2.image_url);
  return (
    <Button
      component='label'
      variant='contained'
      startIcon={<CloudUploadIcon />}
    >
      {designId ? 'Replace Image' : 'Upload Image'}
      <VisuallyHiddenInput
        type='file'
        name='userImage'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files[0];
          console.log(file);
          if (file) {
            dispatch(
              setMessage({ severity: 'success', text: 'Upload successfully' })
            );
            const reader = new FileReader();
            reader.onloadend = async () => {
              const userImage = reader.result;
              if (!designId) {
                dispatch(newDesign({ userImage }));
              } else {
                const url = new URL(image_url);
                dispatch(
                  updateDesign({
                    designId,
                    body: {
                      userImage,
                      imageToDelete: url.pathname.slice(1),
                    },
                  })
                );
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </Button>
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
