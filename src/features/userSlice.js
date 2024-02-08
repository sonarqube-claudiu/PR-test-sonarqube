import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  displayName: '',
  token: null,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: {
      reducer: (state, action) => {
        state.id = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setUserToken: {
      reducer: (state, action) => {
        state.token = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setUserData: {
      reducer: (state, action) => {
        if (action.payload) {
          const { display_name, username, id, token } = action.payload;
          if (display_name && id) {
            state.displayName = display_name;
            state.id = id;
            if (token) {
              state.token = token;
            }
          }
        } else {
          state.displayName = '';
          state.token = null;
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    }
  }
});

export const { setUserId, setUserData, setUserToken } = usersSlice.actions;

export default usersSlice.reducer;
