import { setActiveIssue } from 'features/issuesSlice';
import { getAllIssues } from 'features/issuesThunk';
import { Issue } from 'models/Issue';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import { startTransition } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Custom Hook
const useManageActiveIssue = () => {
  const dispatch = useDispatch();
  const activeIssue = useSelector(state => state.issues.activeIssue);
  const activeStory = useSelector(state => state.stories.activeStory);
  const activeProject = useSelector(state => state.projects.activeProject);
  const stories = useSelector(
    state => state.projects.projects[activeProject?.id]
  );

  const isActiveIssueValid = () => {
    const activeIssueParentValid = stories[activeStory?.id];
    const activeIssueExistsAndIsInProgress =
      stories[activeStory?.id].issues[activeIssue?.id] &&
      Issue.isInProgress(activeIssue);
    return activeIssueExistsAndIsInProgress && activeIssueParentValid;
  };

  const getInProgressIssue = () => {
    const issues = stories[activeStory.id].issues;
    if (issues && Object.values(issues).length === 0) {
      return null;
    }
    return Object.values(issues).find(
      issue => Issue.isInProgress(issue) && Issue.notUserStory(issue)
    );
  };


  // useEffect(() => {
  //   if (!activeIssue && window.ipcRenderer) {
  //     window.ipcRenderer.send('update-current-issue', null);
  //   } else if (window.ipcRenderer) {
  //     window.ipcRenderer.send('update-current-issue', activeIssue);
  //   }
  // }, [activeIssue]);
};

export default useManageActiveIssue;
