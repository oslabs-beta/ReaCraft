import { configureStore } from '@reduxjs/toolkit';
import designReducer from '../utils/reducers/designSlice';
import appReducer from '../utils/reducers/appSlice';

export const store = configureStore({
  reducer: {
    design: designReducer,
    app: appReducer,
  },
});
