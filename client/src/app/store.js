import { configureStore } from '@reduxjs/toolkit';
import designReducerV2 from '../utils/reducers/designSliceV2';
import designReducerV3 from '../utils/reducers/designSliceV3';
import appReducer from '../utils/reducers/appSlice';

export const store = configureStore({
  reducer: {
    designV2: designReducerV2,
    designV3: designReducerV3,
    app: appReducer,
  },
});
