import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../utils/reducers/appSlice';

import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import isValidReactComponentName from '../../utils/isValidReactComponentName';
import { addNewComponent } from '../../utils/reducers/designSliceV3';

const emptyNameErr = {
  severity: 'error',
  text: 'React component name cannot be empty.',
};

const firstCharErr = {
  severity: 'error',
  text: 'React component name must start with an uppercase letter and contain no space.',
};

const successMess = {
  severity: 'success',
  text: 'Adding a component successfully',
};

export default function AddNewComponentButton() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const design = useSelector((state) => state.designV3);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const page = design.pages[selectedPageIdx];
  return (
    <form
      style={{ display: 'flex', width: '200px' }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isValidReactComponentName(name)) {
          try {
            dispatch(
              addNewComponent({
                pageId: page._id,
                body: {
                  index: page.components.length,
                  rootId: page.components[0]._id,
                  name,
                },
              })
            );
            dispatch(setMessage(successMess));
            setName('');
          } catch (error) {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'Design: add new component ' + error,
              })
            );
          }
        } else {
          const errMessage = name.length === 0 ? emptyNameErr : firstCharErr;
          dispatch(setMessage(errMessage));
        }
      }}
    >
      <TextField
        size='small'
        id='new-component'
        name='newComponent'
        label='New Component'
        variant='outlined'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Tooltip title='Add new component'>
        <IconButton size='small' type='submit'>
          {/*controls the size of the "+" button next to the TextField */}
          <AddCircleIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </form>
  );
}
