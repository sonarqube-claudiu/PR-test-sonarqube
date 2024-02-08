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
import Member from '../projects/Member';
import ProjectMembers from '../projects/ProjectMembers';
import { deleteGroup } from 'features/groupThunk';
import { deleteGroupLocally, setPreviousGroups } from 'features/groupSlice';
import { Utils } from 'models/Utils';
import { useEffect } from 'react';

const GroupView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();
  const user = useSelector(state => state.user);
  const groups = useSelector(state => state.groups.groups);
  const previousGroups = useSelector(state => state.groups.previousGroups);
  const group = Object.values(groups || []).find(group => group.id === groupId);

  const handleEdit = () => {
    if (!group) return;
    navigate(`/admin/groups/edit/${group?.id}`);
  };

  const handleDelete = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'modal.group.delete.title',
        message: 'modal.group.delete.message',
        onConfirm: () => {
          dispatch(setPreviousGroups(Utils.deepClone(groups)));
          dispatch(deleteGroup(group.id, user.token));
          dispatch(deleteGroupLocally(group.id));
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


  useEffect(()=> {
    console.log('previousGroups', previousGroups)
  },[previousGroups])
  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip style={{ position: 'fixed' }}>
            <FormattedMessage id="btn.back" />
          </Tooltip>
        }
      >
        <button
          onClick={handleBack}
          className="btn text-dark btn-light btn-sm shadow-none fs-4 rounded-circle pb-0 pt-0 ps-3 pe-3"
        >{`<`}</button>
      </OverlayTrigger>
      <Card className='mb-3'>
        <Card.Body>
          <Row>
            <Col lg={10}>
              <h4 className="mb-4">{group?.name}</h4>
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
        </Card.Body>
      </Card>
      <Row className='g-3'>
        <Col>
          <Card>
            <Card.Body>
              <Row className="g-3">
                <Col lg={9}>
                  <FormView
                    type={'text'}
                    icon={'comment'}
                    value={group?.name}
                    label={intl.formatMessage({
                      id: 'groups.page.column.groupName'
                    })}
                  />
                  <FormView
                    type={'text'}
                    icon={'align-left'}
                    value={
                      group?.description ||
                      intl.formatMessage({
                        id: 'groups.page.column.noDescription'
                      })
                    }
                    label={intl.formatMessage({
                      id: 'groups.page.column.description'
                    })}
                  />
                  <FormView
                    type={'text'}
                    icon={'align-left'}
                    value={
                      group?.focusperiod_id ||
                      intl.formatMessage({
                        id: 'groups.page.column.noFocusPeriod'
                      })
                    }
                    label={intl.formatMessage({
                      id: 'groups.page.column.focusPeriod'
                    })}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <ProjectMembers
            totalMembers={group?.group_members?.length || 0}
            members={group?.group_members || []}
            title={intl.formatMessage({
              id: 'group.details.page.members'
            })}
          />
        </Col>
      </Row>
    </>
  );
};

export default GroupView;
