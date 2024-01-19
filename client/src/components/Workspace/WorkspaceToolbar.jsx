import React, { Fragment, useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { MuiColorInput } from 'mui-color-input';
import { useDispatch } from 'react-redux';
import { updateComponentRectangleStyle } from '../../utils/reducers/designSliceV2';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LineStyleRoundedIcon from '@mui/icons-material/LineStyleRounded';
import Slider from '@mui/material/Slider';

import '../../styles/workspaceToolbar.scss';

export default function WorkspaceToolbar({ rectangle }) {
  const [color, setColor] = useState(rectangle.backgroundcolor || '#00000000');
  const [anchorEl, setAnchorEl] = useState(null);
  const openBorderMenu = Boolean(anchorEl);

  const dispatch = useDispatch();

  function handleSubmit(styleToChange, value) {
    const componentId = rectangle.component_id;
    console.log(styleToChange, value);
    dispatch(
      updateComponentRectangleStyle({
        componentId,
        body: { styleToChange, value },
      })
    );
  }
  return (
    <ButtonGroup variant='outlined'>
      <Tooltip title='Change background color'>
        <Button variant='outlined' className='background-picker'>
          <MuiColorInput
            sx={{ border: 'none' }}
            value={color}
            onChange={(val) => {
              setColor(val);
              handleSubmit('backgroundColor', val);
            }}
          />
        </Button>
      </Tooltip>

      <Fragment>
        <Tooltip title='border styles'>
          <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
            <LineStyleRoundedIcon />
          </Button>
        </Tooltip>
        <BorderMenu
          openBorderMenu={openBorderMenu}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleSubmit={handleSubmit}
          rectangle={rectangle}
        />
      </Fragment>
    </ButtonGroup>
  );
}

function BorderMenu({
  openBorderMenu,
  anchorEl,
  setAnchorEl,
  rectangle,
  handleSubmit,
}) {
  const [color, setColor] = useState(rectangle.stroke);
  const [borderWidth, setBorderWidth] = useState(rectangle.borderwidth);
  const [borderRadius, setBorderRadius] = useState(rectangle.borderradius);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Menu
      id='basic-menu'
      anchorEl={anchorEl}
      open={openBorderMenu}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem>
        <Tooltip title='border color'>
          <MuiColorInput
            value={color}
            onChange={(val) => {
              setColor(val);
              handleSubmit('stroke', val);
            }}
          />
        </Tooltip>
      </MenuItem>
      <MenuItem>
        <Tooltip title='border width'>
          <Slider
            value={borderWidth}
            valueLabelDisplay='auto'
            onChange={(e) => setBorderWidth(e.target.value)}
            onChangeCommitted={() => handleSubmit('borderWidth', borderWidth)}
          />
        </Tooltip>
      </MenuItem>
      <MenuItem>
        <Tooltip title='border radius'>
          <Slider
            value={borderRadius}
            valueLabelDisplay='auto'
            onChange={(e) => setBorderRadius(e.target.value)}
            onChangeCommitted={() => handleSubmit('borderRadius', borderRadius)}
          />
        </Tooltip>
      </MenuItem>
    </Menu>
  );
}
