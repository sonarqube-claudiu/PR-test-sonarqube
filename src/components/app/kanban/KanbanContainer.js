import React, { useEffect, useRef, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import KanbanModal from './KanbanModal';
import { DragDropContext } from 'react-beautiful-dnd';
import is from 'is_js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setIssueToBeUpdated,
  setMovedIssue,
  updateActiveIssue
} from 'features/issuesSlice';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import {
  updateIssue,
  updateIssuePosition,
  updateIssueStatus
} from 'features/issuesThunk';
import { setActiveStory } from 'features/storiesSlice';
// import InProgressModal from './InProgressModal';
import {
  setFromCreate,
  setIssueDestination,
  // setDestinationInProgress,
  setIssueModalAction,
  setIssueSource,
  setKanbanModalShow,
  setOpenCardStatus,
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import useManageKanbanItems from 'hooks/useManageKanbanItems';
import useManageActiveIssue from 'hooks/useManageActiveIssue';
import useManageStories from 'hooks/useManageStories';
import ISSUE_ACTION from 'models/enums/IssueAction';
import {
  setActiveProject,
  setPreviousIssues,
  setPreviousStories,
  updateIssueLocally,
  updateIssuePositionLocally,
  updateStoryPositionLocally
} from 'features/projectsSlice';
import { Issue } from 'models/Issue';
import { Utils } from 'models/Utils';
import { updateStoryPosition } from 'features/storiesThunk';

const KanbanContainer = () => {
  const kanbanColumns = useSelector(state => state.kanban.columns);
  const activeProject = useSelector(state => state.projects.activeProject);
  const activeIssue = useSelector(state => state.issues.activeIssue);
  const activeStory = useSelector(state => state.stories.activeStory);
  const stories = useSelector(state => {
    if (
      state.projects &&
      state.projects.projects &&
      state.projects.projects[activeProject?.id] &&
      state.projects.projects[activeProject?.id].stories
    ) {
      return state.projects.projects[activeProject?.id].stories;
    } else {
      return [];
    }
  });
  const issues = stories ? stories[activeStory?.id]?.issues : {};
  const user = useSelector(state => state.user);
  const projects = useSelector(state => state.projects.projects);
  const dispatch = useDispatch();
  useManageStories();
  useManageKanbanItems();
  useManageActiveIssue();

  useEffect(() => {
    if (is.ipad()) {
      containerRef.current.classList.add('ipad');
    }

    if (is.mobile()) {
      containerRef.current.classList.add('mobile');
      if (is.safari()) {
        containerRef.current.classList.add('safari');
      }
      if (is.chrome()) {
        containerRef.current.classList.add('chrome');
      }
    }
  }, []);

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('issueStatusChange', (event, data) => {
        console.log(data); // prints new issue status
        if (data && data.status && activeIssue) {
          dispatch(updateActiveIssue(data.status));
          console.log(activeIssue);
          dispatch(
            updateIssueStatus(
              activeIssue.id,
              data.status.toString(),
              user.id.toString(),
              user.token
            )
          );
        }
      });
    }

    return () => {
      if (window.ipcRenderer) {
        window.ipcRenderer.removeAllListeners('issueStatusChange');
      }
    };
  }, []);

  const containerRef = useRef(null);

  const getColumn = id => {
    return kanbanColumns.find(item => item.id === Number(id));
  };

  const handleDragStories = result => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.index === destination.index) return;
    const sortedStories = Object.values(stories || []).sort((a, b) =>
      Utils.sortAsc(a.position, b.position)
    );
    const movedStory = sortedStories[source.index];
    const originalIndex = sortedStories.findIndex(
      issue => issue.id === movedStory.id
    );
    const destinationIndex = destination.index;
    const newPosition = Utils.determineNewPositionSameColumn(
      sortedStories,
      originalIndex,
      destinationIndex
    );
    dispatch(setPreviousStories(Utils.deepClone(stories)));
    dispatch(
      updateStoryPositionLocally({ storyId: movedStory.id, newPosition })
    );
    dispatch(updateStoryPosition(movedStory.id, newPosition, user.token));
  };

  const handleIssueStatusChange = (result, movedIssue) => {
    const { source, destination } = result;

    if (!movedIssue) return;

    dispatch(setOpenCardStatus(destination.droppableId));
    dispatch(setIssueToBeUpdated(movedIssue));
    dispatch(setMovedIssue(movedIssue));
    dispatch(setFromCreate(false));

    if (+destination?.droppableId === +ISSUE_STATUS.IN_PROGRESS) {
      if (activeIssue) {
        dispatch(
          setOpenWarningModalWith({
            title: 'destination.inProgress.updateIssue.title',
            message: 'destination.inProgress.updateIssue.message',
            onConfirm: () => {
              dispatch(setIssueToBeUpdated(activeIssue));
              dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_EDIT));
              dispatch(setOpenCardStatus(ISSUE_STATUS.ON_HOLD));
              dispatch(setWarningModalShow(false));
              dispatch(setKanbanModalShow(true));
            },
            onCancel: () => {
              dispatch(
                setOpenWarningModalWith({
                  title: 'destination.inProgress.viewIssue.title',
                  message: 'destination.inProgress.viewIssue.message',
                  onConfirm: () => {
                    dispatch(
                      setActiveProject(projects[activeIssue.project_id])
                    );
                    dispatch(setWarningModalShow(false));
                  },
                  onCancel: () => {
                    dispatch(setWarningModalShow(false));
                  }
                })
              );
            }
          })
        );
      } else {
        dispatch(setPreviousIssues(Utils.deepClone(issues)));
        dispatch(
          updateIssue(
            {
              ...movedIssue,
              status_id: ISSUE_STATUS.IN_PROGRESS
            },
            null,
            user.token
          )
        );
        dispatch(
          updateIssueLocally({
            ...movedIssue,
            status_id: ISSUE_STATUS.IN_PROGRESS
          })
        );
        dispatch(setIssueToBeUpdated(null));
        dispatch(setMovedIssue(null));
      }
    } else if (+destination?.droppableId === +ISSUE_STATUS.NEW) {
      dispatch(
        setOpenWarningModalWith({
          title: 'destination.new.updateIssue.title',
          message: 'destination.new.updateIssue.message',
          onConfirm: () => {
            dispatch(setKanbanModalShow(true));
            dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_UPDATE_STATUS));
            dispatch(setIssueSource(source.droppableId));
            dispatch(setIssueDestination(destination.droppableId));
            dispatch(setWarningModalShow(false));
          },
          onCancel: () => {
            dispatch(setWarningModalShow(false));
          }
        })
      );
    } else {
      dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_UPDATE_STATUS));
      dispatch(setIssueSource(source.droppableId));
      dispatch(setIssueDestination(destination.droppableId));
      dispatch(setKanbanModalShow(true));
    }
  };

  const handleUpdateIssuePosition = issue => {
    dispatch(setPreviousIssues(Utils.deepClone(issues)));
    dispatch(
      updateIssuePositionLocally({
        issueId: issue.id,
        storyId: issue.parent_id,
        newPosition: issue.position
      })
    );
    dispatch(updateIssuePosition(issue.id, issue.position, user.token));
  };

  const handleSameColumnMove = (result, movedIssue) => {
    const { source, destination } = result;
    // get the column issues
    const columnIssues = getColumn(source.droppableId).issues;
    // if the issue is moved to the same position, do nothing
    if (source.index === destination.index) return;
    // the issue's original index
    const originalIndex = columnIssues.findIndex(
      issue => issue.id === movedIssue.id
    );
    // the issue's destination index
    const destinationIndex = destination.index;
    // determine the new position
    const newPosition = Utils.determineNewPositionSameColumn(
      columnIssues,
      originalIndex,
      destinationIndex
    );
    // if the issue's position is the same, do nothing
    if (newPosition === movedIssue?.position) return;
    // update the issue's position both locally and on the server
    handleUpdateIssuePosition({ ...movedIssue, position: newPosition });
  };

  const handleDifferentColumnMove = (result, movedIssue) => {
    const { destination } = result;
    // get the column issues
    const columnIssues = getColumn(destination.droppableId).issues;
    // determine the new position
    const newPosition = Utils.determineNewPositionDifferentColumn(
      columnIssues,
      destination.index
    );
    // handle the status change
    handleIssueStatusChange(result, {
      ...movedIssue,
      position: newPosition ? newPosition : movedIssue.position
    });
  };

  const handleDragEnd = result => {
    const { source, destination } = result;

    if (!destination) return;

    const movedIssue = getColumn(source.droppableId).issues[source.index];

    if (source.droppableId === destination.droppableId) {
      handleSameColumnMove(result, movedIssue);
    } else {
      handleDifferentColumnMove(result, movedIssue);
    }
  };

  return (
    <div className="d-flex flex-row w-100 h-100">
      <DragDropContext onDragEnd={handleDragStories}>
        <KanbanColumn
          key={'user-stories'}
          story={true}
          kanbanColumnItem={{
            id: 'user-stories',
            name: 'User Stories',
            issues: !activeProject
              ? []
              : Object.values(stories)
                  .sort((a, b) => Utils.sortAsc(a.position, b.position))
                  .map(story => {
                    return {
                      ...story,
                      labels: [Utils.getItemLabel(story.issue_type_id)]
                    };
                  })
          }}
        />
      </DragDropContext>
      <span className="ms-n1" />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="d-flex flex-column scrollbar ms-n3 flex-grow-2 w-100">
          <div className="kanban-container scrollbar" ref={containerRef}>
            {kanbanColumns.map(kanbanColumnItem => (
              <KanbanColumn
                key={kanbanColumnItem.id}
                kanbanColumnItem={kanbanColumnItem}
              />
            ))}
            <KanbanModal />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanContainer;
