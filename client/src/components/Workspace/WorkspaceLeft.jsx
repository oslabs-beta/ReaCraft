import React, { useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import ParentSelector from '../userInputs/ParentSelector';
import AddNewComponent from '../functionalButtons/AddNewComponentButton';
import ComponentEditor from '../userInputs/ComponentEditorForm';
import HtmlTagSelector from '../userInputs/HtmlTagSelector';
import DeleteComponentButton from '../functionalButtons/DeleteComponentButton';
import { ThemeProvider, useTheme } from '@mui/material';
import { WorkspaceLeftLightTheme } from '../../styles/WorkspaceLeftTheme';
import DesignTitleInput from '../userInputs/DesignTitleInput';

export default function WorkspaceLeft({ selectedIdx, setSelectedIdx }) {
  const components = useSelector((state) => state.designV2.components);
  const theme = useTheme();
  const WorkspaceLeftTheme =
    theme.palette.mode === 'dark' ? theme : WorkspaceLeftLightTheme;

  return (
    <ThemeProvider theme={WorkspaceLeftTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <AddNewComponent size='sm' setSelectedIdx={setSelectedIdx} />
        <List width='75%'>
          {components.map((item, idx) => (
            <ComponentDisplay
              width='75%'
              component={item}
              key={idx}
              idx={idx}
              handleListItemClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(idx);
              }}
              selectedIdx={selectedIdx}
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

function ComponentDisplay({
  component,
  idx,
  handleListItemClick,
  selectedIdx,
  isLeaf,
}) {
  const [openEditor, setOpenEditor] = useState(false);
  const selected = selectedIdx === idx;

  return (
    <Box>
      <ListItemButton
        value='NewComponentInputBox'
        selected={selected}
        // onClick={() => handleListItemClick(idx)}
        // i added this
        onClick={handleListItemClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px',
          width: '75%',
        }}>
        <Box
          sx={{
            display: 'flex',
            width: '75%',
          }}>
          <Box>
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
          </Box>
          <Box>
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
          </Box>
        </Box>

        {selected && (
          <Fragment>
            <ParentSelector childIdx={idx} />
            {isLeaf && <HtmlTagSelector idx={idx} isLeaf={isLeaf} />}
          </Fragment>
        )}
      </ListItemButton>
    </Box>
  );
}
