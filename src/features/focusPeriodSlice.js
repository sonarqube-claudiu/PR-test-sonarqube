import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';

const initialState = {
  focusPeriod: {
    title: '',
    start_date: null,
    end_date: null,
    description: '',
  },
  focusPeriods: [],
  previousFocusPeriod: [],
  focusPeriodsPerPage: 10,
};

const focusPeriodSlice = createSlice({
  name: 'focusperiod',
  initialState,
  reducers: {
    setFocusPeriod : {
      reducer: (state, action) => {
        state.focusPeriod = action.payload;
      }
    },
    setFocusPeriodsPerPage: {
      reducer: (state, action) => {
        state.focusPeriodsPerPage = action.payload;
      }
    },
    setFocusPeriodAction: {
      reducer: (state, action) => {
        state.focusPeriodAction = action.payload;
      }
    },
    setFocusPeriodEdit: {
      reducer: (state, action) => {
        state.focusPeriodEdit = action.payload;
      }
    },
    updateFocusPeriodLocally: {
      reducer: (state, action) => {
        // const { start_date, end_date } = action.payload;
        // state.startDate = start_date;
        // state.endDate = end_date;
        state.focusPeriod = action.payload;
      }
    },
    deleteFocusPeriodLocally: {
      reducer: (state, action) => {
        const focusPeriodId = action.payload;
        state.focusPeriods = state.focusPeriods.filter(focusPeriod => focusPeriod.id !== focusPeriodId);
      }
    },
    setPreviousFocusPeriod: {
      reducer: (state, action) => {
        state.previousFocusPeriod.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getAllFocusPeriodsCommit: {
      reducer: (state, action) => {
        const focusPeriods = action.payload.data?.getAllFocusPeriods;
        if (!focusPeriods) {
          toast.error(translate("focusPeriod.page.toast.focusPeriodsNotFound"))
          //toast.error('Focus periods not found');
          return;
        }
        state.focusPeriods = focusPeriods;
      }
    },
    getAllFocusPeriodsRollback: {
      reducer: (state, action) => {
        console.log(action);
      }
    },
    getFocusPeriodCommit: {
      reducer: (state, action) => {
        const focusPeriod = action.payload.data?.getFocusPeriod;
        if (!focusPeriod) {
          toast.error(translate("focusPeriod.page.toast.focusPeriodsNotFound"))
          //toast.error('Focus period not found');
          return;
        }
        state.focusPeriod = { ...focusPeriod };
      }
    },
    getFocuPeriodRollback: {
      reducer: (state, action) => {
        console.log(action);
      }
    },
    createFocusPeriodCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.createFocusPeriod;
        if (
          +status === +HttpStatusCodes.OK ||
          +status === +HttpStatusCodes.CREATED
        ) {
          toast.success(translate("focusPeriod.page.toast.createdSuccessfully"))
          //toast.success('Focus period created successfully.');
        } else {
          toast.error(translate("focusPeriod.page.toast.failedToCreate"))
          //toast.error('Failed to create focus period.');
        }
      }
    },
    createFocusPeriodRollback: {
      reducer: (state, action) => {
        toast.error(translate("focusPeriod.page.toast.failedToCreate"))
        //toast.error('Failed to create focus period.');
      }
    },
    updateFocusPeriodCommit: {
      reducer: (state, action) => {
        const {status, message} = action.payload.data.updateFocusPeriod;
        if (status === HttpStatusCodes.OK || status === HttpStatusCodes.NO_CONTENT) {
          state.previousFocusPeriod = [];
          toast.success(message);
          return;
        } else {
          if (state.previousFocusPeriod.length > 0) {
            state.focusPeriod = state.previousFocusPeriod.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    updateFocusPeriodRollback: {
      reducer: (state, action) => {
        if (state.previousFocusPeriod.length > 0) {
          state.focusPeriod = state.previousFocusPeriod.pop();
        }
        toast.error(translate("focusPeriod.page.toast.failedToUpdate"))
       //toast.error('Failed to update focus period.');
      }
    },
    deleteFocusPeriodCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.deleteFocusPeriod;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousFocusPeriod = [];
          toast.success(message);
          return;
        } else {
          if (state.previousFocusPeriod.length > 0) {
            // state.focusPeriod = state.previousFocusPeriod.pop();
            state.focusPeriods = state.previousFocusPeriod.pop();
          }
          toast.error(message);
          return;
        }
      }
    },
    deleteFocusPeriodRollback: {
      reducer: (state, action) => {
        if (state.previousFocusPeriod.length > 0) {
          state.focusPeriods = state.previousFocusPeriod.pop();
        }
        toast.error(translate('focusPeriod.page.toast.notDeleted'));
        //toast.error('Failed to delete focus period.');
      }
    }
  }
});

export const { setFocusPeriod, setFocusPeriodAction, setFocusPeriodsPerPage, setFocusPeriodEdit, updateFocusPeriodLocally, setPreviousFocusPeriod, deleteFocusPeriodLocally } = focusPeriodSlice.actions;

export default focusPeriodSlice.reducer;
