import { createAction } from '@reduxjs/toolkit';
import { GET_PROJECT, GET_PROJECTS } from '../api/queries';
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_ISSUE_POSITION,
  UPDATE_PROJECT,
  UPDATE_STORY_POSITION
} from 'api/mutations';

export const getProjects = createAction(
  'projects/getProjects',
  (startDate, endDate, userId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_PROJECTS,
        variables: { userId, startDate, endDate }
      })
    };
    const commit = {
      type: 'projects/getProjectsCommit',
      meta: { logLevel: 'DEBUG', userId }
    };
    const rollback = {
      type: 'projects/getProjectsRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: userId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const getProject = createAction(
  'projects/getProject',
  (startDate, endDate, userId, projectId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_PROJECT,
        variables: { startDate, endDate, userId, projectId }
      })
    };
    const commit = {
      type: 'projects/getProjectCommit',
      meta: { logLevel: 'DEBUG', userId }
    };
    const rollback = {
      type: 'projects/getProjectRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch project.' }
    };

    return {
      payload: userId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const createProject = createAction(
  'projects/createProject',
  (project, members, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_PROJECT,
        variables: {
          project: JSON.stringify(project),
          members: JSON.stringify(members)
        }
      })
    };
    const commit = {
      type: 'projects/createProjectCommit',
      meta: { logLevel: 'DEBUG', project }
    };
    const rollback = {
      type: 'projects/createProjectRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: project,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateProject = createAction(
  'projects/updateProject',
  (project, members, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_PROJECT,
        variables: {
          project: JSON.stringify(project),
          members: JSON.stringify(members)
        }
      })
    };
    const commit = {
      type: 'projects/updateProjectCommit',
      meta: { logLevel: 'DEBUG', project }
    };
    const rollback = {
      type: 'projects/updateProjectRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: project,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const deleteProject = createAction(
  'projects/deleteProject',
  (projectId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: DELETE_PROJECT,
        variables: { projectId }
      })
    };
    const commit = {
      type: 'projects/deleteProjectCommit',
      meta: { logLevel: 'DEBUG', projectId }
    };
    const rollback = {
      type: 'projects/deleteProjectRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: projectId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);
