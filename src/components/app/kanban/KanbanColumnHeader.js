import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import {
  setFromCreate,
  // setCreateToReplace,
  // setInProgressModalShow,
  setIssueModalAction,
  setKanbanModalShow,
  setOpenCardStatus,
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { useSelector } from 'react-redux';
import { setActiveStory, toggleShowAllStories } from 'features/storiesSlice';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { setIssueToBeUpdated } from 'features/issuesSlice';
import { setActiveProject } from 'features/projectsSlice';
import { useNavigate } from 'react-router-dom';

const KanbanColumnHeader = ({
  id,
  title,
  itemCount,
  status,
  story,
  storiesLength
}) => {
  const showAllStories = useSelector(state => state.stories.showAllStories);
  const activeIssue = useSelector(state => state.issues.activeIssue);
  const activeStory = useSelector(state => state.stories.activeStory);
  const activeProject = useSelector(state => state.projects.activeProject);
  const projects = useSelector(state => state.projects.projects);
  const stories = useSelector(
    state => state.stories.byProjectId[activeProject?.id]
  );
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFilter = () => {
    dispatch(toggleShowAllStories());
  };

  const handleAdd = () => {
    if (activeIssue && status === ISSUE_STATUS.IN_PROGRESS) {
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
            dispatch(setFromCreate(true));
          },
          onCancel: () => {
            dispatch(
              setOpenWarningModalWith({
                title: 'destination.inProgress.viewIssue.title',
                message: 'destination.inProgress.viewIssue.message',
                onConfirm: () => {
                  dispatch(
                    setActiveProject(
                      projects.filter(p => +p.id === +activeIssue.project_id)[0]
                    )
                  );
                  dispatch(
                    setActiveStory(
                      stories.filter(s => +s.id === +activeIssue.parent_id)[0]
                    )
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
      if (story) {
        if (Object.values(activeProject?.sprints || [])?.length > 0) {
          dispatch(setKanbanModalShow(true));
          dispatch(setIssueModalAction(ISSUE_ACTION.US_CREATE));
        } else {
          dispatch(
            setOpenWarningModalWith({
              title: 'warning.story.noSprint.title',
              message: 'warning.story.noSprint.message',
              onConfirm: () => {
                navigate(`/admin/project/${activeProject?.id}/sprints/new`);
                dispatch(setWarningModalShow(false));
              },
              onCancel: () => {
                dispatch(setWarningModalShow(false));
              }
            })
          );
        }
      } else {
        dispatch(setKanbanModalShow(true));
        dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_CREATE));
      }
    }
    // dispatch(setCreateToReplace(true));
    dispatch(setOpenCardStatus(id));
  };

  const storyCount = story ? itemCount.split('/')[0] : null;

  return (
    <div className="kanban-column-header text-break">
      <h5 className="fs-0 mb-0">
        <FormattedMessage id={title} />
        {story && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip style={{ position: 'fixed' }}>
                {`${storyCount} ${
                  +storyCount === 1
                    ? intl.formatMessage({
                        id: 'status.column.userStories.userStoryShown'
                      })
                    : intl.formatMessage({
                        id: 'status.column.userStories.userStoriesShown'
                      })
                } ${storiesLength}  ${
                  +storiesLength === 1
                    ? intl.formatMessage({
                        id: 'status.column.userStories.totalUserStory'
                      })
                    : intl.formatMessage({
                        id: 'status.column.userStories.totalUserStories'
                      })
                }`}
              </Tooltip>
            }
          >
            <span className="text-500">({itemCount})</span>
          </OverlayTrigger>
        )}
        {!story && <span className="text-500">({itemCount})</span>}
      </h5>
      <div className="d-flex flex-grow-1 justify-content-end">
        {story && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip style={{ position: 'fixed' }}>
                <FormattedMessage
                  id={
                    showAllStories
                      ? 'status.column.hideAllStories'
                      : 'status.column.showAllStories'
                  }
                />
              </Tooltip>
            }
          >
            <button className="btn btn-sm outline-none" onClick={handleFilter}>
              <FontAwesomeIcon icon={showAllStories ? faEyeSlash : faEye} />
            </button>
          </OverlayTrigger>
        )}
        <button
          className="btn text-dark btn-light btn-sm shadow-none"
          onClick={handleAdd}
          disabled={!story && !activeStory}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default KanbanColumnHeader;
