import React, { Fragment } from 'react';
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

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      dispatch(
        setMessage({ severity: 'success', text: 'Upload successfully' })
      );

      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();

        img.onload = () => {
          console.log('width, height are', img.width, img.height);

          const maxWidth = 800;
          const imageWidth = Math.min(img.width, maxWidth);
          const imageHeight = img.height * (imageWidth / img.width);

          if (!designId) {
            dispatch(newDesign({ userImage, imageWidth, imageHeight }));
          } else {
            const url = new URL(image_url);
            dispatch(
              updateDesign({
                designId,
                body: {
                  userImage,
                  imageToDelete: url.pathname.slice(1),
                  imageWidth,
                  imageHeight,
                },
              })
            );
          }
        };

        img.src = userImage;
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Fragment>
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
          onChange={handleFileChange}
        />
      </Button>
      <img id='user-image' style={{ display: 'none' }} />
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
