import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { setParent } from '../../utils/reducers/designSlice';
import { setMessage } from '../../utils/reducers/appSlice';
import { Button } from '@mui/material';
import { validTree } from '../../utils/treeNode';

export default function ParentSelector({ childIdx }) {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.design.components);
  const [parentValue, setParentValue] = useState(
    JSON.stringify({ name, index })
  );

  const parent = components[childIdx].parent;
  const name = parent ? components[parent].name : 'MainContainer';
  const index = parent ? parent : 0;

  if (childIdx > 0) {
    return (
      <TextField
        select
        display='flex'
        fullWidth='true'
        size='small'
        key={childIdx}
        label='parent'
        name='parent'
        value={parentValue}
        onChange={(e) => {
          const parentIdx = JSON.parse(e.target.value).index;

          const successMess = {
            severity: 'success',
            text:
              `Successfully set ${components[parentIdx].name}(${parentIdx}) to be the parent of ${components[childIdx].name}(${childIdx}). \n` +
              `${components[parentIdx].name}(${parentIdx}) has been set to <div> and inner_html string removed`,
          };

          const errorMess = {
            severity: 'error',
            text: `Invalid tree: cannot ${components[parentIdx].name}(${parentIdx}) to be the parent of ${components[childIdx].name}(${childIdx}).`,
          };

          const updatedComponents = components.map((item, idx) =>
            idx !== childIdx ? item : { ...item, parent: parentIdx }
          );
          const success = validTree(updatedComponents);
          if (success) {
            dispatch(setParent({ childIdx, parentIdx }));
            setParentValue(e.target.value);
          }
          dispatch(setMessage(success ? successMess : errorMess));
        }}>
        {components.map((item, i) =>
          i !== childIdx ? (
            <MenuItem
              size='small'
              key={i}
              value={JSON.stringify({ name: item.name, index: i })}>
              {item.name + ', ' + i}
            </MenuItem>
          ) : null
        )}
      </TextField>
    );
  } else
    return (
      <Button
        onClick={() =>
          dispatch(
            setMessage({
              severity: 'error',
              text: "'MainContainer' has to be the root component",
            })
          )
        }>
        <TextField
          disabled
          id='parent'
          label='parent'
          defaultValue='null'
          variant='outlined'
        />
      </Button>
    );
}
