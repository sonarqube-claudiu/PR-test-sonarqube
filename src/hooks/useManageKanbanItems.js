// useUpdateKanbanItems.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateKanbanItemsWithIssues } from 'features/kanbanSlice';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import { useSelector } from 'react-redux';
import { startTransition } from 'react';
import { Issue } from 'models/Issue';

const useManageKanbanItems = () => {
  const dispatch = useDispatch();
  const activeProject = useSelector(state => state.projects.activeProject);
  const activeStory = useSelector(state => state.stories.activeStory);
  const stories = useSelector(
    state => state.projects.projects[activeProject?.id]?.stories
  );

  useEffect(() => {
    startTransition(() => {
      if (
        activeProject &&
        activeStory &&
        stories &&
        stories[activeStory?.id] &&
        Object.values(stories[activeStory?.id]?.issues)?.length > 0
      ) {
        dispatch(
          updateKanbanItemsWithIssues({
            issues: Object.values(stories[activeStory?.id]?.issues)
          })
        );
      } else {
        dispatch(updateKanbanItemsWithIssues({ issues: [] }));
      }
    });
  }, [stories, activeStory, activeProject, dispatch]);
};

export default useManageKanbanItems;
