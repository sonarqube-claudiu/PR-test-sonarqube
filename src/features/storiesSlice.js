import { createSlice } from '@reduxjs/toolkit';
import { HttpStatusCodes } from 'api/utils';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';

const initialState = {
  activeStory: null,
  // stories: [],
  byProjectId: [],
  previousStoriesStack: [],
  showAllStories: false,
  update: false
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setUpdateStories: {
      reducer: (state, action) => {
        state.update = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    toggleShowAllStories: {
      reducer: (state, action) => {
        state.showAllStories = !state.showAllStories;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    setActiveStory: {
      reducer: (state, action) => {
        state.activeStory = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateStoryPositionLocally: {
      reducer: (state, action) => {
        const { storyId, newPosition } = action.payload;
        const story =
          state.stories && state.stories.find(i => +i.id === +storyId);
        if (story) {
          story.position = newPosition;
        }
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateStories: {
      reducer: (state, action) => {
        state.stories = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    getStoriesCommit: {
      reducer: (state, action) => {
        const {projectId, stories} = action.payload.data.getStories;
        state.byProjectId[projectId] = stories;
        state.loading = false;
        // state.stories = stories && stories.length > 0 ? stories : [];
        // state.update = false;
      }
    },

    getStoriesRollback: {
      reducer: (state, action) => {
        state.update = false;
        console.log(action);
      }
    },

    setPreviousStories: {
      reducer: (state, action) => {
        state.previousStoriesStack.push(action.payload);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },

    updateStoryPositionCommit: {
      reducer: (state, action) => {
        const { status, message, issue } =
          action.payload.data.updateIssuePosition;
        if (
          status === HttpStatusCodes.OK ||
          status === HttpStatusCodes.NO_CONTENT
        ) {
          state.previousStoriesStack = [];
          state.update = true;
          // toast.info(`Story position updated successfully`);
        } else if (status === HttpStatusCodes.BAD_REQUEST) {
          if (state.previousStoriesStack.length > 0) {
            state.stories = state.previousStoriesStack.pop();
          }
          toast.error(translate('popup.issue.position.fail'));
        }
        // console.log(action);
      }
    },

    updateStoryPositionRollback: {
      reducer: (state, action) => {
        if (state.previousStoriesStack.length > 0) {
          state.stories = state.previousStoriesStack.pop();
        }
        toast.error(translate('popup.issue.position.fail'));
        // console.log(action);
      }
    },

    updateSourceStoryPositionCommit: {
      reducer: (state, action) => {
        const { status, message } = action.payload.data.updateStoryPosition;
        state.update = false;
        if (status && status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
          toast.error(message);
        }
        // console.log(action);
      }
    },

    updateSourceStoryPositionRollback: {
      reducer: (state, action) => {
        state.update = false;
        // console.log(action);
      }
    }
  }
});

export const {
  setActiveStory,
  updateStories,
  updateStoryPositionLocally,
  setPreviousStories,
  toggleShowAllStories,
  setUpdateStories
} = storiesSlice.actions;

export default storiesSlice.reducer;
