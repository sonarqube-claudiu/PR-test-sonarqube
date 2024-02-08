import { createSlice } from '@reduxjs/toolkit';
import { signUpAsGuest } from './authThunk';
import { HttpStatusCodes } from '../api/utils';

const initialState = {
  isLoggedIn: false,
  data: null,
  loading: false,
  message: '',
  state: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setState: {
      reducer: (state, action) => {
        state.state = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setLoading: {
      reducer: (state, action) => {
        state.loading = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setAuthMessage: {
      reducer: (state, action) => {
        state.message = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    logIn: {
      reducer: state => {
        state.isLoggedIn = true;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    logOut: {
      reducer: state => {
        state.isLoggedIn = false;
        // persistor.purge();
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    setAuthError: {
      reducer: (state, action) => {
        state.error = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    autoLoginCommit: {
      reducer: (state, action) => {
        if (action.payload) {
          state.isLoggedIn = true;
        }
      }
    },
    autoLoginRollback: {
      reducer: (state, action) => {
        const error = action.payload;
        console.error(error);
      }
    },
    signUpCommit: {
      reducer: (state, action) => {
        state.token = action.payload.data.createDevice.uuid;
        state.isLoggedIn = true;
      }
    },

    signUpRollback: {
      reducer: (state, action) => {
        if (action.payload) {
          state.isLoggedIn = false;
        }
      }
    },
    loginUserCommit: {
      reducer: (state, action) => {
        const { status, message, user, token } = action.payload.data.login;
        state.loading = false;
        if (status && status === HttpStatusCodes.OK) {
          state.isLoggedIn = true;
          state.data = { ...user, token };
          state.message = message;
        } else {
          state.message = message;
          state.isLoggedIn = false;
          state.data = null;
        }
      }
    },

    loginUserRollback: {
      reducer: (state, action) => {
        console.log(action);
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUpAsGuest.pending, state => {
        state.loading = true;
      })
      .addCase(signUpAsGuest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isLoggedIn = true;
        }
      })
      .addCase(signUpAsGuest.rejected, state => {
        state.loading = false;
      });
  }
});

export const { logIn, logOut, setAuthError, setAuthMessage, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
