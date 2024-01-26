import React from 'react';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../../../utils/treeNode';
import Codes from '../../../../utils/Codes';

import UserImageUploadButton from '../../../functionality/Page/UserImageUploadButton';
import ButtonDeleteDesign from '../../../functionality/Design/ButtonDeleteDesign';
import ButtonViewCode from '../../../functionality/Design/ButtonViewCode';
import ButtoViewTree from '../../../functionality/Design/ButtoViewTree';
import ButtonDownloadFiles from '../../../functionality/Component/ButtonDownloadFiles';

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
      <ButtoViewTree tree={tree} />
      <ButtonViewCode
        css={css}
        jsx={jsx}
        name={selectedIdx !== null ? components[selectedIdx].name : null}
      />

      <ButtonDownloadFiles jsx={jsx} css={css} />
      <ButtonDeleteDesign />
    </Stack>
  );
}
