import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBarReact from 'simplebar-react';
import IconButton from 'components/common/IconButton';
import { Utils } from 'models/Utils';
import {
  deleteFocusPeriodLocally,
  setFocusPeriod,
  setFocusPeriodAction,
  setFocusPeriodEdit,
  setPreviousFocusPeriod
} from 'features/focusPeriodSlice';
// import FOCUS_PERIOD_ACTION from 'models/enums/FocusPeriodAction';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { setOpenWarningModalWith, setWarningModalShow } from 'features/modalSlice';
import { deleteFocusPeriod } from 'features/focusPeriodThunk';

const Activity = ({
  activity,
  isLast,
  icon,
  status
}) => {
  const dispatch = useDispatch();
  const focusPeriods = useSelector(state => state.focusperiod.focusPeriods);
  const token = useSelector(state => state.user.token);

  const handleDelete = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'modal.focusPeriod.delete.title',
        message: 'modal.focusPeriod.delete.message',
        onConfirm: () => {
          dispatch(
            setPreviousFocusPeriod(
              Utils.deepClone(focusPeriods)
            )
          );
          dispatch(deleteFocusPeriod(activity.id, token));
          dispatch(deleteFocusPeriodLocally(activity.id));
          dispatch(setWarningModalShow(false));
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  return (
    <Row
      className={classNames(
        'g-3 recent-activity-timeline recent-activity-timeline-primary',
        {
          'pb-x1': !isLast,
          'recent-activity-timeline-past': status === 'completed',
          'recent-activity-timeline-current': status === 'current'
        }
      )}
    >
      <Col xs="auto" className="ps-4 ms-2">
        <div className="ps-2">
          <div className="icon-item icon-item-sm rounded-circle bg-200 shadow-none">
            <FontAwesomeIcon icon={icon} className="text-primary" />
          </div>
        </div>
      </Col>
      <Col>
        <Row className={classNames('g-3', { 'border-bottom pb-x1': !isLast })}>
          <Col>
            <h6 className="text-800 mb-1">{activity?.title}</h6>
            <p className="fs--1 text-600 mb-0">
              <FormattedMessage id="focusPeriod.page.startDate"/>: <b>{activity?.start_date}</b>
            </p>
            <p className="fs--1 text-600 mb-2">
            <FormattedMessage id="focusPeriod.page.endDate"/>: <b>{activity?.end_date}</b>
            </p>
            <p className="fs--1 mb-0"><FormattedMessage id="focusPeriod.page.desc"/>: {activity?.description}</p>
          </Col>
          <Col xs="auto">
            <div className='d-grid'>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="edit"
              transform="shrink-3"
              className='mb-3 ms-3'
              onClick={() => {
                dispatch(setFocusPeriodEdit(activity));
                // dispatch(setFocusPeriodAction(FOCUS_PERIOD_ACTION.EDIT));
              }}
            >
              <FormattedMessage id="addIssue.modal.btn.edit" />
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
                  {/* <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1"> */}
                    <FormattedMessage id="btn.delete" />
                  {/* </span> */}
                </IconButton>
                </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const RecentActivity = ({ data, title, icon, status }) => {
  const today = Utils.formatDateToYYYYMMDD(new Date(), 'yyyymmdd');
  return (
    <Card className="h-100 recent-activity-card">
      <FalconCardHeader title={title} titleTag="h6" />
      <SimpleBarReact style={{ height: '40rem' }}>
        <Card.Body className="ps-2 recent-activity-body-height">
          {data.map((activity, index) => (
           activity?.id && (<Activity
              key={index}
              activity={activity}
              isLast={index === data.length - 1}
              icon={icon}
              status={
                activity?.start_date <= today && activity?.end_date >= today
                  ? 'current'
                  : activity?.end_date < today
                  ? 'completed'
                  : 'false'
              }
            />)
          ))}
        </Card.Body>
      </SimpleBarReact>
    </Card>
  );
};

Activity.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string
    // icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    // time: PropTypes.string.isRequired,
    // status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired
  }),
  isLast: PropTypes.bool
};

RecentActivity.propTypes = {
  data: PropTypes.arrayOf(Activity.propTypes.activity)
};

export default RecentActivity;
