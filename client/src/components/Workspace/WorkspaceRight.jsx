import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ViewDomTreeButton from '../functionalButtons/ViewDomTreeButton';
import ViewCodeButton from '../functionalButtons/ViewCodeButton';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../utils/treeNode';
import Codes from '../../utils/Codes';
import DeleteDesignButton from '../functionalButtons/DeleteDesignButton';
import UserImageUploadButton from '../functionalButtons/UserImageUploadButton';
import DownloadFilesButton from '../functionalButtons/DownloadFilesButton';

export default function WorkspaceRight({ canvasWidth }) {
  const { title, pages } = useSelector((state) => state.designV3);
  const components = pages[0].components;
  const { selectedIdx, windowWidth } = useSelector((state) => state.app);
  const tree = convertToTree(components);
  const codes = new Codes(components, tree, title);
  const { jsx, css } = codes.convertToCode();

  return (
    <Stack
      direction={windowWidth - 320 > canvasWidth ? 'column' : 'row'}
      gap={2}
    >
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
