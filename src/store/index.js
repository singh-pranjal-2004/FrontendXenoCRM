import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import campaignReducer from './slices/campaignSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    campaigns: campaignReducer,
  },
});

export default store; 