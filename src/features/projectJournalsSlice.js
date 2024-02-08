import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { toast } from 'react-toastify';

const initialState = {
  journals: {},
  loading: false
};

const journalsSlice = createSlice({
  name: 'projectJournals',
  initialState,
  reducers: {
    setLoadingJournals: {
      reducer: (state, action) => {
        state.loading = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getJournalsCommit: {
      reducer: (state, action) => {
        const { status, message, journals } = action.payload.data.getProjectJournals;
        if (status === HttpStatusCodes.OK) {
          if (!journals || journals.length === 0) return;
          const projectId = journals[0].journalized_id;
          state.journals[projectId] = journals;
        }
        state.loading = false;
      }
    },
    getJournalsRollback: {
      reducer: (state, action) => {
        state.loading = false;
      }
    }
  }
});

export const { setLoadingJournals } = journalsSlice.actions;

export default journalsSlice.reducer;
