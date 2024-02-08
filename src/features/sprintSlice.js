import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { ITEMS_PER_PAGE_ARRAY } from 'models/Constants';
import { toast } from 'react-toastify';

const initialState = {
  previousSprints: [],
  sprints: {},
  sprintsPerPage: ITEMS_PER_PAGE_ARRAY[0]
};

const sprintSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    updateSprintLocally: {
      reducer: (state, action) => {
        const sprint = action.payload;
        const id = sprint.id;
        if (!state.sprints[id]) return;
        state.sprints[id] = sprint;
      }
    },
    setPreviousSprints: {
      reducer: (state, action) => {
        state.previousFocusPeriod.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setSprintsPerPage: {
      reducer: (state, action) => {
        state.sprintsPerPage = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getSprintsCommit: {
      reducer: (state, action) => {
        const { status, message, sprints } = action.payload.data.getSprints;
        if (!sprints) {
          toast.error('Sprint not found');
          return;
        }
        for (let sprint of sprints) {
          state.sprints[sprint.id] = sprint;
        }
      }
    },
    getSprintsRollback: {
      reducer: (state, action) => {
        toast.error('Failed to get sprints.');
      }
    },
    createSprintCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.createSprint;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.CREATED
        ) {
          state.previousSprints = [];
          toast.success(message);
          return;
        } else {
          if (state.previousSprints.length > 0) {
            state.sprints = state.previousSprints.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    createSprintRollback: {
      reducer: (state, action) => {
        if (state.previousSprints.length > 0) {
          state.sprints = state.previousSprints.pop();
        }
        toast.error('Failed to create sprint.');
      }
    },

    updateSprintCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateSprint;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousSprints = [];
          toast.success(message);
          return;
        } else {
          if (state.previousSprints.length > 0) {
            state.sprints = state.previousSprints.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    updateSprintRollback: {
      reducer: (state, action) => {
        if (state.previousSprints.length > 0) {
          state.sprints = state.previousSprints.pop();
        }
        toast.error('Failed to update sprint.');
      }
    },

    deleteSprintCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.deleteSprint;
        if (status === HttpStatusCodes.OK) {
          state.previousSprints = [];
          toast.success(message);
          return;
        } else {
          if (state.previousSprints.length > 0) {
            state.sprints = state.previousSprints.pop();
          }
          toast.error(message);
          return;
        }
      }
    },

    deleteSprintRollback: {
      reducer: (state, action) => {
        if (state.previousSprints.length > 0) {
          state.sprints = state.previousSprints.pop();
        }
        toast.error('Failed to delete focus period.');
      }
    },

    deleteSprintLocally: {
      reducer: (state, action) => {
        const sprintId = action.payload;
        delete state.sprints[sprintId];
      }
    }
  }
});

export const {
  updateSprintLocally,
  deleteSprintLocally,
  setPreviousSprints,
  setSprintsPerPage
} = sprintSlice.actions;

export default sprintSlice.reducer;
