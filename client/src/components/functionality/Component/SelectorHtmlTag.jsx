import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';

export default function SelectorHtmlTag({ idx }) {
  const pages = useSelector((state) => state.designV3.pages);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const components = pages[selectedPageIdx].components;
  const component = components[idx];
  const [htmlValue, setHtmlValue] = useState(component.html_tag);
  const theme = useTheme();

  return (
    <TextField
      select
      sx={{ 
        marginTop: '15px',
        '& .MuiInputBase-input': {
          color: theme.palette.mode === 'light' ? '#666666' : '#e5e5e5',
        } 
      }}
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
