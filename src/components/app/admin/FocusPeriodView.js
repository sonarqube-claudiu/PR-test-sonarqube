import React, { useEffect } from 'react';
import {
  Card,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  deleteFocusPeriodLocally,
  setFocusPeriodsPerPage,
  setPreviousFocusPeriod,
} from 'features/focusPeriodSlice';
import IconButton from 'components/common/IconButton';
import {
  deleteFocusPeriod,
  getAllFocusPeriods,
} from 'features/focusPeriodThunk';
import FormView from '../kanban/FormView';
import { Utils } from 'models/Utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import {
  setOpenWarningModalWith,
  setWarningModalShow
} from 'features/modalSlice';

const FocusPeriodView = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const {focusPeriodId} = useParams();

  const token = useSelector(state => state.user.token);

  const focusPeriods = useSelector(state => state.focusperiod.focusPeriods);
  const focusPeriod = focusPeriods.filter(focusPeriod => focusPeriod.id === focusPeriodId)[0];

  useEffect(() => {
    dispatch(getAllFocusPeriods(token));
  }, []);

  const handleDelete = () => {
    dispatch(
      setOpenWarningModalWith({
        title: 'modal.focusPeriod.delete.title',
        message: 'modal.focusPeriod.delete.message',
        onConfirm: () => {
          dispatch(setPreviousFocusPeriod(Utils.deepClone(focusPeriods)));
          dispatch(deleteFocusPeriod(focusPeriod.id, token));
          dispatch(deleteFocusPeriodLocally(focusPeriod.id));
          dispatch(setWarningModalShow(false));
          handleBack();
        },
        onCancel: () => {
          dispatch(setWarningModalShow(false));
        }
      })
    );
  };

  const handleEdit = () => {
    navigate(`/admin/focus-periods/edit/${focusPeriod.id}`);
  }

  const handleBack = () => {
    navigate('/admin/focus-periods');
  };

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
      <Card className="mb-3" md={6}>
        <Card.Body className="bg-light d-flex justify-content-between">
          <h4 className="mb-0">
            {focusPeriod?.title}
          </h4>
          <div>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="edit"
              transform="shrink-3"
              onClick={handleEdit}
              className="me-3"
            >
              <span>
                <FormattedMessage id="addIssue.modal.btn.edit" />
              </span>
            </IconButton>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="trash"
              transform="shrink-3"
              onClick={handleDelete}
            >
              <span>
                <FormattedMessage id="btn.delete" />
              </span>
            </IconButton>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body className="p-4">
          <div className="d-grid">
            <FormView
              type={'text'}
              icon={'comment'}
              value={focusPeriod.title}
              label={intl.formatMessage({
                id: 'focusPeriod.page.title'
              })}
            />
            <FormView
              type={'text'}
              icon={['far', 'clock']}
              value={Utils.formatDateToYYYYMMDD(
                focusPeriod.start_date,
                'ddmmyyyy'
              )}
              label={intl.formatMessage({
                id: 'focusPeriod.page.startDate'
              })}
            />
            <FormView
              type={'text'}
              icon={['far', 'clock']}
              value={Utils.formatDateToYYYYMMDD(
                focusPeriod.end_date,
                'ddmmyyyy'
              )}
              label={intl.formatMessage({
                id: 'focusPeriod.page.endDate'
              })}
            />
            <FormView
              type={'text'}
              icon={'align-left'}
              value={
                focusPeriod.description
                  ? focusPeriod.description
                  : intl.formatMessage({
                      id: 'focusPeriod.page.noDescription'
                    }) //'No description available...'
              }
              label={intl.formatMessage({
                id: 'focusPeriod.page.desc'
              })}
            />
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default FocusPeriodView;
