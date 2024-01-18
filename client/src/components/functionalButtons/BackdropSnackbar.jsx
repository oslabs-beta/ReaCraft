import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function BackdropSnackbar({ open, setOpen }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [open]);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
    >
      <Alert severity='info'>Press ESC or double-click to exit.</Alert>
    </Snackbar>
  );
}
