import React, { useState, Fragment } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

export default function ButtonSortPastDesigns({ pastDesigns, setPastDesigns }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  function handleSort(attr) {
    if (attr === 'title') {
      setPastDesigns(
        pastDesigns.toSorted((a, b) => a[attr].localeCompare(b[attr]))
      );
    } else {
      setPastDesigns(pastDesigns.toSorted((a, b) => a[attr] - b[attr]));
    }
    setAnchorEl(null);
  }
  return (
    <Fragment>
      <Tooltip title='sort past designs'>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            '& svg': {
              transform: 'scale(0.6)',
            },
          }}
        >
          <FontAwesomeIcon icon={faSort} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleSort('title')}>by title</MenuItem>
        <MenuItem onClick={() => handleSort('created_at')}>
          by created_at
        </MenuItem>
        <MenuItem onClick={() => handleSort('last_updated')}>
          by last_updated
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
