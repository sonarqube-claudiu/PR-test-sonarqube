import React from 'react';
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import FormView from '../kanban/FormView';
import IconButton from 'components/common/IconButton';
import FormInput from '../kanban/FormInput';
import { useDispatch } from 'react-redux';
import {
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { deleteSprint } from 'features/sprintThunk';
import { deleteSprintLocally } from 'features/sprintSlice';

const SprintView = () => {
  const { sprintId, projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();
  const user = useSelector(state => state.user);
  const projects = useSelector(state => state.projects.projects);
  const sprints = useSelector(state => state.sprints.sprints);
  const sprint = sprints[sprintId] || projects[projectId]?.sprints[sprintId];
  // const sprint = Object.values(sprints || []).find(
  //   sprint => sprint.id === sprintId
  // );

  const handleViewProject = () => {
    if (!sprint) return;
    navigate(`/projects/view/${projectId}`);
  };

  const handleEdit = () => {
    if (!sprint) return;
    navigate(`/admin/project/${projectId}/sprints/edit/${sprintId}`);
  };

  const handleDelete = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'modal.sprint.delete.title',
        message: 'modal.sprint.delete.message',
        onConfirm: () => {
          dispatch(deleteSprint(sprint.id, user.token));
          dispatch(deleteSprintLocally(sprint.id));
          dispatch(setWarningModalShow(false));
          navigate(-1);
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
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
          className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
        >{`<`}</button>
      </OverlayTrigger>
      <Card className="mb-3">
        <Card.Header className="bg-light">
          <Row>
            <Col lg={10}>
              <h4 className="mb-4">
                {sprint?.name}
                {/* Anthony Hopkins <VerifiedBadge /> */}
                <IconButton
                  variant="falcon-default"
                  size="sm"
                  icon={'table'}
                  transform="shrink-3"
                  className="ms-3"
                  onClick={handleViewProject}
                  iconAlign="middle"
                >
                  <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                    <FormattedMessage id="sprint.page.column.projectBtn" />
                  </span>
                </IconButton>
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
          </Row>
        </Card.Header>
      </Card>
      <Card>
        <Card.Body>
          {/* <p>Start Date: {focusPeriod.start_date}</p> */}
          {/* <p>End Date: {focusPeriod.end_date}</p> */}
          <FormView
            type={'text'}
            icon={'comment'}
            value={sprint?.name}
            label={intl.formatMessage({ id: 'sprint.page.label.name' })}
          />
          <FormView
            type={'text'}
            icon={'align-left'}
            value={
              sprint?.description ||
              intl.formatMessage({ id: 'sprint.page.label.noDescription' })
            }
            label={intl.formatMessage({ id: 'sprint.page.label.description' })}
          />
          <FormView
            type={'text'}
            icon={['far', 'clock']}
            value={sprint?.start_date}
            label={intl.formatMessage({ id: 'sprint.page.label.startDate' })}
          />
          <FormView
            type={'text'}
            icon={'clock'}
            value={sprint?.end_date}
            label={intl.formatMessage({ id: 'sprint.page.label.endDate' })}
          />
          <FormView
            type={'text'}
            icon={'table'}
            value={
              projects[sprint?.project_id]?.name ||
              intl.formatMessage({ id: 'sprint.page.label.noProject' })
            }
            label={intl.formatMessage({ id: 'sprint.page.label.project' })}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default SprintView;
