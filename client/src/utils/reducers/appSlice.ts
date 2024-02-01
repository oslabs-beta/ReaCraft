import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDesignDetails, setCanEdit } from './designSliceV3';

export type Message = {
  severity: 'success' | 'error' | 'info';
  text: string;
};

export type AppState = {
  message: Message | null;
  page: 'HOME' | 'DESIGN';
  selectedIdx: number | null;
  selectedPageIdx: number | null;
  windowHeight: number;
  windowWidth: number;
  zoom: number;
  isDraggable: boolean;
  cursorMode: 'default' | 'pan';
};

const initialState: AppState = {
  message: null,
  page: 'HOME',
  selectedPageIdx: null,
  selectedIdx: null,
  windowHeight: 1024,
  windowWidth: 1366,
  zoom: 100,
  isDraggable: false,
  cursorMode: 'default',
};

const appSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setMessage: (state: AppState, action: PayloadAction<Message | null>) => {
      state.message = action.payload;
    },
    setZoom: (state: AppState, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    resetMessage: (state: AppState) => {
      state.message = null;
    },
    setWindowSize: (
      state: AppState,
      action: PayloadAction<{ height: number; width: number }>
    ) => {
      state.windowHeight = action.payload.height;
      state.windowWidth = action.payload.width;
    },
    goToPage: (state: AppState, action: PayloadAction<'HOME' | 'DESIGN'>) => {
      state.page = action.payload;
    },
    resetApp: () => initialState,
    setSelectedIdx: (state: AppState, action: PayloadAction<number | null>) => {
      state.selectedIdx = action.payload;
    },
    setSelectedPageIdx: (
      state: AppState,
      action: PayloadAction<number | null>
    ) => {
      state.selectedPageIdx = action.payload;
    },
    toggleIsDraggable: (state, action: PayloadAction<boolean>) => {
      state.isDraggable = action.payload;
    },
    setCursorMode: (state, action: PayloadAction<'default' | 'pan'>) => {
      state.cursorMode = action.payload;
    },
  },
});

export const {
  setMessage,
  resetMessage,
  goToPage,
  resetApp,
  setSelectedIdx,
  setWindowSize,
  setZoom,
  setSelectedPageIdx,
  toggleIsDraggable,
  setCursorMode,
} = appSlice.actions;

export default appSlice.reducer;
