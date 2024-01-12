import React, { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useSelector, useDispatch } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {
  removeComponent,
  selectComponent,
} from '../utils/reducers/designSlice';
import { setMessage } from '../utils/reducers/appSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ParentSelector from './userInputs/ParentSelector';
import AddNewComponent from './userInputs/AddNewComponent';
import ComponentEditor from './userInputs/ComponentEditor';
import HtmlTagSelector from './userInputs/HtmlTagSelector';
import { MUIColorInput } from 'mui-color-input';

export default function WorkspaceLeft() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const components = useSelector((state) => state.design.components);
  console.log('components in WorkspaceLeft: ', components);
  // need this to use in KonvaStage
  const selectedComponent = useSelector(state => state.design.selectedComponent);
  console.log('current selected component in workspaceLeft', selectedComponent)

  // updated selectedIdx based on the selectedComponent from the redux state
  useEffect(() => {
    console.log(`Selected component from Redux in useEffect: ${selectedComponent}`);
    // find the index of the component that matches the selectedComponent
    const idx = components.findIndex(c => c.name === selectedComponent);
    console.log(`this is the idx found from the useEffect in workspaceLeft: ${idx}`);

    if (idx !== -1) {
      setSelectedIdx(idx);
      console.log('WorkspaceLeft useEffect: selectedIdx updated to', idx);
    } else {
      console.log('Selected component not found in the components array');
      setSelectedIdx(null);
    }
  }, [selectedComponent, components]);

  console.log('components in WorkspaceLeft: ', components);

  return (
    <Box>
      <AddNewComponent setSelectedIdx={setSelectedIdx} />
      <List>
        {components.map((item, idx) => (
          <ComponentDisplay
            component={item}
            key={idx}
            idx={idx}
            handleListItemClick={() => setSelectedIdx(idx)}
            selected={selectedIdx === idx}
          />
        ))}
      </List>
    </Box>
  );
}

function ComponentDisplay({ component, idx, handleListItemClick, selected }) {
  console.log(`ComponentDisplay render: ${component.name}, selected: ${selected}`);
  const dispatch = useDispatch();
  const childrenNum = useSelector((state) => state.design.components).filter(
    (item) => item.parent === idx
  ).length;
  const isLeaf = childrenNum === 0 && idx > 0;
  const [color, setColor] = useState('#fff');

  const onClickHandler = () => {
    handleListItemClick(idx);
    dispatch(selectComponent(component.name));
  };

  const [openEditor, setOpenEditor] = useState(false);

  return (
    <ListItemButton
      selected={selected}
      // onClick={() => handleListItemClick(idx)}
      // i added this
      onClick={onClickHandler}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText primary={component.name} />
        <IconButton
          sx={{ marginLeft: '20px' }}
          onClick={() => setOpenEditor(true)}
        >
          <EditIcon />
        </IconButton>
        <ComponentEditor
          idx={idx}
          open={openEditor}
          closeEditor={() => setOpenEditor(false)}
        />

        {idx > 0 && (
          <Delete name={component.name} idx={idx} canDelete={isLeaf} />
        )}
      </Box>

      {selected && (
        <Fragment>
          <ParentSelector childIdx={idx} />
          {isLeaf && <HtmlTagSelector idx={idx} isLeaf={isLeaf} />}
        </Fragment>
      )}
    </ListItemButton>
  );
}

function Delete({ name, idx, canDelete }) {
  const dispatch = useDispatch();
  const message = canDelete
    ? {
        severity: 'success',
        text: 'Successfully removed a component ' + name,
      }
    : {
        severity: 'error',
        text: `Component ${name} has children. Failed to remove`,
      };

  return (
    <IconButton
      onClick={() => {
        if (canDelete) {
          dispatch(removeComponent(idx));
        }
        dispatch(setMessage(message));
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}
