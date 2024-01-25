import React from 'react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

import JSZip from 'jszip';

export default function DownloadFilesButton({ jsx, css }) {
  function handleClick() {
    const files = {};
    Object.keys(jsx).forEach((name) => (files[name + '.jsx'] = jsx[name]));
    files['styles.css'] = Object.values(css).join('\n\n');
    async function createAndDownloadZip() {
      const zip = new JSZip();
      for (const [filename, content] of Object.entries(files)) {
        zip.file(filename, content);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'example.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    createAndDownloadZip();
  }
  return (
    <Tooltip title='Download code files'>
      <Fab size='small' color='success' onClick={handleClick}>
        <DownloadForOfflineIcon />
      </Fab>
    </Tooltip>
  );
}
