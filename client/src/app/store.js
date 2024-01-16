import { configureStore } from '@reduxjs/toolkit';
import designReducerV2 from '../utils/reducers/designSliceV2';
import appReducer from '../utils/reducers/appSlice';

export const store = configureStore({
  reducer: {
    designV2: designReducerV2,
    app: appReducer,
  },
});
