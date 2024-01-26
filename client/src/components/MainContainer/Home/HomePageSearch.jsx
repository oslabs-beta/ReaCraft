import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Paper,
  Box,
  TextField,
  IconButton,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../../hooks/useAuth';
import {
  getDesignDetails,
  setSearchTerm,
} from '../../../utils/reducers/designSliceV3';

export default function HomePageSearch() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();
  // state to set the search bar text
  const searchTerm = useSelector((state) => state.designV2.searchTerm);
  const [searchText, setSearchText] = useState('');
  const searchBarTheme =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(to right, #778DA9, #1B263B)'
      : 'linear-gradient(to right, #EDEDE9, #D5BDAF)';

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    dispatch(setSearchTerm(event.target.value));
  };
  // useEffect that checks if searchTerm in state changes
  useEffect(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    // {/* // Paper is a container for displaying content to give an 'elevated surface' look */}
    <Paper
      elevation={2}
      sx={{
        padding: 4,
        margin: 4,
        backgroundImage: searchBarTheme,
        width: 'auto',
      }}
    >
      {/* Typography is used for title text */}
      <Typography variant='h4' component='h1' gutterBottom align='center'>
        What will you design today, {user.username}?
      </Typography>
      {/* Box is a wrapper tool, using it to contain the 'TextField and SearchIcon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          maxWidth: 800,
          justifyContent: 'center',
          margin: 'auto',
        }}
      >
        {/* TextField lets users enter and edit text. using it to represent search bar with an InputProps to include a search button inside the text field*/}
        <TextField
          fullWidth
          variant='outlined'
          // onChange will call event handler when user types in search bar
          onChange={handleSearchChange}
          placeholder='Search your content'
          sx={{
            // apply styles inside the placeholder of the input element within TextField
            '& .MUIInputBase-input::placeholder': {
              color: '#32333B',
              opacity: 1,
            },
            input: {
              color: theme.palette.mode === 'light' ? '#736C6C' : '#F5EBE0',
            },
          }}
          InputProps={{
            // startAdornment is used for adding read-only elements like the SearchIcon that's being used within the Button
            startAdornment: (
              <IconButton variant='contained' sx={{ marginRight: 1 }}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
}
