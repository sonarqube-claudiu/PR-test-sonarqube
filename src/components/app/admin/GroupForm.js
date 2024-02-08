import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import FormInput from '../kanban/FormInput';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createGroup, updateGroup } from 'features/groupThunk';
import { fetchAllUsers } from 'features/userThunk';
import { useRef } from 'react';
import {
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { GROUP_FIELDS } from 'models/enums/GroupFields';
import { useReducer } from 'react';
import { INPUT_DESC_MAX_LEN } from 'models/Constants';
import { setPreviousGroups, updateGroupLocally } from 'features/groupSlice';
import { Utils } from 'models/Utils';
import { FormattedMessage, useIntl } from 'react-intl';

const groupDispatcher = (state, action) => {
  switch (action.type) {
    case GROUP_FIELDS.SET_NAME:
      return {
        ...state,
        name: action.payload
      };
    case GROUP_FIELDS.SET_NAME_INVALID:
      return {
        ...state,
        nameInvalid: action.payload
      };
    case GROUP_FIELDS.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload
      };
    // case GROUP_FIELDS.SET_DESCRIPTION_INVALID:
    //   return {
    //     ...state,
    //     descriptionInvalid: action.payload
    //   };
    case GROUP_FIELDS.SET_ALL_USERS:
      return {
        ...state,
        all_users: action.payload
      };
    case GROUP_FIELDS.SET_SELECTED_MEMBERS:
      return {
        ...state,
        selected_users: action.payload
      };
    default:
      return state;
  }
};

const getGroupReducerInitialState = groupToBeEdited => {
  return {
    name: '',
    nameInvalid: false,
    description: '',
    // descriptionInvalid: false,
    all_users: [],
    selected_users: []
  };
};

const GroupForm = ({ edit }) => {
  const dispatch = useDispatch();

  const [reducer, dispatchReducer] = useReducer(
    groupDispatcher,
    getGroupReducerInitialState(edit)
  );

  const { groupId } = useParams();

  const token = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);
  const groups = useSelector(state => state.groups.groups);
  const groupsPerPage = useSelector(state => state.groups.groupsPerPage);

  const allUsersRef = useRef(reducer?.all_users);
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    if (edit) {
      dispatchReducer({
        type: GROUP_FIELDS.SET_NAME,
        payload: groups[groupId]?.name
      });
      dispatchReducer({
        type: GROUP_FIELDS.SET_DESCRIPTION,
        payload: groups[groupId]?.description
      });
      dispatchReducer({
        type: GROUP_FIELDS.SET_SELECTED_MEMBERS,
        payload: groups[groupId]?.group_members.map(member => {
          if (!member.user) {
            return {
              value: member.user_id,
              label: intl.formatMessage({id: "groups.page.input.multiselect.userNotFound"})
            };
          }
          return {
            value: member.user.id,
            label: member.user.display_name
          };
        })
      });
    }
  }, [edit]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await dispatch(fetchAllUsers(userId, token));
      dispatchReducer({ type: GROUP_FIELDS.SET_ALL_USERS, payload: users });
    };
    getUsers();
  }, []);

  const handleCreateGroup = () => {
    dispatch(
      createGroup(
        {
          name: reducer.name,
          description: reducer.description,
          focusperiod_id: null
        },
        reducer.selected_users.map(user => ({user:{id: user.value, display_name: user.label}})),
        token
      )
    );
    handleFormReset();
  };

  const handleUpdateGroup = () => {
    dispatch(setPreviousGroups(Utils.deepClone(groups)));
    dispatch(
      updateGroup(
        {
          ...groups[groupId],
          name: reducer.name,
          description: reducer.description,
          group_members: reducer.selected_users.map(user => ({user:{id: user.value, display_name: user.label}}))
        },
        userId,
        token
      )
    );
    dispatch(
      updateGroupLocally({
        ...groups[groupId],
        name: reducer.name,
        description: reducer.description,
        group_members: reducer.selected_users.map(user => ({user:{id: user.value, display_name: user.label}}))
      })
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    let invalid = false;
    if (reducer.name === '') {
      dispatchReducer({ type: GROUP_FIELDS.SET_NAME_INVALID, payload: true });
      invalid = true;
    }
    if (
      reducer.description !== '' &&
      reducer.description.length >= INPUT_DESC_MAX_LEN
    ) {
      dispatchReducer({
        type: GROUP_FIELDS.SET_DESCRIPTION_INVALID,
        payload: true
      });
      invalid = true;
    }
    if (!invalid) {
      if (edit) {
        handleUpdateGroup();
      } else {
        handleCreateGroup();
      }
      handleBack();
    }
  };

  const handleMembersChange = value => {
    if (edit && value.length < reducer?.selected_users.length) {
      dispatch(
        setOpenWarningModalWith({
          title: intl.formatMessage({
            id: 'warning.group.removeMember.title'
          }),
          message: intl.formatMessage({
            id: 'warning.group.removeMember.message'
          }),
          onConfirm: () => {
            dispatchReducer({
              type: GROUP_FIELDS.SET_SELECTED_MEMBERS,
              payload: value
            });
            dispatch(setWarningModalShow(false));
          },
          onCancel: () => {
            dispatchReducer({
              type: GROUP_FIELDS.SET_SELECTED_MEMBERS,
              payload: reducer?.selected_users
            });
            dispatch(setWarningModalShow(false));
          }
        })
      );
    } else {
      dispatchReducer({
        type: GROUP_FIELDS.SET_SELECTED_MEMBERS,
        payload: value
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFormReset = () => {
    dispatchReducer({ type: GROUP_FIELDS.SET_NAME, payload: '' });
    dispatchReducer({ type: GROUP_FIELDS.SET_DESCRIPTION, payload: '' });
    dispatchReducer({ type: GROUP_FIELDS.SET_SELECTED_MEMBERS, payload: [] });
  };

  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip style={{ position: 'fixed' }}>Back To Groups Page</Tooltip>
        }
      >
        {/* <Link to="/admin/groups"> */}
        <button
          className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
          onClick={() => navigate('/admin/groups')}
        >{`<`}</button>
        {/* </Link> */}
      </OverlayTrigger>
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0 fs-0">
            {edit ? (
              <span className="ms-3">
                <FormattedMessage id="groups.edit.title" />
              </span>
            ) : (
              <span className="ms-3">
                <FormattedMessage id="groups.create.title" />
              </span>
            )}
          </h5>
        </Card.Header>

        <Card.Body>
          <Form>
            <FormInput
              type="text"
              label={intl.formatMessage({ id: 'groups.page.column.groupName' })}
              value={reducer?.name}
              setValue={e => {
                dispatchReducer({
                  type: GROUP_FIELDS.SET_NAME,
                  payload: e.target.value
                });
                dispatchReducer({
                  type: GROUP_FIELDS.SET_NAME_INVALID,
                  payload: false
                });
                dispatchReducer({
                  type: GROUP_FIELDS.SET_NAME_EXISTS,
                  payload: false
                });
              }}
              placeholder={intl.formatMessage({
                id: 'groups.page.placeholder.groupName'
              })}
              icon="comment"
              hint={intl.formatMessage({ id: 'groups.page.hint.groupName' })}
              errMsg={
                reducer.nameExists
                  ? intl.formatMessage({
                      id: 'groups.page.errMsg.groupName.taken'
                    }) //'Group name already taken'
                  : intl.formatMessage({
                      id: 'groups.page.errMsg.groupName.required'
                    }) //'Group name is required'
              }
              isInvalid={reducer?.nameInvalid}
            />
            <FormInput
              type="textarea"
              label={intl.formatMessage({
                id: 'groups.page.column.description'
              })}
              value={reducer?.description}
              setValue={e => {
                dispatchReducer({
                  type: GROUP_FIELDS.SET_DESCRIPTION,
                  payload: e.target.value
                });
                dispatchReducer({
                  type: GROUP_FIELDS.SET_DESCRIPTION_INVALID,
                  payload: false
                });
              }}
              placeholder={intl.formatMessage({
                id: 'groups.page.placeholder.description'
              })}
              icon="align-left"
              hint={intl.formatMessage({ id: 'groups.page.hint.description' })}
              errMsg="Description too long"
              isInvalid={reducer.description?.length > INPUT_DESC_MAX_LEN}
            />
            <FormInput
              type="multiselect"
              icon="users"
              label={intl.formatMessage({
                id: 'groups.page.column.groupMembers'
              })}
              options={reducer?.all_users.map(user => ({
                value: user.id,
                label: user.display_name
              }))}
              placeholder={intl.formatMessage({
                id: 'groups.page.placeholder.groupMembers'
              })}
              value={reducer?.selected_users}
              setValue={value => handleMembersChange(value)}
              form={allUsersRef}
            />
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
    </>
  );
};

export default GroupForm;
