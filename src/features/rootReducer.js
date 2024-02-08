import { combineReducers } from '@reduxjs/toolkit';
import usersSlice from './userSlice';
import projectsSlice from './projectsSlice';
import languageSlice from './languageSlice';
import authSlice from './authSlice';
import networkSlice from './networkSlice';
import productsSlice from './productsSlice';
import issuesSlice from './issuesSlice';
import kanbanSlice from './kanbanSlice';
import focusPeriodSlice from './focusPeriodSlice';
import storiesSlice from './storiesSlice';
import modalSlice from './modalSlice';
import groupSlice from './groupSlice';
import issueJournalsSlice from './issueJournalsSlice';
import projectJournalsSlice from './projectJournalsSlice';
import sprintSlice from './sprintSlice';
// Import your slice reducers here
// import someFeatureReducer from './someFeatureSlice';

const rootReducer = combineReducers({
  user: usersSlice,
  auth: authSlice,
  projects: projectsSlice,
  issues: issuesSlice,
  products: productsSlice,
  language: languageSlice,
  kanban: kanbanSlice,
  network: networkSlice,
  focusperiod: focusPeriodSlice,
  stories: storiesSlice,
  modals: modalSlice,
  groups: groupSlice,
  issueJournals: issueJournalsSlice,
  projectJournals: projectJournalsSlice,
  sprints: sprintSlice
  // Add more reducers as needed
});

export default rootReducer;
