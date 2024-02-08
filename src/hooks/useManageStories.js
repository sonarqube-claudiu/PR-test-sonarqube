import { setDestinationInProgress } from 'features/modalSlice';
import { setActiveStory } from 'features/storiesSlice';
import { getStories } from 'features/storiesThunk';
import { Issue } from 'models/Issue';
import { Story } from 'models/Story';
import { Utils } from 'models/Utils';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import { startTransition } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Custom Hook
const useManageStories = () => {
  const dispatch = useDispatch();
  const activeProject = useSelector(state => state.projects.activeProject);
  const activeStory = useSelector(state => state.stories.activeStory);
  const activeIssue = useSelector(state => state.issues.activeIssue);
  const projectStories = useSelector(
    state => state.projects.projects[activeProject?.id]?.stories
  );
  const user = useSelector(state => state.user);
  const showAllStories = useSelector(state => state.stories.showAllStories);

  const assignedToUser = story => {
    for (const assignment of story.assignments) {
      if (+assignment.user_id === +user?.id) {
        return true;
      }
    }
    return false;
  };

  const handleActiveStory = () => {
    if (
      activeStory &&
      activeProject &&
      Object.values(projectStories || []).length > 0
    ) {
      const activeStoryInProject = projectStories[activeStory?.id];
      const activeStoryWithIssues =
        Object.values(activeStory?.issues || []).length > 0;
      const activeStoryNotHidden =
        assignedToUser(activeStory) || activeStoryWithIssues || showAllStories;

      if (!activeStoryInProject || !activeStoryNotHidden) {
        let toBeActiveStory;
        if (activeIssue && projectStories[activeIssue.parent_id]) {
          toBeActiveStory = projectStories[activeIssue.parent_id];
        } else {
          if (showAllStories) {
            toBeActiveStory = Object.values(projectStories).sort((a, b) =>
              Utils.sortAsc(a.position, b.position)
            )[0];
          } else {
            toBeActiveStory = Object.values(projectStories)
              .sort((a, b) => Utils.sortAsc(a.position, b.position))
              .find(story => {
                return (
                  Object.values(story.issues).length > 0 ||
                  assignedToUser(story)
                );
              });
          }
        }
        if (toBeActiveStory) {
          dispatch(setActiveStory(toBeActiveStory));
        } else {
          dispatch(setActiveStory(null));
        }
      }
    } else {
      let toBeActiveStory;
      if (showAllStories) {
        toBeActiveStory = Object.values(projectStories || []).sort((a, b) =>
          Utils.sortAsc(a.position, b.position)
        )[0];
      } else {
        toBeActiveStory = Object.values(projectStories || [])
          .sort((a, b) => Utils.sortAsc(a.position, b.position))
          .find(story => {
            return (
              Object.values(story.issues).length > 0 || assignedToUser(story)
            );
          });
      }

      if (toBeActiveStory) {
        dispatch(setActiveStory(toBeActiveStory));
      } else {
        dispatch(setActiveStory(null));
      }
    }
  };

  useEffect(() => {
    if (projectStories) {
      handleActiveStory();
    }
  }, [activeProject, projectStories, showAllStories, dispatch]);
};

export default useManageStories;
