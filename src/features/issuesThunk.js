import { createAction } from '@reduxjs/toolkit';
import { GET_ACTIVE_ISSUE, GET_ISSUES, GET_PROJECTS } from '../api/queries';
import {
  CREATE_ISSUE,
  UPDATE_ISSUE_POSITION,
  UPDATE_ISSUE_STATUS,
  UPDATE_ISSUE,
  DELETE_ISSUE
} from '../api/mutations';

export const getAllIssues = createAction(
  'issues/getAllIssues',
  (startDate, endDate, storyId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_ISSUES,
        variables: { startDate, endDate, storyId }
      })
    };
    const commit = {
      type: 'issues/getAllIssuesCommit',
      meta: { logLevel: 'DEBUG', storyId }
    };
    const rollback = {
      type: 'issues/getAllIssuesRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: storyId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const createIssue = createAction(
  'projects/createIssue',
  (issue, assignments, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_ISSUE,
        variables: {
          issue: JSON.stringify(issue),
          assignments: JSON.stringify(assignments)
        }
      })
    };
    const commit = {
      type: 'projects/createIssueCommit',
      meta: { logLevel: 'DEBUG', data: { issue } }
    };
    const rollback = {
      type: 'projects/createIssueRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to create issue.' }
    };

    return {
      payload: { issue },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateIssue = createAction(
  'projects/updateIssue',
  (issue, assignments, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_ISSUE,
        variables: {
          issue: JSON.stringify(issue),
          assignments: JSON.stringify(assignments)
        }
      })
    };
    const commit = {
      type: 'projects/updateIssueCommit',
      meta: { logLevel: 'DEBUG', data: { issue } }
    };
    const rollback = {
      type: 'projects/updateIssueRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: { issue },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const deleteIssue = createAction(
  'projects/deleteIssue',
  (issueId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: DELETE_ISSUE,
        variables: { issueId }
      })
    };
    const commit = {
      type: 'projects/deleteIssueCommit',
      meta: { logLevel: 'DEBUG', data: { issueId } }
    };
    const rollback = {
      type: 'projects/deleteIssueRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: { issueId },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateIssueStatus = createAction(
  'issues/updateIssueStatus',
  (issueId, statusId, userId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_ISSUE_STATUS,
        variables: { issueId, statusId, userId }
      })
    };
    const commit = {
      type: 'issues/updateIssueStatusCommit',
      meta: { logLevel: 'DEBUG', data: { issueId, statusId } }
    };
    const rollback = {
      type: 'issues/updateIssueStatusRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: { issueId, statusId },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateIssuePosition = createAction(
  'projects/updateIssuePosition',
  (issueId, position, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_ISSUE_POSITION,
        variables: { issueId, position }
      })
    };
    const commit = {
      type: 'projects/updateIssuePositionCommit',
      meta: { logLevel: 'DEBUG', data: { issueId, position } }
    };
    const rollback = {
      type: 'projects/updateIssuePositionRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to update issue position' }
    };

    return {
      payload: { issueId, position },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const getActiveIssue = createAction(
  'issues/getActiveIssue',
  (userId, startDate, endDate, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_ACTIVE_ISSUE,
        variables: { userId, startDate, endDate }
      })
    };
    const commit = {
      type: 'issues/getActiveIssueCommit',
      meta: { logLevel: 'DEBUG', data: { userId, startDate, endDate } }
    };
    const rollback = {
      type: 'issues/getActiveIssueRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch active issue' }
    };

    return {
      payload: { userId, startDate, endDate },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);
