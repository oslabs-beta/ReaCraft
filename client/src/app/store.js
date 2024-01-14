import { configureStore } from '@reduxjs/toolkit';
import designReducer from '../utils/reducers/designSlice';
import designReducerV2 from '../utils/reducers/designSliceV2';
import appReducer from '../utils/reducers/appSlice';

export const store = configureStore({
  reducer: {
    design: designReducer,
    designV2: designReducerV2,
    app: appReducer,
  },
});
