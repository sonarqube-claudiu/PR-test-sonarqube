import { createAction } from '@reduxjs/toolkit';
import { GET_FOCUS_PERIOD, GET_SPRINTS } from '../api/queries';
import { CREATE_SPRINT, DELETE_SPRINT, UPDATE_FOCUS_PERIOD, UPDATE_SPRINT } from 'api/mutations';

export const getSprints = createAction(
  'sprints/getSprints',
  (projectId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_SPRINTS,
        variables: { projectId }
      })
    };
    const commit = {
      type: 'sprints/getSprintsCommit',
      meta: { logLevel: 'DEBUG' }
    };
    const rollback = {
      type: 'sprints/getSprintsRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch focus period.' }
    };

    return {
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateSprint = createAction(
  'sprints/updateSprint',
  (sprint, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_SPRINT,
        variables: { sprint: JSON.stringify(sprint) }
      })
    };
    const commit = {
      type: 'sprints/updateSprintCommit',
      meta: { logLevel: 'DEBUG', data: { sprint } }
    };
    const rollback = {
      type: 'sprints/updateSprintRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to update focus period.' }
    };

    return {
      payload: { sprint },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const createSprint = createAction(
    'sprints/createSprint',
    (sprint, token) => {
      const effect = {
        url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: CREATE_SPRINT,
          variables: { sprint: JSON.stringify(sprint) }
        })
      };
      const commit = {
        type: 'sprints/createSprintCommit',
        meta: { logLevel: 'DEBUG', data: { sprint } }
      };
      const rollback = {
        type: 'sprints/createSprintRollback',
        meta: { logLevel: 'DEBUG', error: 'Failed to update focus period.' }
      };
  
      return {
        payload: { sprint },
        meta: {
          logLevel: 'DEBUG',
          offline: { effect, commit, rollback }
        }
      };
    }
  );
  export const deleteSprint = createAction(
    'sprints/deleteSprint',
    (sprintId, token) => {
      const effect = {
        url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: DELETE_SPRINT,
          variables: { sprintId }
        })
      };
      const commit = {
        type: 'sprints/deleteSprintCommit',
        meta: { logLevel: 'DEBUG', data: { sprintId } }
      };
      const rollback = {
        type: 'sprints/deleteSprintRollback',
        meta: { logLevel: 'DEBUG', error: 'Failed to update focus period.' }
      };
  
      return {
        payload: { sprintId },
        meta: {
          logLevel: 'DEBUG',
          offline: { effect, commit, rollback }
        }
      };
    }
  );

