import React, { useState } from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { addDesign } from '../../utils/fetchRequests';
import { resetApp, setMessage } from '../../utils/reducers/appSlice';
import { resetDesign } from '../../utils/reducers/designSlice';
import { convertArrToObj } from '../../utils/convertBetweenObjArr';

export default function SaveDesign() {
  const { userImage, created_at, components } = useSelector(
    (state) => state.design
  );
  const [stage, setStage] = useState('before');
  const dispatch = useDispatch();

  return (
    <Box
      component='form'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        setStage('saving');
        const body = { userImage, created_at };
        body.title = e.target.title.value;

        const componentData = components.map((item, i) => ({
          ...item,
          index: i,
          styles: convertArrToObj(item.styles),
          props: convertArrToObj(item.props),
          hooks: convertArrToObj(item.hooks),
        }));
        body.componentsStr = JSON.stringify(componentData);
        console.log(body);
        try {
          const response = await addDesign(body);
          setStage('saved');
          dispatch(
            setMessage({
              severity: 'success',
              text: 'Design saved successfully.',
            })
          );
          setTimeout(() => {
            dispatch(resetApp());
            dispatch(resetDesign());
          }, 2000);
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <TextField name='title' label='Name your design' />
      <Button
        type='submit'
        variant='contained'
        startIcon={<PublishIcon />}
        disabled={stage !== 'before'}
      >
        {stage === 'saving' ? <CircularProgress /> : 'Save your design'}
      </Button>
    </Box>
  );
}
