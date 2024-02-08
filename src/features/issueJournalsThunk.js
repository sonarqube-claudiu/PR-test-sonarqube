import { createAction } from "@reduxjs/toolkit";
import { GET_ISSUE_JOURNALS } from "api/queries";

export const getIssueJournals = createAction(
    'issueJournals/getJournals',
    (issueId, token) => {
      const effect = {
        url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: GET_ISSUE_JOURNALS,
          variables: { issueId }
        })
      };
      const commit = {
        type: 'issueJournals/getJournalsCommit',
        meta: { logLevel: 'DEBUG', data: { issueId } }
      };
      const rollback = {
        type: 'issueJournals/getJournalsRollback',
        meta: { logLevel: 'DEBUG', error: 'Failed to update issue position' }
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