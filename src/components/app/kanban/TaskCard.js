import React from 'react';
import { Card } from 'react-bootstrap';
import SoftBadge from 'components/common/SoftBadge';
import { Draggable } from 'react-beautiful-dnd';
import AppContext, { KanbanContext } from 'context/Context';
import {
  setActiveIssue,
  setIssueToBeUpdated,
  setMovedIssue
} from 'features/issuesSlice';
import { setActiveStory } from 'features/storiesSlice';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  setKanbanModalShow,
  setIssueModalAction,
  setOpenCardStatus,
  setIssueSource,
  setFromCreate
} from 'features/modalSlice';
import ISSUE_ACTION from 'models/enums/IssueAction';
import { Utils } from 'models/Utils';
import { DISPLAY_SUBJECT_MAX_LEN } from 'models/Constants';

const TaskCard = ({ issue, index }) => {
  const dispatch = useDispatch();
  const { hours, minutes } = Utils.convertToHoursAndMinutes(issue?.spent_time);

  const handleClick = () => {
    dispatch(setKanbanModalShow(true));
    dispatch(setIssueToBeUpdated(issue));
    dispatch(setIssueSource(issue.status_id));
    dispatch(setMovedIssue(issue));
    dispatch(setOpenCardStatus(issue.status_id));
    dispatch(setIssueModalAction(ISSUE_ACTION.ISSUE_VIEW));
    dispatch(setFromCreate(false));
  };

  const getItemStyle = isDragging => ({
    cursor: isDragging ? 'grabbing' : 'pointer',
    transform: isDragging ? 'rotate(-2deg)' : ''
  });

  return (
    <Draggable draggableId={`${issue.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className="kanban-item"
        >
          <Card
            className="kanban-item-card hover-actions-trigger flex-wrap"
            style={getItemStyle(snapshot.isDragging)}
            onClick={handleClick}
          >
            <Card.Body>
              <div className="d-flex flex-row justify-content-between align-items-center flex-wrap ">
                {' '}
                {/*flex-wrap*/}
                <p className="text-primary fw-medium font-sans-serif stretched-link">
                  #{issue.id}
                </p>
                {issue.labels && (
                  <div className="mb-2 d-flex flex-row align-items-center flex-wrap justify-content-between object-fit-scale">
                    {issue.labels.map(label => (
                      <SoftBadge
                        key={label.id}
                        bg={label.type}
                        className="py-1 me-1 mb-2"
                      >
                        <FormattedMessage id={label.id} />
                      </SoftBadge>
                    ))}
                  </div>
                )}
              </div>
              <p
                className="mb-0 fw-medium font-sans-serif stretched-link h-100 text-break flex-wrap text-break"
                dangerouslySetInnerHTML={{
                  __html:
                    issue.subject.length > DISPLAY_SUBJECT_MAX_LEN
                      ? `${issue.subject.substring(
                          0,
                          DISPLAY_SUBJECT_MAX_LEN
                        )}...`
                      : issue.subject
                }} //
              />
              <div className="d-flex flex-row justify-content-end align-items-end flex-wrap mt-2">
                {(hours !== 0 || minutes !== 0) && (
                  <p className="mb-0 fw-medium text-secondary font-sans-serif streched-link">
                    <span className="badge badge-soft-dark me-1">
                      {`${hours ? hours + 'h' : ''} ${
                        minutes ? minutes + 'm' : ''
                      }`}
                    </span>
                  </p>
                )}
              </div>
              {/* <p className="text-danger">#{issue.position}</p> */}
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
