import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ViewDomTreeButton from '../functionalButtons/ViewDomTreeButton';
import ViewCodeButton from '../functionalButtons/ViewCodeButton';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../utils/treeNode';
import Codes from '../../utils/Codes';
import ViewKeyboardShortcut from '../functionalButtons/ViewKeyboardShortcut';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import UserImageUploadButton from '../functionalButtons/UserImageUploadButton';
import DownloadFilesButton from '../functionalButtons/DownloadFilesButton';

export default function WorkspaceRight() {
  const components = useSelector((state) => state.designV2.components);
  const { selectedIdx } = useSelector((state) => state.app);
  const tree = convertToTree(components);
  const codes = new Codes(components, tree);
  const jsx = codes.convertToJsx();
  const css = codes.convertToCss();
  return (
    <Stack direction='column' gap={2}>
      <UserImageUploadButton />
      <ViewDomTreeButton tree={tree} />
      <ViewCodeButton
        css={css}
        jsx={jsx}
        name={selectedIdx !== null ? components[selectedIdx].name : null}
      />
      <DownloadFilesButton jsx={jsx} css={css} />
      <DeleteDesignButton />
    </Stack>
  );
}
