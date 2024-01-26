import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';

import { setSelectedIdx } from '../../../..//utils/reducers/appSlice';

import SelectorParent from '../../../functionality/Component/SelectorParent';
import FormComponentEditor from '../../../functionality/Component/FormComponentEditor';
import ButtonComponentDelete from '../../../functionality/Component/ButtonComponentDelete';
import ButtonAddNewComponent from '../../../functionality/Component/ButtonAddNewComponent';
import ButtonGroupRectangleStyle from '../../../functionality/KonvaCanvas/ButtonGroupRectangleStyle';

export default function WorkspaceLeft() {
  const { pages } = useSelector((state) => state.designV3);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const page = pages[selectedPageIdx];
  const components = page.components;
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        paddingTop: '10px',
      }}
    >
      <Box sx={{ paddingLeft: '50px', marginRight: '20px' }}>
        <ButtonAddNewComponent />
      </Box>

      <List sx={{ width: '100%' }}>
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
  );
}

function ComponentDisplay({ component, idx, handleListItemClick, isLeaf }) {
  const [openEditor, setOpenEditor] = useState(false);
  const selectedIdx = useSelector((state) => state.app.selectedIdx);
  const selected = selectedIdx === idx;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ListItemButton
        value='NewComponentInputBox'
        selected={selected}
        onClick={handleListItemClick}
        sx={{ width: '100%', paddingLeft: '40px' }}
      >
        <ListItemText primary={component.name} />
        {selected && (
          <Fragment>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenEditor(true);
              }}
            >
              <EditIcon />
            </IconButton>
            {idx > 0 && (
              <ButtonComponentDelete
                name={component.name}
                componentId={component._id}
                canDelete={isLeaf}
              />
            )}
          </Fragment>
        )}
        <FormComponentEditor
          idx={idx}
          open={openEditor}
          closeEditor={() => setOpenEditor(false)}
          isLeaf={isLeaf}
        />
      </ListItemButton>
      {selected && idx > 0 && (
        <Box
          sx={{
            padding: '0 20px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <SelectorParent childIdx={idx} />
          <ButtonGroupRectangleStyle rectangle={component.rectangle} />
        </Box>
      )}
    </Box>
  );
}
