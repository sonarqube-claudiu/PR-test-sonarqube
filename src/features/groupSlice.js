import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';

const initialState = {
  groups: {},
  groupsPerPage: 5,
  previousGroups: []
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroupsPerPage: {
      reducer: (state, action) => {
        state.groupsPerPage = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setPreviousGroups: {
      reducer: (state, action) => {
        state.previousGroups.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateGroupLocally: {
      reducer: (state, action) => {
        const groupId = action.payload.id;
        state.groups[groupId] = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    deleteGroupLocally: {
      reducer: (state, action) => {
        const groupId = action.payload;
        delete state.groups[groupId];
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    createGroupCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.createGroup;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.CREATED
        ) {
          toast.success(translate('groups.page.toast.groupCreated'));
          //toast.success('Group created successfully.');
        } else {
          toast.error(translate('groups.page.toast.groupNotCreated'));
          //toast.error('Failed to create group.');
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    createGroupRollback: {
      reducer: (state, action) => {
        toast.error(translate('groups.page.toast.groupNotCreated'));
        //toast.error('Failed to create group.');
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getGroupCommit: {
      reducer: (state, action) => {
        const { status, message, groups } = action.payload.data.getGroups;
        if (+status === +HttpStatusCodes.OK) {
          for (let gr of groups) {
            const groupId = gr.id;
            const group = gr;
            state.groups[groupId] = {
              ...state.groups[groupId],
              ...group
            };
          }
        } else {
          toast.error(translate('groups.page.toast.groupsNotRetrieved'));
          //toast.error('Failed to get groups.');
        }
      }
    },
    getGroupRollback: {
      reducer: (state, action) => {
        toast.error(translate('groups.page.toast.groupsNotRetrieved'));
        //toast.error('Failed to get groups.');
      }
    },
    updateGroupCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateGroup;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousGroups = [];
          toast.success(message);
          return;
        } else {
          if (state.previousGroups.length > 0) {
            state.groups = state.previousGroups.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    updateGroupRollback: {
      reducer: (state, action) => {
        if (state.previousGroups.length > 0) {
          state.groups = state.previousGroups.pop();
        }
        toast.error(translate('groups.page.toast.groupNotUpdated'));
        //toast.error('Failed to update group.');
      }
    },
    deleteGroupCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.deleteGroup;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousGroups = [];
          toast.success(message);
          return;
        } else {
          if (state.previousGroups.length > 0) {
            state.groups = state.previousGroups.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    deleteGroupRollback: {
      reducer: (state, action) => {
        if (state.previousGroups.length > 0) {
          state.groups = state.previousGroups.pop();
        }
        toast.error(translate('groups.page.toast.groupNotDeleted'));
        //toast.error('Failed to delete group.');
      }
    }
  }
});

export const {
  setGroupsPerPage,
  setPreviousGroups,
  updateGroupLocally,
  deleteGroupLocally
} = groupSlice.actions;

export default groupSlice.reducer;
