import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../utils/reducers/appSlice';

import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import isValidReactComponentName from '../../utils/isValidReactComponentName';
import { addNewComponent } from '../../utils/reducers/designSliceV2';

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

export default function AddNewComponentButton() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const design = useSelector((state) => state.designV2);
  return (
    <form
      style={{ display: 'flex' }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isValidReactComponentName(name)) {
          dispatch(
            addNewComponent({
              designId: design._id,
              body: {
                index: design.components.length,
                rootId: design.components[0]._id,
                name,
              },
            })
          );
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
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <IconButton type='submit'>
        <AddCircleIcon />
      </IconButton>
    </form>
  );
}
