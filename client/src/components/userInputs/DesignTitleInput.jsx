import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { updateDesign } from '../../utils/reducers/designSliceV2';
import Box from '@mui/material/Box';

export default function DesignTitleInput() {
  const dispatch = useDispatch();
  const design = useSelector((state) => state.designV2);
  const [title, setTitle] = useState(design.title);
  return (
    <Box>
      <TextField
        variant='filled'
        label='Design Name'
        className='designTitle'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          dispatch(updateDesign({ designId: design._id, body: { title } }));
        }}
      />
    </Box>
  );
}
