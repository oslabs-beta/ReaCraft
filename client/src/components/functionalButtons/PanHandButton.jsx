import React, { Fragment, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import PanToolRoundedIcon from '@mui/icons-material/PanToolRounded';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';

export default function PanToolButton() {
  return (
    <Fragment>
      <Tooltip title='Pan Tool Button'>
        <IconButton size='small' component='label' variant='contained'>
          <PanToolRoundedIcon size='sm' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Pan Tool Button'>
        <IconButton size='small' component='label' variant='contained'>
          <NearMeRoundedIcon size='sm' />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
}
