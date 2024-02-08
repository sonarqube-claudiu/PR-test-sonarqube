import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState ={
    isOnline: navigator.onLine 
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: {
        reducer: (state, action) => {
            state.isOnline = action.payload;
        },
        prepare: (payload) => ({ payload, meta: { logLevel: "DEBUG" } }),
    }
  }
});

export const { setNetworkStatus } = networkSlice.actions;

export default networkSlice.reducer;
