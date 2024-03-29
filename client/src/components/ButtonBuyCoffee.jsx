import React, { Fragment, useState, useRef } from 'react';
import Fab from '@mui/material/Fab';
import Grow from '@mui/material/Grow';
import useOutsideClick from '../hooks/useOutsideClick';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

export default function ButtonBuyCoffee() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const closePopper = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAnchorEl(null);
      setIsTransitioning(false);
    }, 225);
  };
  return (
    <Fragment>
      <Tooltip title='Buy us a coffee'>
        <Fab
          color='secondary'
          size='large'
          sx={{
            position: 'fixed',
            right: '50px',
            bottom: '50px',
            backgroundColor: 'white',
            '& svg': { transform: 'scale(2)' },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <img src='./assets/bmc_logo.svg' />
        </Fab>
      </Tooltip>
      {anchorEl && (
        <QrCodePopper
          anchorEl={anchorEl}
          onClose={closePopper}
          isTransitioning={isTransitioning}
        />
      )}
    </Fragment>
  );
}

function QrCodePopper({ anchorEl, onClose, isTransitioning }) {
  const popperRef = useRef(null);

  useOutsideClick(popperRef, () => {
    if (anchorEl && onClose) onClose();
  });
  return (
    <Popper
      ref={popperRef}
      sx={{
        color: '#fff',
        marginRight: '20px',
        zIndex: 100000,
      }}
      open={Boolean(anchorEl)}
      placement='left-end'
      anchorEl={anchorEl}
    >
      <Grow
        in={!isTransitioning}
        style={{ transformOrigin: 'center right' }}
        timeout={255}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src='../assets/puss-in-boots-cat.gif' width='120px' />
          <a href='https://www.buymeacoffee.com/reacraft'>
            <img
              src='../assets/bmc_qr.png'
              width='300px'
              style={{ borderRadius: '20px' }}
            />
          </a>
        </Box>
      </Grow>
    </Popper>
  );
}
