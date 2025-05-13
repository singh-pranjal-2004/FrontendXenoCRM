import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [], // Start empty, will be filled from backend
  selectedCustomer: null,
  loading: false,
  error: null
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    }
  }
});

export const { setSelectedCustomer, clearSelectedCustomer, setCustomers } = customerSlice.actions;
export default customerSlice.reducer; 