import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

export default function SelectorHtmlTag({ idx }) {
  const pages = useSelector((state) => state.designV3.pages);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const components = pages[selectedPageIdx].components;
  const component = components[idx];

  const [htmlValue, setHtmlValue] = useState(component.html_tag);

  return (
    <TextField
      select
      sx={{ marginTop: '15px' }}
      size='small'
      fullWidth={true}
      key={idx}
      label='html tag'
      name='htmlTag'
      value={htmlValue}
      onChange={(e) => {
        setHtmlValue(e.target.value);
      }}
    >
      {['<div>', '<p>', '<button>'].map((tag, i) => (
        <MenuItem key={tag.slice(1, tag.length - 1)} value={tag}>
          {tag}
        </MenuItem>
      ))}
    </TextField>
  );
}
