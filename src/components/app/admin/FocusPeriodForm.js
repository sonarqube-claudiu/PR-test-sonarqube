import React from 'react';
import FormInput from '../kanban/FormInput';
import { INPUT_DESC_MAX_LEN } from 'models/Constants';
import { useReducer } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { FOCUS_PERIOD_FIELDS } from 'models/enums/FocusPeriodFields';
import { useDispatch } from 'react-redux';
import { Card, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createFocusPeriod,
  updateFocusPeriod
} from 'features/focusPeriodThunk';
import {
  setPreviousFocusPeriod,
  updateFocusPeriodLocally
} from 'features/focusPeriodSlice';
import { Utils } from 'models/Utils';
import { useEffect } from 'react';

const toDate = dateString => {
  return dateString ? new Date(dateString) : new Date();
};

const focusPeriodDispatcher = (state, action) => {
  switch (action.type) {
    case FOCUS_PERIOD_FIELDS.SET_TITLE:
      return {
        ...state,
        title: action.payload
      };
    case FOCUS_PERIOD_FIELDS.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload
      };
    case FOCUS_PERIOD_FIELDS.SET_START_DATE:
      return {
        ...state,
        start_date: action.payload
      };
    case FOCUS_PERIOD_FIELDS.SET_END_DATE:
      return {
        ...state,
        end_date: action.payload
      };
    case FOCUS_PERIOD_FIELDS.SET_TITLE_INVALID:
      return {
        ...state,
        titleInvalid: action.payload
      };
    default:
      return state;
  }
};

const getFocusPeriodReducerInitialState = focusPeriod => {
  if (focusPeriod) {
    return {
      title: focusPeriod?.title,
      description: focusPeriod?.description || '',
      start_date:
        focusPeriod?.start_date || ''
          ? toDate(focusPeriod.start_date)
          : new Date(),
      end_date: focusPeriod?.end_date
        ? toDate(focusPeriod.end_date)
        : new Date(),
      titleInvalid: false
    };
  } else {
    return {
      title: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      titleInvalid: false
    };
  }
};

const FocusPeriodForm = ({ edit }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token);

  const {focusPeriodId} = useParams();
  const focusPeriods = useSelector(state => state.focusperiod.focusPeriods);

  const focusPeriod = focusPeriods.filter(
    focusPeriod => focusPeriod.id === focusPeriodId
  )[0];

  const [reducer, dispatchReducer] = useReducer(
    focusPeriodDispatcher,
    getFocusPeriodReducerInitialState(edit ? focusPeriod : null)
  );

  const handleBack = () => {
    navigate('/admin/focus-periods');
  };

  const handleSubmit = () => {
    if (
      !(
        toDate(reducer.start_date).getTime() >
          toDate(reducer.end_date).getTime() ||
        reducer.description?.length > INPUT_DESC_MAX_LEN ||
        reducer.title?.length === 0
      )
    ) {
      if (reducer.title?.length === 0) {
        dispatchReducer({
          type: FOCUS_PERIOD_FIELDS.SET_TITLE_INVALID,
          payload: true
        });
      } else if (edit) {
        dispatch(
          setPreviousFocusPeriod(Utils.deepClone(focusPeriod))
        );
        dispatch(
          updateFocusPeriod(
            {
              ...focusPeriod,
              title: reducer.title,
              start_date: Utils.formatDateToYYYYMMDD(
                reducer.start_date,
                'yyyymmdd'
              ),
              end_date: Utils.formatDateToYYYYMMDD(
                reducer.end_date,
                'yyyymmdd'
              ),
              description: /^\s*$/.test(reducer.description)
                ? null
                : reducer.description
            },
            token
          )
        );
        dispatch(
          updateFocusPeriodLocally({
            ...focusPeriod,
            title: reducer.title,
            start_date: Utils.formatDateToYYYYMMDD(
              reducer.start_date,
              'yyyymmdd'
            ),
            end_date: Utils.formatDateToYYYYMMDD(
              reducer.end_date,
              'yyyymmdd'
            ),
            description: /^\s*$/.test(reducer.description)
              ? null
              : reducer.description
          })
        );
        handleBack();
      } else {
        dispatch(
          createFocusPeriod(
            {
              title: reducer.title,
              start_date: Utils.formatDateToYYYYMMDD(
                reducer.start_date,
                'yyyymmdd'
              ),
              end_date: Utils.formatDateToYYYYMMDD(
                reducer.end_date,
                'yyyymmdd'
              ),
              description: reducer.description,
              data_source_id: 0
            },
            token
          )
        );
        handleBack();
      }
    }
  }

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
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0 fs-0">
            {edit ? (
              <FormattedMessage id="focusPeriod.page.panel.updateCrt.title" />
            ) : (
              <FormattedMessage id="focusPeriod.page.panel.create.title" />
            )}
          </h5>
        </Card.Header>
        <Card.Body>
          <FormInput
            type="text"
            label={intl.formatMessage({ id: 'focusPeriod.page.title' })}
            value={reducer.title}
            setValue={e => {
              dispatchReducer({
                type: FOCUS_PERIOD_FIELDS.SET_TITLE,
                payload: e.target.value
              });
              dispatchReducer({
                type: FOCUS_PERIOD_FIELDS.SET_TITLE_INVALID,
                payload: false
              });
            }}
            placeholder={intl.formatMessage({
              id: 'focusPeriod.page.input.title.placeholder'
            })}
            icon={'comment'}
            hint={intl.formatMessage({
              id: 'focusPeriod.page.input.title.hint'
            })}
            errMsg={intl.formatMessage({
              id: 'focusPeriod.page.input.title.errMsg'
            })}
            isInvalid={reducer.titleInvalid}
          />
          <FormInput
            type="datepicker"
            label={`${intl.formatMessage({
              id: 'focusPeriod.page.startDate'
            })}`}
            selected={toDate(reducer.start_date)}
            setValue={date => {
              dispatchReducer({
                type: FOCUS_PERIOD_FIELDS.SET_START_DATE,
                payload: date
              });
            }}
            className="form-control"
            icon="clock"
            isInvalid={
              toDate(reducer.start_date).getTime() >
              toDate(reducer.end_date).getTime()
            }
            errMsg={intl.formatMessage({
              id: 'focusPeriod.page.input.startdate.errMsg'
            })}
            hint={`${intl.formatMessage({
              id: 'focusPeriod.page.input.startdate.hint'
            })}`}
          />
          <div>
            <FormInput
              type="datepicker"
              value={reducer.title}
              label={`${intl.formatMessage({
                id: 'focusPeriod.page.endDate'
              })}`}
              selected={toDate(reducer.end_date)}
              setValue={date => {
                dispatchReducer({
                  type: FOCUS_PERIOD_FIELDS.SET_END_DATE,
                  payload: date
                });
              }}
              className="form-control"
              icon="clock"
              isInvalid={
                toDate(reducer.start_date).getTime() >
                toDate(reducer.end_date).getTime()
              }
              errMsg={intl.formatMessage({
                id: 'focusPeriod.page.input.enddate.errMsg'
              })}
              hint={`${intl.formatMessage({
                id: 'focusPeriod.page.input.enddate.hint'
              })}`}
            />
            <FormInput
              type="textarea"
              value={reducer.description}
              icon={'align-left'}
              setValue={e =>
                dispatchReducer({
                  type: FOCUS_PERIOD_FIELDS.SET_DESCRIPTION,
                  payload: e.target.value
                })
              }
              label={intl.formatMessage({
                id: 'focusPeriod.page.desc'
              })}
              placeholder={intl.formatMessage({
                id: 'focusPeriod.page.input.description.placeholder'
              })}
              rows={5}
              className=" "
              isInvalid={reducer.description?.length > INPUT_DESC_MAX_LEN}
              errMsg={intl.formatMessage({
                id: 'addIssue.modal.input.description.error'
              })}
              hint={intl.formatMessage({
                id: 'focusPeriod.page.input.desc.hint'
              })}
            />
          </div>
          <div className="mt-3 d-flex justify-content-around">
            <Button
              size="m"
              variant="falcon-default"
              className="bg-primary w-100"
              type="button"
              onClick={
                handleSubmit
              }
            >
              {edit ? (
                <FormattedMessage id={'focusPeriod.page.btn.update'} />
              ) : (
                <FormattedMessage id={'focusPeriod.page.btn.add'} />
              )}
            </Button>
            <Button
              size="m"
              variant="falcon-default"
              type="button"
              className="bg-danger w-100 ms-3"
              onClick={handleBack}
            >
              <FormattedMessage id="addIssue.modal.btn.cancel" />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default FocusPeriodForm;
