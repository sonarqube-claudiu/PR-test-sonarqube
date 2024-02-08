import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export const FocusPeriodTimelineItem = ({ focusPeriod, isLast, icon, status }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin/focus-periods/view/${focusPeriod?.id}`);
  };

  return (
    <Row
      className={classNames(
        'g-3 recent-activity-timeline recent-activity-timeline-primary',
        {
          'pb-x1': !isLast,
          'recent-activity-timeline-past': status === 'completed',
          'recent-activity-timeline-current': status === 'current',
        }
      )}
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
              {focusPeriod.title}
            </h6>
            <p className="fs--1 text-600 mb-0">
              <FormattedMessage id="focusPeriod.page.startDate" />:{' '}
              <b>{focusPeriod.start_date}</b>
            </p>
            <p className="fs--1 text-600 mb-2">
              <FormattedMessage id="focusPeriod.page.endDate" />:{' '}
              <b>{focusPeriod.end_date}</b>
            </p>
            <p className="fs--1 text-600 mb-0">
              <FormattedMessage id="focusPeriod.page.desc" />:{' '}
              <b>
                {focusPeriod.description || (
                  <FormattedMessage id="focusPeriod.page.noDescription" />
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
