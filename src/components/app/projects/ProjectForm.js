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
import { fetchAllUsers } from 'features/userThunk';

const initialState = {
  name: '',
  description: '',
  members: [],
  nameInvalid: false,
  descriptionInvalid: false
};

const projectDispatcher = (state, action) => {
  switch (action.type) {
    case PROJECT_REDUCER_ACTION.SET_NAME:
      return { ...state, name: action.payload };
    case PROJECT_REDUCER_ACTION.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case PROJECT_REDUCER_ACTION.SET_NAME_INVALID:
      return { ...state, nameInvalid: action.payload };
    case PROJECT_REDUCER_ACTION.SET_DESCRIPTION_INVALID:
      return { ...state, descriptionInvalid: action.payload };
    case PROJECT_REDUCER_ACTION.SET_MEMBERS:
      return { ...state, members: action.payload };
    default:
      return state;
  }
};

export const ProjectForm = ({ edit }) => {
  const { projectId } = useParams();
  const projects = useSelector(state => state.projects.projects);
  const [reducer, dispatchReducer] = useReducer(
    projectDispatcher,
    initialState
  );
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user && user.id && user.token) {
      const getAllUsers = async () => {
        const users = await dispatch(fetchAllUsers(user.id, user.token));
        setAllUsers(users);
      };
      getAllUsers();
    }
  }, []);

  useEffect(() => {
    if (edit && projectId) {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_NAME,
        payload: projects[projectId]?.name
      });
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_DESCRIPTION,
        payload: projects[projectId]?.description
      });
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
        payload: projects[projectId]?.members.map(member => {
          return {
            value: member.user.id,
            label: member.user.display_name
          };
        })
      });
    }
  }, [edit]);

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      const project = new Project({
        name: reducer.name,
        description: reducer.description,
        data_source_id: 0,
        id: edit ? projectId : 0
      });

      const members = reducer.members.map(member => {
        return {
          user_id: member.value
        };
      });

      if (edit) {
        dispatch(updateProject(project, members, user.token));
      } else {
        dispatch(createProject(project, members, user.token));
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
    return isValid;
  };

  const handleBack = () => {
    // navigate back
    navigate(-1);
  };

  const handleMembers = value => {
    if (value.length > reducer.members.length) {
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
        payload: value
      });
    } else {
      if (edit) {
        dispatch(
          setOpenWarningModalWith({
            title: 'project.page.deleteMember.title',
            message: `project.page.deleteMember.message`,
            onConfirm: () => {
              dispatchReducer({
                type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
                payload: value
              });
              dispatch(setWarningModalShow(false));
            },
            onCancel: () => {
              dispatchReducer({
                type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
                payload: reducer.members
              });
              dispatch(setWarningModalShow(false));
            }
          })
        );
      } else {
        dispatchReducer({
          type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
          payload: value
        });
      }
      dispatchReducer({
        type: PROJECT_REDUCER_ACTION.SET_MEMBERS,
        payload: value
      });
    }
  };

  return (
    <div>
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
              <FormattedMessage id="project.page.title.edit" />
            ) : (
              <FormattedMessage id="project.page.title.create" />
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
                  setValue={e => {
                    if (e.target.value.length <= INPUT_SUBJECT_MAX_LEN) {
                      dispatchReducer({
                        type: PROJECT_REDUCER_ACTION.SET_NAME,
                        payload: e.target.value
                      });
                    }
                  }}
                  label={intl.formatMessage({
                    id: 'project.page.label.name'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'project.page.placeholder.name'
                  })}
                  isInvalid={reducer.nameInvalid}
                  //   inputRef={subjectRef}
                  rows={2}
                  className={' '}
                  hint={`${intl.formatMessage({
                    id: 'project.page.input.name.hint'
                  })}`} //(${reducer.subjectLen}/${INPUT_SUBJECT_MAX_LEN})
                  errMsg={intl.formatMessage({
                    id: 'project.page.input.name.error'
                  })}
                />
                <FormInput
                  type="textarea"
                  value={reducer.description}
                  icon={'align-left'}
                  setValue={e =>
                    e.target.value.length <= INPUT_DESC_MAX_LEN
                      ? dispatchReducer({
                          type: PROJECT_REDUCER_ACTION.SET_DESCRIPTION,
                          payload: e.target.value
                        })
                      : null
                  }
                  label={intl.formatMessage({
                    id: 'project.page.label.description'
                  })}
                  placeholder={intl.formatMessage({
                    id: 'project.page.placeholder.description'
                  })}
                  rows={5}
                  className=" "
                  hint={intl.formatMessage({
                    id: 'project.page.input.description.hint'
                  })}
                  isInvalid={reducer.descriptionInvalid}
                  errMsg={intl.formatMessage({
                    id: 'project.page.input.description.error'
                  })}
                />
                <FormInput
                  type="multiselect"
                  icon="users"
                  label={intl.formatMessage({
                    id: 'project.page.label.members'
                  })}
                  options={allUsers.map(user => ({
                    value: user.id,
                    label: user.display_name
                  }))}
                  placeholder="Select group members..."
                  value={reducer.members}
                  setValue={handleMembers}
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
    </div>
  );
};
