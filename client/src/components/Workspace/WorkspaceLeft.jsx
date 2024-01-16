import React, { useState, useEffect, Fragment } from 'react';
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
import ColorPicker from '../ColorPicker';

export default function WorkspaceLeft({ selectedIdx, setSelectedIdx }) {
  const components = useSelector((state) => state.designV2.components);

  return (
    <Box value='NewComponentBox' maxHeight='45px'>
      <AddNewComponent setSelectedIdx={setSelectedIdx} />
      <List>
        {components.map((item, idx) => (
          <ComponentDisplay
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
    <ListItemButton
      value='NewComponentInputBox'
      selected={selected}
      // onClick={() => handleListItemClick(idx)}
      // i added this
      onClick={handleListItemClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText primary={component.name} />
        {selected && (
          <IconButton
            sx={{ marginLeft: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenEditor(true);
            }}
          >
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
      </Box>

      {selected && (
        <Fragment>
          <ParentSelector childIdx={idx} />
          {isLeaf && <HtmlTagSelector idx={idx} isLeaf={isLeaf} />}
          <ColorPicker
            componentId={component._id}
            initialColor={component.borderColor || '#fff'}
          />
        </Fragment>
      )}
    </ListItemButton>
  );
}
