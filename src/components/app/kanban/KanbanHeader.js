import React, { useEffect } from 'react';
import { ProjectContainer } from './ProjectContainer';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spinner } from 'react-bootstrap';

/**
 * Renders the header for the Kanban board.
 * @returns {JSX.Element} The KanbanHeader component.
 */
const KanbanHeader = () => {
  const focusPeriod = useSelector(state => state.focusperiod.focusPeriod);
  const loading = useSelector(state => state.projects.loading);
  const intl = useIntl();

  /**
   * Calculates the time left for the sprint.
   * @param {Object} sprint - The sprint object.
   * @returns {string} The time left for the sprint.
   */
  const getFocusPeriodTimeLeft = (endDate, startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    const endFPDate = new Date(endDate);
    endFPDate.setHours(0, 0, 0, 0); // Start of the day

    const timeLeft =
      endFPDate.getTime() - today.getTime() + 24 * 60 * 60 * 1000; // Add a day's worth of milliseconds
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysLeft / 7);
    const days = daysLeft % 7;

    const returnString = `(${
      weeks && weeks > 0
        ? weeks.toString().concat(
            ` ${intl.formatMessage({
              id:
                weeks === 1
                  ? 'project.container.week'
                  : 'project.container.weeks'
            })}`
          )
        : ''
    } ${
      days && days > 0
        ? days.toString().concat(
            ` ${intl.formatMessage({
              id:
                days === 1 ? 'project.container.day' : 'project.container.days'
            })}`
          )
        : ''
    })`;

    return returnString;
  };

  return (
    <div className="gx-0 kanban-header d-flex flex-row rounded-2 px-x1 py-2 mt-2 mb-2 mx-3">
      {loading && (
        <div className="position-absolute m-0 p-0">
          <Spinner
            animation="border"
            role="status"
            style={{ height: '25px', width: '25px' }}
          />
        </div>
      )}
      <div
        className="d-flex flex-column justify-content-center flex-grow-0"
        style={{ minWidth: '250px' }}
      >
        <p className="mb-0 fs-0">
          <FormattedMessage id="project.container.sprint" />:{' '}
          {getFocusPeriodTimeLeft(focusPeriod?.end_date, focusPeriod?.start_date)}
        </p>
        <p className="mb-0 fs-0">
          <FormattedMessage id="project.container.startDate" />:{' '}
          {focusPeriod?.start_date}
        </p>
        <p className="mb-0 fs-0">
          <FormattedMessage id="project.container.endDate" />:{' '}
          {focusPeriod?.end_date}
        </p>
      </div>
      <div className="d-flex overflow-hidden flex-grow-1">
        <ProjectContainer />
      </div>
    </div>
  );
};

export default KanbanHeader;
