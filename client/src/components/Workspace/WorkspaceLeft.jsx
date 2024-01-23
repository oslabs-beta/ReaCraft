import React, { useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import AddNewComponent from '../functionalButtons/AddNewComponentButton';
import ComponentEditor from '../userInputs/ComponentEditorForm';
import DeleteComponentButton from '../functionalButtons/DeleteComponentButton';
import { ThemeProvider, useTheme } from '@mui/material';
import { WorkspaceLeftLightTheme } from '../../styles/WorkspaceLeftTheme';

import { setSelectedIdx } from '../../utils/reducers/appSlice';

export default function WorkspaceLeft() {
  const components = useSelector((state) => state.designV2.components);
  const theme = useTheme();
  const WorkspaceLeftTheme =
    theme.palette.mode === 'dark' ? theme : WorkspaceLeftLightTheme;

  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={WorkspaceLeftTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          zIndex: 1,
        }}
      >
        <Box sx={{ paddingLeft: '50px', marginRight: '20px' }}>
          <AddNewComponent />
        </Box>

        <List sx={{ zIndex: 1 }}>
          {components.map((item, idx) => (
            <ComponentDisplay
              component={item}
              key={idx}
              idx={idx}
              handleListItemClick={(e) => {
                e.stopPropagation();
                dispatch(setSelectedIdx(idx));
              }}
              isLeaf={
                idx > 0 &&
                components.filter((e) => e.parent_id === item._id).length === 0
              }
            />
          ))}
        </List>
      </Box>
    </ThemeProvider>
  );
}

function ComponentDisplay({ component, idx, handleListItemClick, isLeaf }) {
  const [openEditor, setOpenEditor] = useState(false);
  const selectedIdx = useSelector((state) => state.app.selectedIdx);
  const selected = selectedIdx === idx;

  return (
    <Box sx={{ marginRight: '20px', width: '200px' }}>
      <ListItemButton
        value='NewComponentInputBox'
        selected={selected}

        onClick={handleListItemClick}
      >
        <ListItemText primary={component.name} />
        {selected && (
          <IconButton
            sx={{ marginLeft: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenEditor(true);

            }}>
            <EditIcon />
          </IconButton>
        )}
        <ComponentEditor
          idx={idx}
          open={openEditor}
          closeEditor={() => setOpenEditor(false)}
          isLeaf={isLeaf}
        />
        {idx > 0 && selected && (
          <DeleteComponentButton
            name={component.name}
            componentId={component._id}
            canDelete={isLeaf}
          />
        )}
      </ListItemButton>
    </Box>
  );
}
