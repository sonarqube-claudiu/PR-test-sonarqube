import React, { useState } from 'react';
import FormInput from '../kanban/FormInput';
import { INPUT_DESC_MAX_LEN, INPUT_SUBJECT_MAX_LEN } from 'models/Constants';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { PROJECT_REDUCER_ACTION } from 'models/enums/ProjectReducerAction';
import { Project } from 'models/Project';
import { createProject, updateProject } from 'features/projectsThunk';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateProjectLocally } from 'features/projectsSlice';
import {
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { SPRINT_REDUCER_ACTION } from 'models/enums/SprintReducerAction';
import { createSprint, updateSprint } from 'features/sprintThunk';

const initialState = {
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  startDateInvalid: false,
  endDateInvalid: false,
  project: null,
  nameInvalid: false,
  descriptionInvalid: false
};

const getInitialState = project => {
  return {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    startDateInvalid: false,
    endDateInvalid: false,
    project: project,
    nameInvalid: false,
    descriptionInvalid: false
  };
};

const sprintDispatcher = (state, action) => {
  switch (action.type) {
    case SPRINT_REDUCER_ACTION.SET_NAME:
      return { ...state, name: action.payload };
    case SPRINT_REDUCER_ACTION.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case SPRINT_REDUCER_ACTION.SET_NAME_INVALID:
      return { ...state, nameInvalid: action.payload };
    case SPRINT_REDUCER_ACTION.SET_DESCRIPTION_INVALID:
      return { ...state, descriptionInvalid: action.payload };
    case SPRINT_REDUCER_ACTION.SET_PROJECT:
      return { ...state, project: action.payload };
    case SPRINT_REDUCER_ACTION.SET_START_DATE:
      return { ...state, startDate: action.payload };
    case SPRINT_REDUCER_ACTION.SET_END_DATE:
      return { ...state, endDate: action.payload };
    case SPRINT_REDUCER_ACTION.SET_START_DATE_INVALID:
      return { ...state, startDateInvalid: action.payload };
    case SPRINT_REDUCER_ACTION.SET_END_DATE_INVALID:
      return { ...state, endDateInvalid: action.payload };
    default:
      return state;
  }
};

export const SprintForm = ({ edit }) => {
  const { sprintId, projectId } = useParams();
  const projects = useSelector(state => state.projects.projects);
  const sprints = useSelector(state => state.sprints.sprints);
  const [reducer, dispatchReducer] = useReducer(
    sprintDispatcher,
    getInitialState(projects[projectId]?.name)
  );
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const toDate = dateString => {
    return new Date(dateString);
  };

  useEffect(() => {
    if (edit && sprintId) {
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_NAME,
        payload: sprints[sprintId]?.name
      });
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_DESCRIPTION,
        payload: sprints[sprintId]?.description
      });
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_START_DATE,
        payload: toDate(sprints[sprintId]?.start_date)
      });
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_END_DATE,
        payload: toDate(sprints[sprintId]?.end_date)
      });
      if (projects && sprints[sprintId]?.project_id) {
        dispatchReducer({
          type: SPRINT_REDUCER_ACTION.SET_PROJECT,
          payload: projects[sprints[sprintId]?.project_id]?.name
        });
      }
    }
  }, [edit, projects]);

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      const projectId = Object.keys(projects).find(
        key => projects[key].name === reducer.project
      );
      if (edit) {
        dispatch(
          updateSprint(
            {
              id: sprintId,
              name: reducer.name,
              description: reducer.description,
              start_date: reducer.startDate,
              end_date: reducer.endDate,
              project_id: projectId
            },
            user.token
          )
        );
      } else {
        dispatch(
          createSprint(
            {
              name: reducer.name,
              description: reducer.description,
              start_date: reducer.startDate,
              end_date: reducer.endDate,
              project_id: projectId
            },
            user.token
          )
        );
      }
      navigate(-1);
    }
  };

  const isFormValid = () => {
    let isValid = true;
    if (
      (reducer.name.length > 0 && reducer.name === ' ') ||
      reducer.name.length === 0
    ) {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_NAME_INVALID,
        payload: true
      });
      isValid = false;
    } else {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_NAME_INVALID,
        payload: false
      });
    }
    if (reducer.description?.length > 0 && reducer.description === ' ') {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_DESCRIPTION_INVALID,
        payload: true
      });
      isValid = false;
    } else {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_DESCRIPTION_INVALID,
        payload: false
      });
    }
    if (reducer.endDate && reducer.startDate > reducer.endDate) {
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_START_DATE_INVALID,
        payload: true
      });
      isValid = false;
    } else {
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_START_DATE_INVALID,
        payload: false
      });
    }

    if (reducer.startDate && reducer.endDate < reducer.startDate) {
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_END_DATE_INVALID,
        payload: true
      });
      isValid = false;
    } else {
      dispatchReducer({
        type: SPRINT_REDUCER_ACTION.SET_END_DATE_INVALID,
        payload: false
      });
    }
    return isValid;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleName = event => {
    if (event.target.value.length <= INPUT_SUBJECT_MAX_LEN) {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_NAME,
        payload: event.target.value
      });
    }
  };

  const handleDescription = event => {
    if (event.target.value.length <= INPUT_DESC_MAX_LEN) {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_DESCRIPTION,
        payload: event.target.value
      });
    }
  };

  const handleProject = event => {
    dispatchReducer({
      type: SPRINT_REDUCER_ACTION.SET_PROJECT,
      payload: event.target.value
    });
  };

  const handleStartDate = value => {
    dispatchReducer({
      type: SPRINT_REDUCER_ACTION.SET_START_DATE,
      payload: value
    });
  };

  const handleEndDate = value => {
    dispatchReducer({
      type: SPRINT_REDUCER_ACTION.SET_END_DATE,
      payload: value
    });
  };

  return (
    <Row className="justify-content-center">
      <Col lg={12}>
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
        <Card className="mb-3">
          <Card.Header className="bg-light">
            <h5 className="mb-0 fs-0">
              {edit ? (
                <FormattedMessage id="sprint.page.title.edit" />
              ) : (
                <FormattedMessage id="sprint.page.title.create" />
              )}
            </h5>
          </Card.Header>

          <Card.Body className="text-1000 text-break">
            <Form>
              <Row className="justify-content-center mt-2">
                <Col lg={12}>
                  <FormInput
                    type="textarea"
                    icon={'comment'}
                    value={reducer.name}
                    setValue={handleName}
                    label={intl.formatMessage({
                      id: 'sprint.page.label.name'
                    })}
                    placeholder={intl.formatMessage({
                      id: 'sprint.page.placeholder.name'
                    })}
                    isInvalid={reducer.nameInvalid}
                    //   inputRef={subjectRef}
                    rows={2}
                    className={' '}
                    hint={`${intl.formatMessage({
                      id: 'sprint.page.input.name.hint'
                    })}`} //(${reducer.subjectLen}/${INPUT_SUBJECT_MAX_LEN})
                    errMsg={intl.formatMessage({
                      id: 'sprint.page.input.name.error'
                    })}
                  />
                  <FormInput
                    type="textarea"
                    value={reducer.description}
                    icon={'align-left'}
                    setValue={handleDescription}
                    label={intl.formatMessage({
                      id: 'sprint.page.label.description'
                    })}
                    placeholder={intl.formatMessage({
                      id: 'sprint.page.placeholder.description'
                    })}
                    rows={5}
                    className=" "
                    hint={intl.formatMessage({
                      id: 'sprint.page.input.description.hint'
                    })}
                    isInvalid={reducer.descriptionInvalid}
                    errMsg={intl.formatMessage({
                      id: 'sprint.page.input.description.error'
                    })}
                  />
                  <FormInput
                    type="datepicker"
                    label={`${intl.formatMessage({
                      id: 'sprint.page.label.startDate'
                    })}`}
                    selected={reducer.startDate}
                    setValue={handleStartDate}
                    className="form-control"
                    placeholder="Select start date"
                    icon="clock"
                    isInvalid={reducer.startDateInvalid}
                    errMsg={`${intl.formatMessage({
                      id: 'sprint.page.input.startDate.error'
                    })}`}
                    hint={`${intl.formatMessage({
                      id: 'sprint.page.input.date.hint'
                    })}`}
                  />
                  <FormInput
                    type="datepicker"
                    label={`${intl.formatMessage({
                      id: 'sprint.page.label.endDate'
                    })}`}
                    selected={reducer.endDate}
                    setValue={handleEndDate}
                    className="form-control"
                    placeholder="Select end date"
                    icon="clock"
                    isInvalid={reducer.endDateInvalid}
                    errMsg={`${intl.formatMessage({
                      id: 'sprint.page.input.endDate.error'
                    })}`}
                    hint={`${intl.formatMessage({
                      id: 'sprint.page.input.date.hint'
                    })}`}
                  />
                  <FormInput
                    type="select"
                    icon="table"
                    label={intl.formatMessage({
                      id: 'sprint.page.label.project'
                    })}
                    options={Object.values(projects)
                      ?.reverse()
                      ?.map(project => {
                        return project.name;
                      })}
                    errMsg={`${intl.formatMessage({
                      id: 'sprint.page.input.project.error'
                    })}`}
                    hint={`${intl.formatMessage({
                      id: 'sprint.page.input.project.hint'
                    })}`}
                    inputDisabled={!edit}
                    placeholder="Select project"
                    value={reducer.project}
                    setValue={handleProject}
                    // form={allUsersRef}
                  />
                </Col>
              </Row>
            </Form>
          </Card.Body>

          <Card.Footer className="bg-light p-0 border-top d-grid p-2">
            <Row className="justify-content-center">
              <Col className="d-flex gap-2" lg={12}>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  className="w-100"
                  onClick={handleSubmit}
                >
                  <FormattedMessage id={edit ? 'btn.update' : 'btn.add'} />
                </Button>
                <Button
                  size="sm"
                  className="btn-danger w-100"
                  type="button"
                  onClick={handleBack}
                >
                  <FormattedMessage id="btn.cancel" />
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};
