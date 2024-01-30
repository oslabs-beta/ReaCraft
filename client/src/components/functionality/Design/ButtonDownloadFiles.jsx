import React from 'react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { downloadProject } from '../../../utils/fetchRequests';
import { convertToTree } from '../../../utils/treeNode';
import Codes from '../../../utils/codesForPage';
import { jsxCodeForApp } from '../../../utils/codesForApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
export default function ButtonDownloadFiles() {
  const { title, pages } = useSelector((state) => state.designV3);

  async function handleClick() {
    const pagesData = {};
    pages.forEach((page, i) => {
      const components = page.components;
      const tree = convertToTree(components);
      const codes = new Codes(components, tree);
      const { jsx, css } = codes.convertToCode();
      const filesData = [];
      Object.keys(jsx).forEach((name) =>
        filesData.push({ filename: name + '.jsx', content: jsx[name] })
      );
      filesData.push({
        filename: `Page${i}.css`,
        content: css,
      });
      pagesData[`Page${i}`] = filesData;
    });
    try {
      const blob = await downloadProject({
        pagesData,
        appData: {
          filename: 'App.jsx',
          content: jsxCodeForApp(pages.length, title),
        },
        title,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {}
  }
  return (
    <Tooltip title='Download code files'>
      <Fab
        size='small'
        color='success'
        onClick={handleClick}
        sx={{
          '& svg': {
            transform: 'scale(1.2)',
          },
        }}
      >
        <FontAwesomeIcon icon={faDownload} />
      </Fab>
    </Tooltip>
  );
}
