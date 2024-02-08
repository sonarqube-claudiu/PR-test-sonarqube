import { createAction } from '@reduxjs/toolkit';
import { GET_STORIES } from '../api/queries';
import { UPDATE_ISSUE_POSITION, UPDATE_STORY_POSITION } from 'api/mutations';

export const getStories = createAction(
  'stories/getStories',
  (startDate, endDate, projectId, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_STORIES,
        variables: { startDate, endDate, projectId }
      })
    };
    const commit = {
      type: 'stories/getStoriesCommit',
      meta: { logLevel: 'DEBUG' }
    };
    const rollback = {
      type: 'stories/getStoriesRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch stories.' }
    };

    return {
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);

export const updateStoryPosition = createAction(
  'projects/updateStoryPosition',
  (storyId, position, token) => {
    const effect = {
      url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: UPDATE_STORY_POSITION,
        variables: { storyId, position }
      })
    };
    const commit = {
      type: 'projects/updateStoryPositionCommit',
      meta: { logLevel: 'DEBUG', data: { storyId, position } }
    };
    const rollback = {
      type: 'projects/updateStoryPositionRollback',
      meta: { logLevel: 'DEBUG', error: 'Failed to fetch projects.' }
    };

    return {
      payload: { storyId, position },
      meta: {
        logLevel: 'DEBUG',
        offline: { effect, commit, rollback }
      }
    };
  }
);