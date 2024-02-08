import { createAction } from "@reduxjs/toolkit";
import { GET_ISSUE_JOURNALS, GET_PROJECT_JOURNALS } from "api/queries";

export const getProjectJournals = createAction(
    'projectJournals/getJournals',
    (projectId, token) => {
      const effect = {
        url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: GET_PROJECT_JOURNALS,
          variables: { projectId }
        })
      };
      const commit = {
        type: 'projectJournals/getJournalsCommit',
        meta: { logLevel: 'DEBUG', data: { projectId } }
      };
      const rollback = {
        type: 'projectJournals/getJournalsRollback',
        meta: { logLevel: 'DEBUG', error: 'Failed to update issue position' }
      };
  
      return {
        payload: { projectId },
        meta: {
          logLevel: 'DEBUG',
          offline: { effect, commit, rollback }
        }
      };
    }
  );