import React from 'react';
import ProjectBanner from './Banner';
import ProjectDesc from './ProjectDesc';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import activities from 'data/activities';
import Followers from './Members';
import ActivityLog from './ActivityLog';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Members from './Members';
import ProfileBanner from '../ProjectBanner';

const Project = () => {

  const {projectId} = useParams();
  const projects = useSelector(state => state.projects.projects);
  const project = Object.values(projects || []).find(project => project.id === projectId);
  
  return (
    <>
    <OverlayTrigger
     placement="right"
     overlay={
       <Tooltip style={{ position: 'fixed' }}>
        Back To Projects Page
       </Tooltip>
     }>
      <Link to="/projects/table-view">
        <button className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3">{`<`}</button>
      </Link>
    </OverlayTrigger>
      <ProjectBanner project={project}/>
      <Row className="g-3 mb-3">
        <Col lg={12}>
          <ProjectDesc project={project}/>
          <ActivityLog className="mt-3" activities={activities.slice(5, 9)} />
        </Col>
      </Row>
      <Members
        totalMembers={project?.members?.length}
        members={project?.members}
      />
    </>
  );
};

export default Project;
