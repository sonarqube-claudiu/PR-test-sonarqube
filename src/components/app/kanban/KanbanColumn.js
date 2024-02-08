import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import KanbanColumnHeader from './KanbanColumnHeader';
import TaskCard from './TaskCard';
import IssueModal from './IssueModal';
import IconButton from 'components/common/IconButton';
import classNames from 'classnames';
import { KanbanContext } from 'context/Context';
import StrictModeDroppable from './StrictModeDroppable';
import { useDispatch } from 'react-redux';
import { setActiveIssue } from 'features/issuesSlice';
import { DragDropContext } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { FormattedMessage } from 'react-intl';
import StoryCard from './StoryCard';
// import { setOpenCardStatus } from 'features/modalSlice';
import { toast } from 'react-toastify';
import { translate } from 'services/intlService';
import { setIssueToBeUpdated, setKanbanModalShow } from 'features/modalSlice';
import { Issue } from 'models/Issue';
import { Utils } from 'models/Utils';

const KanbanColumn = ({ kanbanColumnItem, story }) => {
  const dispatch = useDispatch();
  const { id, name, issues } = kanbanColumnItem;
  const [columnName, setColumnName] = useState(
    Utils.getStatusTranslation(name)
  );
  const sliderRef = useRef(null);
  // const [showForm, setShowForm] = useState(false);
  const activeProject = useSelector(state => state.projects.activeProject);
  const stories = useSelector(
    state => state.projects.projects[activeProject?.id]
  );
  const activeStory = useSelector(state => state.stories.activeStory);
  const kanbanModalShow = useSelector(state => state.modals.kanbanModalShow);
  const projectsScrollCompleted = useSelector(
    state => state.projects.projectsScrollCompleted
  );
  const formViewRef = useRef(null);
  const showAllStories = useSelector(state => state.stories.showAllStories);
  const user = useSelector(state => state.user);
  const [storiesAssignedOrWithIssues, setStoriesAssignedOrWithIssues] =
    useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      formViewRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    return clearTimeout(timeout);
  }, [kanbanModalShow]);

  useLayoutEffect(() => {
    if (
      projectsScrollCompleted &&
      stories &&
      Object.values(stories).length > 0 &&
      activeStory &&
      sliderRef.current
    ) {
      const activeElement = sliderRef.current.querySelector(
        `[data-active-id="${activeStory?.id}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [
    stories,
    projectsScrollCompleted,
    activeStory,
    sliderRef.current,
    showAllStories
  ]);

  useEffect(() => {
    if (!showAllStories && issues && issues.length > 0) {
      const storiesAssignedOrWithIssues = issues.filter(issue => {
        let assignedToUser = false;
        if (!issue.assignments)
          return Object.values(issue.issues || []).length > 0 || false;
        for (const assignment of issue.assignments) {
          if (+assignment.user_id === +user?.id) {
            assignedToUser = true;
          }
        }
        return assignedToUser || Object.values(issue.issues || []).length > 0;
      });
      setStoriesAssignedOrWithIssues(storiesAssignedOrWithIssues);
    } else {
      setStoriesAssignedOrWithIssues(Object.values(issues || []));
    }
  }, [showAllStories, kanbanColumnItem]);

  return (
    // <div className={classNames('kanban-column', { 'form-added': showForm})}>
    <div
      className={classNames('kanban-column', { 'form-added': kanbanModalShow })}
    >
      <KanbanColumnHeader
        id={id}
        title={columnName}
        status={id}
        story={story}
        storiesLength={issues.length}
        itemCount={
          story
            ? `${
                storiesAssignedOrWithIssues?.length ===
                Object.values(issues || []).length
                  ? storiesAssignedOrWithIssues?.length +
                    '/' +
                    Object.values(issues || []).length
                  : storiesAssignedOrWithIssues?.length +
                    '/' +
                    Object.values(issues || []).length
              }`
            : Object.values(issues || []).length
        }
      />
      <StrictModeDroppable droppableId={`${id}`} type="KANBAN">
        {provided => (
          <div className="w-100 m-0 p-0" ref={sliderRef}>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              id={`container-${id}`}
              className="kanban-items-container scrollbar"
            >
              {[...issues].map((issue, index) => {
                return (
                  <React.Fragment key={issue.id}>
                    {story && (
                      <StoryCard key={issue.id} index={index} story={issue} />
                    )}
                    {!story && (
                      <TaskCard key={issue.id} index={index} issue={issue} />
                    )}
                  </React.Fragment>
                );
              })}
              {provided.placeholder}
              <div ref={formViewRef}></div>
            </div>
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
};

export default KanbanColumn;
