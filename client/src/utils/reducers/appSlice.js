import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  page: 'HOME',
  selectedIdx: null,
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
    resetApp: () => initialState,
    setSelectedIdx: (state, action) => {
      state.selectedIdx = action.payload;
    },
  },
});

export const { setMessage, resetMessage, goToPage, resetApp, setSelectedIdx } =
  appSlice.actions;

export default appSlice.reducer;
