import React, { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { updateDesignCoverOrTitleAndUpdateState } from '../../../utils/reducers/designSliceV3';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

export default function InputDesignTitle() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const design = useSelector((state) => state.designV3);
  const [title, setTitle] = useState(design.title);

  return (
    <Fragment>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            m: '10px',
            width: '20ch',
            backgroundColor: '#d9d0c7',
          },
        }}
      >
        <TextField
          variant='filled'
          label='Design Name'
          className='designTitle'
          value={title}
          sx={{
            boxShadow: 'none !important',
            backgroundColor: `${theme.palette.mode === 'light' ? '#c0c0c0' : '#8796A5'} !important`,
            '& .MuiInputLabel-root': {
              color: 'white',
              '&.Mui-focused': {
                color: 'white',
              },
            },
            '& .MuiFilledInput-underline:before': {
              borderBottomColor: 'white',
            },
            '& .MuiFilledInput-root': {
              '&:after': {
                borderBottomColor: 'white',
              }
            }
          }}
          disabled={!design.canEdit}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title !== design.title) {
              try {
                dispatch(
                  updateDesignCoverOrTitleAndUpdateState({
                    designId: design._id,
                    title,
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
            }
          }}
          noValidate
          autoComplete='off'
        />
      </Box>
    </Fragment>
  );
}
