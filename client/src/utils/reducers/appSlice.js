import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  activeStep: 0,
  page: 'HOME',
  userDesigns: [],
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
    nextStep: (state) => {
      state.activeStep += 1;
    },
    prevStep: (state) => {
      state.activeStep -= 1;
    },
    resetStep: (state) => {
      state.activeStep = 0;
    },
    goToPage: (state, action) => {
      state.page = action.payload;
    },
    setUserDesigns: (state, action) => {
      state.userDesigns = action.payload;
    },
    addToUserDesign: (state, action) => {
      state.userDesigns = [...state.userDesigns, action.payload];
    },
    resetApp: (state) => initialState,
  },
});

export const {
  setMessage,
  resetMessage,
  nextStep,
  prevStep,
  resetStep,
  goToPage,
  setUserDesigns,
  addToUserDesign,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer;
