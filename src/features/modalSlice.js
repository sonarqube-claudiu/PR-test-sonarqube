import { createSlice } from '@reduxjs/toolkit';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { toast } from 'react-toastify';

const initialState = {
  openCardStatus: -1,
  kanbanModalShow: false,
  warningModalShow: false,
  warningModalTitle: '',
  warningModalMessage: '',
  warningModalOnConfirm: null,
  warningModalOnCancel: null,
  issueModalAction: ISSUE_ACTION.ISSUE_VIEW,
  fromCreate: false
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setFromCreate: {
      reducer: (state, action) => {
        state.fromCreate = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setIssueSource: {
      reducer: (state, action) => {
        state.issueSource = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setIssueDestination: {
      reducer: (state, action) => {
        state.issueDestination = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setDestinationInProgress: {
      reducer: (state, action) => {
        state.destinationInProgress = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setIssueModalAction: {
      reducer: (state, action) => {
        state.issueModalAction = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setOpenCardStatus: {
      reducer: (state, action) => {
        state.openCardStatus = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setKanbanModalShow: {
      reducer: (state, action) => {
        state.kanbanModalShow = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setWarningModalShow: {
      reducer: (state, action) => {
        state.warningModalShow = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setOpenWarningModalWith: {
      reducer: (state, action) => {
        const { title, message, onConfirm, onCancel } = action.payload;
        state.warningModalShow = true;
        state.warningModalTitle = title;
        state.warningModalMessage = message;
        state.warningModalOnConfirm = onConfirm;
        state.warningModalOnCancel = onCancel;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    }
  }
});

export const {
  setIssueSource,
  setIssueDestination,
  setFromCreate,
  setOpenCardStatus,
  setKanbanModalShow,
  setIssueModalAction,
  setDestinationInProgress,
  setWarningModalShow,
  setOpenWarningModalWith,
} = modalSlice.actions;

export default modalSlice.reducer;
