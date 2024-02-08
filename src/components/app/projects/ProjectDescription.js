import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Collapse } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const ProjectDescription = ({ project }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Card className="mb-3">
      <Card.Header className="bg-light">
        <h5 className="mb-0 fs-0">
          <FormattedMessage id="project.details.page.description.title" />
        </h5>
      </Card.Header>

      <Card.Body className="text-1000 text-break">
        <span>
          {project?.description?.substring(0, 100)}
          {!collapsed && project?.description?.length > 100 ? '...' : null}
        </span>
        <Collapse in={collapsed}>
          <span>
            {project?.description?.substring(101, project.description.length)}
          </span>
        </Collapse>
      </Card.Body>

      <Card.Footer className="bg-light p-0 border-top d-grid">
        <Button
          variant="link"
          // className="me-2 mb-1"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FormattedMessage id="project.details.page.activityLog.show" /> 
          {' '}
          <FormattedMessage id={collapsed ? 'project.details.page.activityLog.less' : 'project.details.page.activityLog.more'} />
          <FontAwesomeIcon
            icon="chevron-down"
            className="ms-2 fs--2"
            transform={collapsed ? 'rotate-180' : ''}
          />
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProjectDescription;
