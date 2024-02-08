import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    locale: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: {
      reducer: (state, action) => {
       if(action.payload) {
        state.locale = action.payload;
       }
      },
      prepare: (payload) => ({ payload, meta: { logLevel: 'DEBUG' } }),
    }
  },
});

export const {setLanguage} = languageSlice.actions;

export default languageSlice.reducer;
