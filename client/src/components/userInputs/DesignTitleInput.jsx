import React, { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { updateDesign } from '../../utils/reducers/designSliceV2';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function DesignTitleInput() {
  const dispatch = useDispatch();
  const design = useSelector((state) => state.designV2);
  const [title, setTitle] = useState(design.title);
  return (
    <Fragment>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: '10px', width: '20ch' },
        }}
      >
        <TextField
          variant='filled'
          label='Design Name'
          className='designTitle'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            try {
              dispatch(
                updateDesign({
                  designId: design._id,
                  body: { title },
                })
              );
            } catch (error) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'Design: update title in workspace ' + err,
                })
              );
            }
          }}
          noValidate
          autoComplete='off'
        />
      </Box>
    </Fragment>
  );
}
