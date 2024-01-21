import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Message = {
  severity: 'success' | 'error' | 'info';
  text: string;
};

type AppState = {
  message: Message | null;
  page: 'HOME' | 'NEW_DESIGN';
  selectedIdx: number | null;
};

const initialState: AppState = {
  message: null,
  page: 'HOME',
  selectedIdx: null,
};

const appSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setMessage: (state: AppState, action: PayloadAction<Message | null>) => {
      state.message = action.payload;
    },
    resetMessage: (state: AppState) => {
      state.message = null;
    },
    goToPage: (
      state: AppState,
      action: PayloadAction<'HOME' | 'NEW_DESIGN'>
    ) => {
      state.page = action.payload;
    },
    resetApp: () => initialState,
    setSelectedIdx: (state: AppState, action: PayloadAction<number | null>) => {
      state.selectedIdx = action.payload;
    },
  },
});

export const { setMessage, resetMessage, goToPage, resetApp, setSelectedIdx } =
  appSlice.actions;

export default appSlice.reducer;
