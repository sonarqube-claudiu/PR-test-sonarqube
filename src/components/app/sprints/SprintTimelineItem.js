import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import IconButton from 'components/common/IconButton';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export const SprintTimelineItem = ({ sprint, isLast, icon, status }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin/project/${sprint?.project_id}/sprints/view/${sprint?.id}`);
  };

  return (
    <Row
    //   className={classNames(
    //     'g-3 recent-activity-timeline recent-activity-timeline-primary',
    //     {
    //       'pb-x1': !isLast,
    //       'recent-activity-timeline-past': status === 'completed',
    //       'recent-activity-timeline-current': status === 'current'
    //     }
    //   )}
    >
      <Col xs="auto" className="ps-4 ms-2">
        <div className="ps-2">
          <div
            onClick={handleClick}
            className="icon-item icon-item-sm rounded-circle bg-200 shadow-none cursor-pointer"
          >
            <FontAwesomeIcon icon={icon} className="text-primary" />
          </div>
        </div>
      </Col>
      <Col>
        <Row className={classNames('g-3', { 'border-bottom pb-x1': !isLast })}>
          <Col>
            <h6 onClick={handleClick} className="text-800 mb-1 cursor-pointer">
              {sprint.name}
            </h6>
            <p className="fs--1 text-600 mb-0">
              <FormattedMessage id="sprint.page.label.startDate" />:{' '}
              <b>{sprint.start_date}</b>
            </p>
            <p className="fs--1 text-600 mb-2">
              <FormattedMessage id="sprint.page.label.endDate" />:{' '}
              <b>{sprint.end_date}</b>
            </p>
            <p className="fs--1 text-600 mb-0">
              <FormattedMessage id="sprint.page.label.description" />:{' '}
              <b>
                {sprint.description || (
                  <FormattedMessage id="sprint.page.label.noDescription" />
                )}
              </b>
            </p>
          </Col>
          <Col xs="auto">
            <button
              className="btn btn-sm btn-outline-none text-primary"
              size="sm"
              icon="info-circle"
              transform="shrink-3"
              onClick={handleClick}
            >
              <FormattedMessage id="btn.details" />
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
