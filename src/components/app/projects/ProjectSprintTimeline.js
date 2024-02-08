import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBarReact from 'simplebar-react';
import IconButton from 'components/common/IconButton';
import { Utils } from 'models/Utils';
import {
  setFocusPeriod,
  setFocusPeriodAction,
  setFocusPeriodEdit
} from 'features/focusPeriodSlice';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { SprintTimelineItem } from '../sprints/SprintTimelineItem';
import { useSelector } from 'react-redux';

const ProjectSprintTimeline = ({ sprints }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const focusPeriod = useSelector(state => state.focusperiod.focusPeriod);
  const [activeSprints, setActiveSprints] = React.useState([]);

  const getSprintStatus = sprint => {
    // Check if sprint object is valid
    if (!sprint) return '';
    if (!focusPeriod) return '';

    const { start_date, end_date } = sprint;

    // Function to format date for day comparison (ignores time)
    const formatDateForComparison = dateString => {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Convert dates for comparison (ignoring time)
    const sprintStartDate = formatDateForComparison(start_date);
    const sprintEndDate = formatDateForComparison(end_date);
    const focusStartDate = formatDateForComparison(focusPeriod?.start_date);
    const focusEndDate = formatDateForComparison(focusPeriod?.end_date);

    const today = formatDateForComparison(new Date());

    // Check for invalid dates
    if (isNaN(sprintStartDate.getTime()) || isNaN(sprintEndDate.getTime()))
      return 'invalid';
    if (isNaN(focusStartDate.getTime()) || isNaN(focusEndDate.getTime()))
      return 'invalid';

    // Determine sprint status based on date comparisons
    if (focusStartDate <= sprintStartDate && focusEndDate >= sprintEndDate) {
      return 'current'; // Sprint is ongoing
    } else if (focusStartDate < sprintStartDate) {
      return 'upcoming'; // Sprint hasn't started yet
    } else if (today < sprintEndDate) {
      return 'completed'; // Sprint has finished
    } else {
      return 'false'; // Fallback for any other unhandled case
    }
  };

  const handleClick = () => {
    if (!projectId) return;
    navigate(`/admin/project/${projectId}/sprints/new`);
  };

  useEffect(() => {
    if (!sprints) return;
    const _activeSprints = sprints?.filter(
      sp => getSprintStatus(sp) === 'current'
    );
    if (_activeSprints.length > 0) {
      setActiveSprints(_activeSprints);
    }
  }, [sprints]);

  return (
    <Card>
      {/* <FalconCardHeader title={title} titleTag="h6" /> */}
      <Card.Body className="ps-2">
        {activeSprints?.length > 0 &&
          activeSprints?.map((sprint, index) => {
            {
              return (
                <SprintTimelineItem
                  key={sprint.id}
                  sprint={sprint}
                  icon={['far', 'clock']}
                  isLast={index === sprints?.length - 1}
                  // icon={icon}
                  status={getSprintStatus(sprint)}
                />
              );
            }
          })}
        {activeSprints?.length === 0 && (
          <div className="text-center">
            <p className="fs--1 text-600 mb-0">
              <b className="me-2">
                <FormattedMessage id="sprint.page.label.noSprints" />
              </b>{' '}
              <IconButton
                variant="falcon-default"
                size="sm"
                icon={'plus'}
                transform="shrink-3"
                onClick={handleClick}
              >
                <FormattedMessage id="btn.new" />
              </IconButton>
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProjectSprintTimeline;
