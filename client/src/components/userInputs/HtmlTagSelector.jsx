import React, { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { selectHtmlTag } from '../../utils/reducers/designSlice';
import { setMessage } from '../../utils/reducers/appSlice';

export default function HtmlTagSelector({ idx }) {
  const component = useSelector((state) => state.design.components)[idx];
  console.log(component.html_tag);
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
        console.log('changing html tag');
        dispatch(
          setMessage({
            severity: 'success',
            text: `Successfully set the html tag for ${component.name} (${idx}) to be ${e.target.value}`,
          })
        );
        dispatch(selectHtmlTag({ idx, html_tag: e.target.value }));
      }}>
      {['<div>', '<p>', '<button>'].map((tag, i) => (
        <MenuItem key={tag.slice(1, tag.length - 1)} value={tag}>
          {tag}
        </MenuItem>
      ))}
    </TextField>
  );
}
