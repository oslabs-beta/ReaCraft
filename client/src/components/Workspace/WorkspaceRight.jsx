import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ViewDomTreeButton from '../functionalButtons/ViewDomTreeButton';
import ViewCodeButton from '../functionalButtons/ViewCodeButton';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../utils/treeNode';
import { jsxCode } from '../../utils/jsxCode';
import ViewKeyboardShortcut from '../functionalButtons/ViewKeyboardShortcut';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import UserImageUpload from '../functionalButtons/UserImageUploadButton';

export default function WorkspaceRight({ selectedIdx }) {
  const components = useSelector((state) => state.designV2.components);
  const { _id } = useSelector((state) => state.designV2);
  const tree = convertToTree(components);
  const code = jsxCode(components, tree);
  return (
    <Stack width='36px' direction='column' gap={2}>
      <Box
        width='36px'
        height='200px'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <ViewKeyboardShortcut
          sx={{ position: 'absolute', justifySelf: 'end' }}
        />
        <UserImageUpload height='64px' />
        <ViewDomTreeButton tree={tree} />
        <ViewCodeButton
          code={code}
          name={selectedIdx !== null ? components[selectedIdx].name : null}
        />
      </Box>
      <Box maxWidth='false' sx={{ position: 'absolute', top: '50vh' }}>
        <DeleteDesignButton designId={_id} />
      </Box>
    </Stack>
  );
}
