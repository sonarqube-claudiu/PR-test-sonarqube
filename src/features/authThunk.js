import { createAsyncThunk } from '@reduxjs/toolkit';
import { autoLoginUser, signUpUser, signUpUserAsGuest } from '../api/api';
import { setUserData, setUserId } from './userSlice';
import { setAuthError } from './authSlice';
import { createAction } from '@reduxjs/toolkit';
import { GET_DEVICE, LOGIN_QUERY } from '../api/queries';
import { CREATE_DEVICE } from '../api/mutations';

// export const autoLogin = createAsyncThunk(
//   "auth/autoLogin",
//   async (deviceId, { dispatch }) => {
//     try {
//       const response = await autoLoginUser(deviceId);
//       if (response && response.device) {
//         const device = response.device;
//         dispatch(setUserData({firstName: 'Guest',lastName: '', id: device.uuid}));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const autoLogin = createAction('auth/autoLogin', deviceId => {
  const effect = {
    url: 'http://10.1.30.142:5000/graphql', // replace with your actual GraphQL endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_DEVICE,
      variables: { uuid: deviceId }
    })
  };
  const commit = {
    type: 'auth/autoLoginCommit',
    meta: { logLevel: 'DEBUG', deviceId }
  };

  const rollback = {
    type: 'auth/autoLoginRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to sign up.' }
  };

  return {
    payload: deviceId,
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const signUp = createAction('auth/signUp', deviceInfo => {
  const effect = {
    url: 'http://10.1.30.142:5000/graphql',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_DEVICE,
      variables: { deviceInfo: JSON.stringify(deviceInfo) }
    })
  };
  const commit = {
    type: 'auth/signUpCommit',
    meta: { logLevel: 'DEBUG', deviceInfo }
  };
  const rollback = {
    type: 'auth/signUpRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to sign up.' }
  };

  return {
    payload: deviceInfo,
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const loginUser = createAction('auth/loginUser', ({ email, token }) => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: LOGIN_QUERY,
      variables: { email }
    })
  };
  const commit = {
    type: 'auth/loginUserCommit',
    meta: { logLevel: 'DEBUG', email }
  };
  const rollback = {
    type: 'auth/loginUserRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to login.' }
  };

  return {
    payload: email,
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const signUpAsGuest = createAsyncThunk(
  'auth/signUpAsGuest',
  async (deviceInfo, { dispatch }) => {
    try {
      const response = await signUpUserAsGuest(deviceInfo);
      if (response && response.createDevice.uuid) {
        dispatch(setUserId(response.createDevice.uuid));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(setAuthError('Failed to sign up.'));
      throw error;
    }
  }
);
