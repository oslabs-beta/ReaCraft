import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { setMessage } from '../../utils/reducers/appSlice';
import { Button, useTheme } from '@mui/material';
import { validTree } from '../../utils/treeNode';
import { updateComponentParent } from '../../utils/reducers/designSliceV2';

export default function ParentSelector({ childIdx }) {
  if (childIdx > 0) {
    const pages = useSelector((state) => state.designV3.pages);
    const { selectedPageIdx } = useSelector((state) => state.app);
    const components = pages[selectedPageIdx].components;
    const dispatch = useDispatch();

    const child = components[childIdx];
    const parentId = child.parent_id;
    const parent = components.filter((item) => item._id === parentId)[0];
    console.log('parent', parent);

    const theme = useTheme();

    const [parentValue, setParentValue] = useState(
      JSON.stringify({ name: parent.name, index: parent.index })
    );
    return (
      <TextField
        sx={{
          '& .MuiInputBase-root': {
            color:
              (theme.palette.mode === 'light' ? '#736c6c' : 'white') +
              ' !important',
          },
        }}
        select
        display='flex'
        fullWidth={true}
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
              `Successfully set ${components[parentIdx].name}(${parentIdx}) to be the parent of ${child.name}(${childIdx}). \n` +
              `${components[parentIdx].name}(${parentIdx}) has been set to <div> and inner_html string removed`,
          };

          const errorMess = {
            severity: 'error',
            text: `Invalid tree: cannot ${components[parentIdx].name}(${parentIdx}) to be the parent of ${child.name.name}(${childIdx}).`,
          };

          const updatedComponents = components.map((item, idx) =>
            idx !== childIdx
              ? item
              : { ...item, parent_id: components[parentIdx]._id }
          );
          const success = validTree(updatedComponents);
          try {
            if (success) {
              dispatch(
                updateComponentParent({
                  componentId: child._id,
                  body: {
                    parentId: components[parentIdx]._id,
                    pageIdx: selectedPageIdx,
                  },
                })
              );
              setParentValue(e.target.value);
            }
            dispatch(setMessage(success ? successMess : errorMess));
          } catch (error) {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'Design: update component parent' + err,
              })
            );
          }
        }}
      >
        {components.map((item, i) =>
          i !== childIdx ? (
            <MenuItem
              size='small'
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
