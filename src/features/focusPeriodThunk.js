import { createAction } from '@reduxjs/toolkit';
import { GET_ALL_FOCUS_PERIODS, GET_FOCUS_PERIOD } from '../api/queries';
import { CREATE_FOCUS_PERIOD, DELETE_FOCUS_PERIOD, UPDATE_FOCUS_PERIOD } from 'api/mutations';

export const getFocusPeriod = createAction('focusperiod/getFocusPeriod', token => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: GET_FOCUS_PERIOD
    })
  };
  const commit = {
    type: 'focusperiod/getFocusPeriodCommit',
    meta: { logLevel: 'DEBUG' }
  };
  const rollback = {
    type: 'focusperiod/getFocusPeriodRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to fetch focus period.' }
  };

  return {
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const getAllFocusPeriods = createAction('focusperiod/getAllFocusPeriods', token => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: GET_ALL_FOCUS_PERIODS
    })
  };
  const commit = {
    type: 'focusperiod/getAllFocusPeriodsCommit',
    meta: { logLevel: 'DEBUG' }
  };
  const rollback = {
    type: 'focusperiod/getAllFocusPeriodsRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to fetch all focus periods.' }
  };

  return {
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const createFocusPeriod = createAction('focusperiod/createFocusPeriod', (focusPeriod, token) => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: CREATE_FOCUS_PERIOD,
      variables: { focusPeriod: JSON.stringify(focusPeriod) }
    })
  };
  const commit = {
    type: 'focusperiod/createFocusPeriodCommit',
    meta: { logLevel: 'DEBUG', data: { focusPeriod } }
  };
  const rollback = {
    type: 'focusperiod/createFocusPeriodRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to create focus period.' }
  };
  return {
    payload: { focusPeriod },
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const updateFocusPeriod = createAction('focusperiod/updateFocusPeriod', (focusPeriod, token) => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: UPDATE_FOCUS_PERIOD,
      variables: {focusPeriod: JSON.stringify(focusPeriod)}
    })
  };
  const commit = {
    type: 'focusperiod/updateFocusPeriodCommit',
    meta: { logLevel: 'DEBUG', data: {focusPeriod} }
  };
  const rollback = {
    type: 'focusperiod/updateFocusPeriodRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to update focus period.' }
  };

  return {
    payload: { focusPeriod },
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const deleteFocusPeriod = createAction('focusperiod/deleteFocusPeriod', (focusPeriodId, token) => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: DELETE_FOCUS_PERIOD,
      variables: {focusPeriodId: JSON.stringify(focusPeriodId)}
    })
  };
  const commit = {
    type: 'focusperiod/deleteFocusPeriodCommit',
    meta: { logLevel: 'DEBUG', data: {focusPeriodId} }
  };
  const rollback = {
    type: 'focusperiod/deleteFocusPeriodRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to delete focus period.' }
  };

  return {
    payload: {focusPeriodId},
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});
