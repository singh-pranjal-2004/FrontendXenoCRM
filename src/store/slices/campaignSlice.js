import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  campaigns: [], // Start with empty, will be filled from backend
  selectedCampaign: null,
  loading: false,
  error: null
};

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    }
  }
});

export const { setSelectedCampaign, clearSelectedCampaign, setCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer; 