import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Col,
  Collapse,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import Notification from 'components/notification/Notification';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProjectJournals } from 'features/projectJournalsThunk';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Utils } from 'models/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SoftBadge from 'components/common/SoftBadge';
import { ProjectHistoryTimeline } from './ProjectHistoryTimeline';
import IconButton from 'components/common/IconButton';

const ProjectActivityLog = ({ showAll }) => {
  const { projectId } = useParams();
  const journals = useSelector(
    state => state.projectJournals.journals[projectId]
  );
  const [collapsed, setCollapsed] = useState(false);
  const intl = useIntl();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!projectId) return;
    navigate(`/admin/project/${projectId}/activity-log`);
  };

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectJournals(projectId, user.token));
    }
  }, [projectId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {showAll && (
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip style={{ position: 'fixed' }}>
              <FormattedMessage id={'btn.back'} />
            </Tooltip>
          }
        >
          <button
            onClick={handleBack}
            type="button"
            className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
          >{`<`}</button>
        </OverlayTrigger>
      )}
      <Card>
        <Card.Header className="bg-light">
          <Flex justifyContent="between">
            <h5 className="mb-1 mb-md-0 fs-1">
              <FormattedMessage id="project.details.page.activityLog.title" />
            </h5>
            {!showAll && (
              <IconButton
                variant="falcon-default"
                size="sm"
                icon={['far', 'clock']}
                transform="shrink-3"
                onClick={handleClick}
              >
                <FormattedMessage id="project.details.page.activityLog.allLogsBtn" />
              </IconButton>
            )}
          </Flex>
        </Card.Header>
        <Card.Body className="p-2">
          {collapsed && !showAll && (
            <ProjectHistoryTimeline
              journals={journals?.slice(journals.length - 3, journals.length)}
            />
          )}
          {!collapsed && !showAll && (
            <ProjectHistoryTimeline
              journals={journals?.slice(journals.length - 1, journals.length)}
            />
          )}
          {showAll && <ProjectHistoryTimeline journals={journals} />}
        </Card.Body>
        {!showAll && (
          <Card.Footer className="bg-light p-0 border-top d-grid">
            <Button
              variant="link"
              // className="me-2 mb-1"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FormattedMessage id="project.details.page.activityLog.show" />{' '}
              <FormattedMessage
                id={
                  collapsed
                    ? 'project.details.page.activityLog.less'
                    : 'project.details.page.activityLog.more'
                }
              />
              <FontAwesomeIcon
                icon="chevron-down"
                className="ms-2 fs--2"
                transform={collapsed ? 'rotate-180' : ''}
              />
            </Button>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};
export default ProjectActivityLog;
