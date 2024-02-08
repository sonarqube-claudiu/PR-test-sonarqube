import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';

const initialState = {
  activeIssue: null,
  issueToBeUpdated: null,
  movedIssue: null,
  loading: false,
  update: false
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setIssueToBeUpdated: {
      reducer: (state, action) => {
        state.issueToBeUpdated = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setMovedIssue: {
      reducer: (state, action) => {
        state.movedIssue = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateActiveIssue: {
      reducer: (state, action) => {
        if (state.activeIssue === null) return;
        const index = state.issues.findIndex(
          issue => issue.id === state.activeIssue.id
        );
        state.issues && (state.issues[index].status_id = +action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setActiveIssue: {
      reducer: (state, action) => {
        state.activeIssue = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateIssueStatusCommit: {
      reducer: (state, action) => {
        const { status, message, issue } =
          action.payload.data.updateIssueStatus;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousIssuesStack = [];
          toast.info(translate('popup.issue.status.success'));
        } else {
          if (state.previousIssuesStack.length > 0) {
            state.issues = state.previousIssuesStack.pop();
          }
          if (issue) {
            toast.error(
              `${translate('popup.issue.status.fail.inProgress')} #${
                issue.id
              } ${issue.subject}`
            );
          } else {
            toast.error(translate('popup.issue.status.fail'));
          }
        }
        // console.log(action);
      }
    },

    updateIssueStatusRollback: {
      reducer: (state, action) => {
        if (state.previousIssuesStack.length > 0) {
          state.issues = state.previousIssuesStack.pop();
        }
        toast.error(translate('popup.issue.status.fail'));
        // console.log(action);
      }
    },

    getActiveIssueCommit: {
      reducer: (state, action) => {
        const { status, message, issue } =
          action.payload.data.getActiveIssue;
        if (status === HttpStatusCodes.OK || status === HttpStatusCodes.NO_CONTENT && issue) {
          state.activeIssue = issue;
        } else {
          toast.error(message);
        }
      }
    },
    
    getActiveIssueRollback: {
      reducer: (state, action) => {
        toast.error('Failed to get active issue.');
      }
    }
  }
});

export const {
  setActiveIssue,
  updateActiveIssue,
  setIssueToBeUpdated,
  setMovedIssue
} = issuesSlice.actions;

export default issuesSlice.reducer;
