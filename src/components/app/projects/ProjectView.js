import React from 'react';
import ProjectBanner from './ProjectBanner';
import ProjectDescription from './ProjectDescription';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import activities from 'data/activities';
import Followers from './ProjectMembers';
import ActivityLog from '../../pages/project/ActivityLog';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProjectMembers from './ProjectMembers';
import ProfileBanner from '../../pages/ProjectBanner';
import ProjectActivityLog from './ProjectActivityLog';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProjectSprints } from './ProjectSprints';

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const projects = useSelector(state => state.projects.projects);
  const project = Object.values(projects || []).find(
    project => project.id === projectId
  );

  const handleBack = () => {
    navigate(-1);
  };

  const intl = useIntl();

  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip style={{ position: 'fixed' }}><FormattedMessage id={'btn.back'} /></Tooltip>}
      >
        <button
          onClick={handleBack}
          className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
        >{`<`}</button>
      </OverlayTrigger>

      <ProjectBanner project={project} />
      <Row className="g-3 mb-3">
        <Col lg={9}>
          <ProjectDescription project={project} />
          <ProjectSprints
            sprints={Object.values(project?.sprints || [])}
            project={project}
          />
          <ProjectActivityLog projectId={projectId} />
        </Col>
        <Col lg={3}>
          <ProjectMembers
            totalMembers={project?.members?.length}
            members={project?.members}
            title={intl.formatMessage({id:"project.details.page.members"})}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProjectView;
