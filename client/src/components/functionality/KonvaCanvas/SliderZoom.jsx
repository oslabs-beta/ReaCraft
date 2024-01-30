import React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { setZoom } from '../../../utils/reducers/appSlice';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateRight,
  faCirclePlus,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';

export default function SliderZoom() {
  const zoom = useSelector((state) => state.app.zoom);
  const dispatch = useDispatch();
  const zoomIn = () => dispatch(setZoom(zoom + 10));
  const zoomOut = () => dispatch(setZoom(Math.max(zoom - 10, 10)));

  return (
    <Stack direction='row' alignItems='center'>
      <Tooltip title='zoom out'>
        <IconButton onClick={zoomOut}>
          <FontAwesomeIcon icon={faCircleMinus} />
        </IconButton>
      </Tooltip>

      <Typography>{zoom}%</Typography>

      <Tooltip title='zoom in'>
        <IconButton onClick={zoomIn}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </IconButton>
      </Tooltip>

      <Tooltip title='reset to fit window'>
        <IconButton onClick={() => dispatch(setZoom(100))} size='small'>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
