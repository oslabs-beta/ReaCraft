import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  page: 'HOME',
};

const appSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    resetMessage: (state) => {
      state.message = null;
    },
    goToPage: (state, action) => {
      state.page = action.payload;
    },
    resetApp: (state) => initialState,
  },
});

export const { setMessage, resetMessage, goToPage, resetApp } =
  appSlice.actions;

export default appSlice.reducer;
