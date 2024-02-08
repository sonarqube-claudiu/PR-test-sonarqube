import RecentActivity from 'components/dashboards/project-management/RecentActivity';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import ProjectSprintTimeline from './ProjectSprintTimeline';
import IconButton from 'components/common/IconButton';
import { useNavigate } from 'react-router-dom';
import Flex from 'components/common/Flex';

export const ProjectSprints = ({ sprints, project }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!project) return;
    navigate(`/admin/project/${project?.id}/sprints`);
  };
  return (
    <Card className="mb-3">
      <Card.Header className="bg-light">
        <Flex justifyContent="between">
          <h5 className="mb-0">
            <FormattedMessage id="project.details.page.sprints.title" />
          </h5>
          <IconButton
            variant="falcon-default"
            size="sm"
            icon={['far', 'clock']}
            transform="shrink-3"
            onClick={handleClick}
          >
            <FormattedMessage id="project.details.page.sprints.allSprintsBtn" />
          </IconButton>
        </Flex>
      </Card.Header>
      <Card.Body>
        <ProjectSprintTimeline sprints={sprints} />
      </Card.Body>
    </Card>
  );
};
