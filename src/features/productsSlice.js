import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, newProject) => {},
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    }
  }
});

export const { addProject } = productsSlice.actions;

export default productsSlice.reducer;
