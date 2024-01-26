import React from 'react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { downloadProject } from '../../../utils/fetchRequests';

export default function ButtonDownloadFiles({ jsx, css }) {
  const title = useSelector((state) => state.designV2.title);
  async function handleClick() {
    const filesData = [];
    Object.keys(jsx).forEach((name) =>
      filesData.push({ filename: name + '.jsx', content: jsx[name] })
    );
    filesData.push({
      filename: 'styles.css',
      content: css,
    });
    try {
      const blob = await downloadProject({ filesData, title });
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
      <Fab size='small' color='success' onClick={handleClick}>
        <DownloadForOfflineIcon />
      </Fab>
    </Tooltip>
  );
}
