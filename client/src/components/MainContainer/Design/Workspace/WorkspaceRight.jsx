import React, { Fragment } from 'react';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../../../utils/treeNode';
import Codes from '../../../../utils/codesForPage';
import ButtonViewCode from '../../../functionality/Design/ButtonViewCode';
import ButtonViewTree from '../../../functionality/Design/ButtonViewTree';
import ButtonDeletePage from '../../../functionality/Page/ButtonDeletePage';
import ButtonAddPage from '../../../functionality/Page/ButtonAddPage';
import ButtonsPrevNextPage from '../../../functionality/Page/ButtonsPrevNextPage';
import ButtonSetPageAsDesignCover from '../../../functionality/Design/ButtonSetPageAsDesignCover';

export default function WorkspaceRight({ isVertical }) {
  const { pages, _id, canEdit } = useSelector((state) => state.designV3);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const page = pages[selectedPageIdx];
  const components = page.components;
  const { selectedIdx } = useSelector((state) => state.app);
  const tree = convertToTree(components);
  const codes = new Codes(components, tree);
  const { jsx, css } = codes.convertToCode();

  return (
    <Stack
      direction={isVertical ? 'column' : 'row'}
      gap={2}
      sx={{
        '& .MuiButtonBase-root': {
          //changes all the FAB Icons
          boxShadow: 'none',
        },
      }}>
      <ButtonViewCode
        css={css}
        jsx={jsx}
        name={selectedIdx !== null ? components[selectedIdx].name : null}
        pageName={components[0].name}
        isVertical={isVertical}
      />
      <ButtonsPrevNextPage pageIdx={selectedPageIdx} />
      {canEdit && (
        <Fragment>
          <ButtonSetPageAsDesignCover
            designId={_id}
            imageUrl={page.image_url}
          />
          <ButtonAddPage pageIdx={selectedPageIdx} />
          <ButtonDeletePage pageId={page._id} canDelete={pages.length > 1} />
        </Fragment>
      )}
    </Stack>
  );
}
