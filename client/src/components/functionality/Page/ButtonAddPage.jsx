import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../../utils/reducers/appSlice';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { addNewPageAndUpdateSelectedPageIdx } from '../../../utils/reducers/designSliceV3';
import { styled } from '@mui/material/styles';

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

  function handleFileChange(e) {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();
        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
          console.log('userImage');
          try {
            dispatch(
              addNewPageAndUpdateSelectedPageIdx({
                designId: _id,
                userImage,
                imageHeight,
              })
            );
          } catch (err) {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'App: uploading image for new page' + err,
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
  );
}
