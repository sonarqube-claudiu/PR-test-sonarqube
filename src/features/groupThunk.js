import { createAction } from '@reduxjs/toolkit';
import { CREATE_GROUP, DELETE_GROUP, UPDATE_GROUP } from 'api/mutations';
import { GET_GROUPS } from 'api/queries';

export const createGroup = createAction(
  'groups/createGroup',
  (group, selectedUsers, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: CREATE_GROUP,
        variables: {
          group: JSON.stringify(group),
          selectedUsers: JSON.stringify(selectedUsers)
        }
      })
    };
    const commit = {
      type: 'groups/createGroupCommit',
      meta: { logLevel: 'DEBUG' }
    };
    const rollback = {
      type: 'groups/createGroupRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to create group.' }
    };

    return {
      payload: group,
      selectedUsers,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const getGroups = createAction('groups/getGroups', (userId, token) => {
  const effect = {
    url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: GET_GROUPS,
      variables: { userId }
    })
  };
  const commit = {
    type: 'groups/getGroupCommit',
    meta: { logLevel: 'DEBUG' }
  };
  const rollback = {
    type: 'groups/getGroupRollback',
    meta: { logLevel: 'DEBUG', error: 'Failed to get groups.' }
  };

  return {
    payload: userId,
    meta: {
      logLevel: 'DEBUG',
      offline: { effect, commit, rollback }
    }
  };
});

export const updateGroup = createAction(
  'groups/updateGroup',
  (group, userId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_GROUP,
        variables: {
          group: JSON.stringify(group),
          userId: userId
        }
      })
    };
    const commit = {
      type: 'groups/updateGroupCommit',
      meta: { logLevel: 'DEBUG' }
    };
    const rollback = {
      type: 'groups/updateGroupRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to update group.' }
    };

    return {
      payload: group, userId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const deleteGroup = createAction(
  'groups/deleteGroup',
  (groupId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: DELETE_GROUP,
        variables: {
          groupId: JSON.stringify(groupId),
        }
      })
    };
    const commit = {
      type: 'groups/deleteGroupCommit',
      meta: { logLevel: 'DEBUG' }
    };
    const rollback = {
      type: 'groups/deleteGroupRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to delete group.' }
    };

    return {
      payload: groupId,
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);
