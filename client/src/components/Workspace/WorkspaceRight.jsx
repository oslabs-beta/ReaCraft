import React from 'react';
import Stack from '@mui/material/Stack';
import ViewDomTreeButton from '../functionalButtons/ViewDomTreeButton';
import ViewCodeButton from '../functionalButtons/ViewCodeButton';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../utils/treeNode';
import { jsxCode } from '../../utils/jsxCode';

export default function WorkspaceRight({ selectedIdx }) {
  const components = useSelector((state) => state.designV2.components);
  const tree = convertToTree(components);
  const code = jsxCode(components, tree);
  return (
    <Stack direction='column' gap={2}>
      <ViewDomTreeButton tree={tree} />
      {typeof selectedIdx === 'number' && (
        <ViewCodeButton
          code={code[components[selectedIdx].name]}
          name={components[selectedIdx].name}
        />
      )}
    </Stack>
  );
}
