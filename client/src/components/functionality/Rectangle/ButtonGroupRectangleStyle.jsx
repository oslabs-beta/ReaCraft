import React, { Fragment, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import { MuiColorInput } from 'mui-color-input';
import { useDispatch } from 'react-redux';
import { updateComponentRectangleStyle } from '../../../utils/reducers/designSliceV2';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LineStyleRoundedIcon from '@mui/icons-material/LineStyleRounded';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import '../../../styles/workspaceToolbar.scss';
import { useTheme, createTheme, ThemeProvider } from '@mui/material';

export default function ButtonGroupRectangleStyle({ rectangle }) {
  const [color, setColor] = useState(rectangle.backgroundcolor || '#00000000');
  const [anchorEl, setAnchorEl] = useState(null);
  const openBorderMenu = Boolean(anchorEl);

  const dispatch = useDispatch();
  function handleSubmit(styleToChange, value) {
    const componentId = rectangle.component_id;
    try {
      dispatch(
        updateComponentRectangleStyle({
          componentId,
          body: { styleToChange, value },
        })
      );
    } catch (error) {
      dispatch(
        setMessage({
          severity: 'error',
          text:
            'Design: update component rectangle ' + styleToChange + ' ' + error,
        })
      );
    }
  }

  const theme = useTheme();

  const themeDark = createTheme({
    palette: theme.palette,
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            '& .MuiButton-root': {
              border: '1px solid rgba(224, 225, 221, 0.5)',
            },
          },
        },
      },
    },
  });

  const themeLight = createTheme({
    palette: theme.palette,
    components: {
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            '& .MuiButton-root': {
              color: '#998e8e',
              borderColor: '#ada6a6ab',
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            '& .MuiButton-root': {
              border: '1px solid #ada6a6ab',
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider
      theme={theme.palette.mode === 'dark' ? themeDark : themeLight}
    >
      <ButtonGroup width='50px' variant='outlined' height='30px'>
        <Fragment>
          <Tooltip title='Change background color'>
            <MuiColorInput
              className='background-picker'
              sx={{ border: 'none' }}
              value={color}
              onChange={(val) => {
                setColor(val);
                handleSubmit('backgroundColor', val);
              }}
            />
          </Tooltip>
        </Fragment>

        <Fragment>
          <Tooltip title='Border Styles'>
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
    </ThemeProvider>
  );
}

function BorderMenu({
  openBorderMenu,
  anchorEl,
  setAnchorEl,
  rectangle,
  handleSubmit,
}) {
  const { stroke, borderwidth, borderradius } = rectangle;
  const [color, setColor] = useState(stroke);
  const [borderWidth, setBorderWidth] = useState(Number(borderwidth));
  const [borderRadius, setBorderRadius] = useState(Number(borderradius));
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
        <Tooltip title='Border Color'>
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
        <Typography width='250px'>Border Width</Typography>
        <Slider
          value={borderWidth}
          valueLabelDisplay='auto'
          onChange={(e) => setBorderWidth(e.target.value)}
          onChangeCommitted={() => handleSubmit('borderWidth', borderWidth)}
        />
      </MenuItem>
      <MenuItem maxWidth='false'>
        <Typography width='250px'>Border Radius</Typography>
        <Slider
          value={borderRadius}
          valueLabelDisplay='auto'
          onChange={(e) => setBorderRadius(e.target.value)}
          onChangeCommitted={() => handleSubmit('borderRadius', borderRadius)}
          min={0}
          max={50}
        />
      </MenuItem>
    </Menu>
  );
}
