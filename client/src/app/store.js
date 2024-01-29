import { configureStore } from '@reduxjs/toolkit';
import designReducerV3 from '../utils/reducers/designSliceV3';
import appReducer from '../utils/reducers/appSlice';

export const store = configureStore({
  reducer: {
    designV3: designReducerV3,
    app: appReducer,
  },
});
