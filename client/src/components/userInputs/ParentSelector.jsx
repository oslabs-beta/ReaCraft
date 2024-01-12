import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { setParent } from '../../utils/reducers/designSlice';
import { setMessage } from '../../utils/reducers/appSlice';
import { Button } from '@mui/material';
import { validTree } from '../../utils/treeNode';

export default function ParentSelector({ childIdx }) {
  const components = useSelector((state) => state.design.components);
  const dispatch = useDispatch();
  const parent = components[childIdx].parent;

  const name = parent ? components[parent].name : 'MainContainer';
  const index = parent ? parent : 0;

  const [parentValue, setParentValue] = useState(
    JSON.stringify({ name, index })
  );

  if (childIdx > 0) {
    return (
      <TextField
        select
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
        }}
      >
        {components.map((item, i) =>
          i !== childIdx ? (
            <MenuItem
              key={i}
              value={JSON.stringify({ name: item.name, index: i })}
            >
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
        }
      >
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
