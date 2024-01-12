import React from 'react';
import { useDispatch } from 'react-redux';
import { addComponent } from '../../utils/reducers/designSlice';
import { setMessage } from '../../utils/reducers/appSlice';

import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import isValidReactComponentName from '../../utils/isValidReactComponentName';

const emptyNameErr = {
  severity: 'error',
  text: 'React component name cannot be empty.',
};

const firstCharErr = {
  severity: 'error',
  text: 'React component name must start with an uppercase letter.',
};

const successMess = {
  severity: 'success',
  text: 'Adding a component successfully',
};

export default function AddNewComponent() {
  const dispatch = useDispatch();
  return (
    <form
      style={{ display: 'flex' }}
      onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.newComponent.value;
        if (isValidReactComponentName(name)) {
          dispatch(addComponent(name));
          dispatch(setMessage(successMess));
        } else {
          const errMessage = name.length === 0 ? emptyNameErr : firstCharErr;
          dispatch(setMessage(errMessage));
        }
      }}
    >
      <TextField
        id='new-component'
        name='newComponent'
        label='New Component'
        variant='outlined'
      />
      <IconButton type='submit'>
        <AddCircleIcon />
      </IconButton>
    </form>
  );
}
