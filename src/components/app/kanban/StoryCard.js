import React, { useEffect, useState } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SoftBadge from 'components/common/SoftBadge';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { setActiveStory } from 'features/storiesSlice';
import { useSelector } from 'react-redux';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { FormattedMessage } from 'react-intl';
import { Utils } from 'models/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setFromCreate, setIssueModalAction, setKanbanModalShow } from 'features/modalSlice';
import { BsGripHorizontal, BsInfoCircle } from 'react-icons/bs';
import { setIssueToBeUpdated } from 'features/issuesSlice';
import ISSUE_ACTION from 'models/enums/IssueAction';

const StoryCard = ({ story, index }) => {
  const dispatch = useDispatch();
  const activeStory = useSelector(state => state.stories.activeStory);
  const user = useSelector(state => state.user);
  const showAllStories = useSelector(state => state.stories.showAllStories);
  const [totalHours, setTotalHours] = useState(null);
  const [assignedToUser, setAssignedToUser] = useState(false);

  useEffect(() => {
    if (story) {
      if (Object.values(story.issues || []).length > 0) {
        const total = Object.values(story.issues).reduce((acc, issue) => {
          return acc + (+issue.spent_time ? issue.spent_time : 0);
        }, 0);
        const { hours, minutes } = Utils.convertToHoursAndMinutes(total);
        setTotalHours(
          `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''}`
        );
      }

      for (const assignment of story.assignments) {
        if (+assignment?.user_id === +user?.id) {
          setAssignedToUser(true);
          break;
        }
      }
    }
  }, [story]);

  const handleClick = e => {
    e.stopPropagation();
    dispatch(setActiveStory(story));
  };

  const handleView = e => {
    e.stopPropagation();
    dispatch(setKanbanModalShow(true));
    dispatch(setFromCreate(false));
    dispatch(setIssueToBeUpdated(story));
    dispatch(setIssueModalAction(ISSUE_ACTION.US_VIEW));
  };

  const getItemStyle = isDragging => ({
    cursor: isDragging ? 'grabbing' : 'pointer',
    border: `${
      activeStory && activeStory.id === story.id ? 1 : 0
    }px solid white`,
    transform: isDragging ? 'rotate(-2deg)' : ''
  });

  return (
    <>
      {story &&
        (showAllStories ||
          Object.values(story.issues || []).length > 0 ||
          assignedToUser) && (
          <Draggable draggableId={`${story.id}`} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                // {...provided.dragHandleProps}
                style={provided.draggableProps.style}
                className="kanban-item"
                data-active-id={story.id}
              >
                <Card
                  style={getItemStyle(snapshot.isDragging)}
                  className="kanban-item-card hover-actions-trigger"
                  onClick={handleClick}
                >
                  <Card.Header className="d-flex flex-grow justify-content-between align-items-center bg-300 px-1 py-2">
                    <div
                      className="kanban-item-actions draggable--is-dragging"
                      {...provided.dragHandleProps}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip style={{ position: 'fixed' }}>
                            <FormattedMessage id={'story.card.reposition'} />
                          </Tooltip>
                        }
                      >
                        <button className="btn btn-sm btn-outline-none">
                          <BsGripHorizontal size={25} />
                        </button>
                      </OverlayTrigger>
                    </div>
                    <p className="text-primary fw-bold d-flex flex-row align-items-center m-0">
                      #{story.id}
                    </p>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip style={{ position: 'fixed' }}>
                          <FormattedMessage id={'story.card.view'} />
                        </Tooltip>
                      }
                    >
                      <button
                        className="btn btn-sm btn-outline-none"
                        onClick={handleView}
                      >
                        <BsInfoCircle size={18} />
                      </button>
                    </OverlayTrigger>
                  </Card.Header>
                  <Card.Body>
                    {story.labels && (
                      <div className="mb-2 d-flex flex-row align-items-center justify-content-between flex-wrap">
                        {story.labels.map(label => (
                          <SoftBadge
                            key={label.id}
                            bg={label.type}
                            className="py-1 me-1 mb-1"
                          >
                            <FormattedMessage id={label.id} />
                          </SoftBadge>
                        ))}
                        <div
                          className="d-flex flex-row m-0 p-0 flex-wrap"
                          style={{ fontSize: '8px', minWidth: '60px' }}
                        >
                          {Object.keys(ISSUE_STATUS).map(status => {
                            return (
                              <div className="mx-1 my-1 p-0" key={status}>
                                <SoftBadge
                                  bg={Utils.getBadgeColor(status)}
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    height: '20px',
                                    width: '20px',
                                    fontSize: '10px'
                                  }}
                                >
                                  {
                                    Object.values(story.issues)?.filter(
                                      issue =>
                                        issue.status_id === ISSUE_STATUS[status]
                                    ).length
                                  }
                                </SoftBadge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <p className="mb-0 fw-medium font-sans-serif  text-break">
                      {' '}
                      {story.subject}{' '}
                    </p>
                    {!Utils.isEmptyString(totalHours?.trim()) && (
                      <div className="m-0 p-0 w-100 d-flex flex-row justify-content-end">
                        <span className="badge badge-soft-dark me-1">
                          {`${
                            totalHours !== '' && totalHours ? totalHours : ''
                          }`}
                        </span>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </Draggable>
        )}
    </>
  );
};

export default StoryCard;
