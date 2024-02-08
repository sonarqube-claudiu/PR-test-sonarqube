import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import coverSrc from 'assets/img/generic/4.jpg';
import apple from 'assets/img/logos/apple.png';
import google from 'assets/img/logos/g.png';
import hp from 'assets/img/logos/hp.png';
import avatar from 'assets/img/team/2.jpg';
import Flex from 'components/common/Flex';
import VerifiedBadge from 'components/common/VerifiedBadge';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProfileBanner from '../../pages/ProjectBanner';
import { useSelector } from 'react-redux';
import IconButton from 'components/common/IconButton';
import { useDispatch } from 'react-redux';
import { deleteProjectLocally, setActiveProject } from 'features/projectsSlice';
import { FormattedMessage } from 'react-intl';
import {
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { deleteProject } from 'features/projectsThunk';

const Banner = ({ project }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const handleViewIssues = () => {
    dispatch(setActiveProject(project));
  };

  const handleEdit = () => {
    if(!project) return;
    navigate(`/projects/edit/${project?.id}`);
  };

  const handleDelete = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'modal.project.delete.title',
        message: 'modal.project.delete.message',
        onConfirm: () => {
          dispatch(deleteProject(project.id, user.token));
          dispatch(deleteProjectLocally(project.id));
          dispatch(setActiveProject(null));
          dispatch(setWarningModalShow(false));
          navigate('/projects');
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  const dispatch = useDispatch();

  return (
    <ProfileBanner>
      {/* <ProfileBanner.Header avatar={avatar} coverSrc={coverSrc} /> */}
      <ProfileBanner.Body>
        <Row>
          <Col lg={10}>
            <h4 className="mb-4">
              {project?.name}
              {/* Anthony Hopkins <VerifiedBadge /> */}
              <Link to="/">
                <IconButton
                  variant="falcon-default"
                  size="sm"
                  icon={['fab', 'trello']}
                  transform="shrink-3"
                  className="ms-3"
                  onClick={handleViewIssues}
                  iconAlign="middle"
                >
                  <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                    <FormattedMessage id="projects.page.column.issueBtn" />
                  </span>
                </IconButton>
              </Link>
            </h4>
          </Col>
          <Col lg={2}>
            <div className="d-flex flex-row justify-content-end">
              <IconButton
                variant="falcon-default"
                size="sm"
                icon={'edit'}
                transform="shrink-3"
                onClick={handleEdit}
                iconAlign="middle"
              >
                <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                  <FormattedMessage id="btn.edit" />
                </span>
              </IconButton>
              <IconButton
                variant="falcon-default"
                size="sm"
                icon={'trash'}
                transform="shrink-3"
                className="ms-3"
                onClick={handleDelete}
                iconAlign="middle"
              >
                <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                  <FormattedMessage id="btn.delete" />
                </span>
              </IconButton>
            </div>
          </Col>
          {/* <h5 className="fs-0 fw-normal text-secondary">
            Project Lead: Name To Be Added...
          </h5> */}
        </Row>
      </ProfileBanner.Body>
    </ProfileBanner>
  );
};

export default Banner;
