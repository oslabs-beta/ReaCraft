import React from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { setMessage } from '../../utils/reducers/appSlice';
import { updateComponentHtmlTag } from '../../utils/reducers/designSliceV2';

export default function HtmlTagSelector({ idx }) {
  const component = useSelector((state) => state.designV2.components)[idx];
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ marginTop: '15px' }}
      size='small'
      fullWidth='true'
      key={idx}
      label='html tag'
      name='htmlTag'
      value={component.html_tag}
      onChange={(e) => {
        dispatch(
          setMessage({
            severity: 'success',
            text: `Successfully set the html tag for ${component.name} (${idx}) to be ${e.target.value}`,
          })
        );
        dispatch(
          updateComponentHtmlTag({
            componentId: component._id,
            body: { htmlTag: e.target.value },
          })
        );
      }}>
      {['<div>', '<p>', '<button>'].map((tag, i) => (
        <MenuItem key={tag.slice(1, tag.length - 1)} value={tag}>
          {tag}
        </MenuItem>
      ))}
    </TextField>
  );
}
