import classNames from 'classnames';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import FormInput from './FormInput';
import ISSUE_ACTION from 'models/enums/IssueAction';
import FormView from './FormView';
import { getItemFromStore } from 'helpers/utils';
import { settings } from 'config';
import ModalSidebar from './ModalSidebar';
import { ISSUE_ACTIVITY_TYPE } from 'models/enums/IssueActivityType';
import { ISSUE_MODAL_ACTIONS } from 'models/enums/IssueModalActions';
import IssueHistoryTimeline from './IssueHistoryTimeline';
import { Utils } from 'models/Utils';
import {
  INPUT_COMMENT_MAX_LEN,
  INPUT_DESC_MAX_LEN,
  INPUT_NOTES_MAX_LEN,
  INPUT_SUBJECT_MAX_LEN,
  RATIO_ARRAY
} from 'models/Constants';
import { useManageIssueModal } from 'hooks/useManageIssueModal';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { BsHourglassBottom, BsHourglassTop } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IssueModal = ({ status }) => {
  const {
    issueToBeUpdated,
    issueModalAction,
    activeIssue,
    userName,
    members,
    sprints,
    reducer,
    formRef,
    subjectRef,
    commentRef,
    notesRef,
    spentTimeRef,
    dispatchReducer,
    handleFormReset,
    handleSubmit,
    handleStatusChange
  } = useManageIssueModal(status);

  const intl = useIntl();

  return (
    <>
      <Row
        className={classNames('rounded-3 transition-none', 'm-3', 'scrollbar')}
      >
        <Col
          xl={
            issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
            issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS ||
            issueModalAction === ISSUE_ACTION.US_CREATE
              ? 12
              : 10
          }
          lg={
            issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
            issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS ||
            issueModalAction === ISSUE_ACTION.US_CREATE
              ? 12
              : 9
          }
          className="p-0"
        >
          <Form
            onSubmit={handleSubmit}
            ref={formRef}
            className="flex-grow-1 bg-light p-3 h-100"
          >
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'hashtag'}
                className={'text-primary'}
                value={`#${issueToBeUpdated?.id}`}
                label={intl.formatMessage({ id: 'addIssue.modal.label.id' })}
              />
            )}
            {status !== 'user-stories' &&
              (issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
                issueModalAction === ISSUE_ACTION.ISSUE_EDIT) && (
                <Col lg={6}>
                  <FormInput
                    type="select"
                    icon={'tag'}
                    value={`issue.label.${Utils.toCamelCase(
                      Object.entries(ISSUE_TRACKER)?.find(
                        ([key, value]) => value === reducer.tracker
                      )
                        ? Object.entries(ISSUE_TRACKER)?.find(
                            ([key, value]) => value === reducer.tracker
                          )[0]
                        : ''
                    )}`}
                    setValue={e =>
                      dispatchReducer({
                        type: ISSUE_MODAL_ACTIONS.SET_TRACKER,
                        payload:
                          ISSUE_TRACKER[
                            e.target.value
                              ? Utils.fromCamelCaseToWords(
                                  e.target.value.split('.')[2]
                                )
                                  .toUpperCase()
                                  .replace(/\s/g, '_')
                              : ''
                          ]
                      })
                    }
                    label={intl.formatMessage({
                      id: 'addIssue.modal.label.tracker'
                    })}
                    className={`w-100`}
                    options={Object.keys(ISSUE_TRACKER)
                      .filter(k => !k.toString().includes('USER'))
                      .map(k => `issue.label.${Utils.toCamelCase(k)}`)}
                    hint={intl.formatMessage({
                      id: 'addIssue.modal.input.tracker.hint'
                    })}
                    needsTranslation={true}
                  ></FormInput>
                </Col>
              )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'badge'}
                icon={'tag'}
                value={
                  issueToBeUpdated
                    ? Utils.getItemLabel(issueToBeUpdated?.issue_type_id)
                    : Utils.getItemLabel(null)
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.tracker'
                })}
              />
            )}

            {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <FormInput
                type="textarea"
                icon={'comment'}
                value={reducer.subject}
                setValue={e => {
                  if (e.target.value.length <= INPUT_SUBJECT_MAX_LEN) {
                    dispatchReducer({
                      type: ISSUE_MODAL_ACTIONS.SET_SUBJECT,
                      payload: e.target.value
                    });
                    // dispatchReducer({type: ISSUE_ACTIONS.SET_SUBJECT_LEN, payload: e.target.value.length})
                  }
                }}
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.subject'
                })}
                placeholder={intl.formatMessage({
                  id: 'addIssue.modal.placeholder.subject'
                })}
                isInvalid={reducer.subjectInvalid}
                inputRef={subjectRef}
                rows={2}
                className={' '}
                hint={`${intl.formatMessage({
                  id: 'addIssue.modal.input.subject.hint'
                })}`} //(${reducer.subjectLen}/${INPUT_SUBJECT_MAX_LEN})
                errMsg={intl.formatMessage({
                  id: 'addIssue.modal.input.subject.error'
                })}
              ></FormInput>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'comment'}
                value={reducer.subject}
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.subject'
                })}
              />
            )}

            {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <Col lg={6}>
                <FormInput
                  type="select"
                  value={reducer.assignee}
                  icon={'user'}
                  setValue={e =>
                    dispatchReducer({
                      type: ISSUE_MODAL_ACTIONS.SET_ASSIGNEE,
                      payload: e.target.value
                    })
                  }
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.assignee'
                  })}
                  className={'w-100'}
                  options={[
                    ...members.map(member => member?.user.display_name)
                  ]}
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.assginee.hint'
                  })}
                  needsTranslation={false}
                ></FormInput>
              </Col>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'user'}
                value={reducer.assignee}
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.assignee'
                })}
              />
            )}

            {status !== 'user-stories' &&
              (issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
                issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
                issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS) && (
                <FormInput
                  type="radiobtngroup"
                  icon={'tag'}
                  value={`addIssue.modal.input.issueStatus.${Utils.toCamelCase(
                    Object.entries(ISSUE_STATUS)?.find(
                      ([key, value]) => value === reducer.issueStatus
                    )
                      ? Object.entries(ISSUE_STATUS)?.find(
                          ([key, value]) => value === reducer.issueStatus
                        )[0]
                      : 'new'
                  )}`}
                  setValue={val => handleStatusChange(val)}
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.issueStatus'
                  })}
                  options={Object.keys(ISSUE_STATUS).map(
                    k =>
                      `addIssue.modal.input.issueStatus.${Utils.toCamelCase(k)}`
                  )}
                  // optionDisabled={activeIssue ? true : false}
                  optionclassname={`border-0 shadow-none`}
                  optionStyles={{
                    'addIssue.modal.input.issueStatus.new': `btn-${
                      getItemFromStore('isDark', settings.isDark)
                        ? 'dark'
                        : 'light'
                    }-new`,
                    'addIssue.modal.input.issueStatus.inProgress': `btn-${
                      getItemFromStore('isDark', settings.isDark)
                        ? 'dark'
                        : 'light'
                    }-inProgress`,
                    'addIssue.modal.input.issueStatus.onHold': `btn-${
                      getItemFromStore('isDark', settings.isDark)
                        ? 'dark'
                        : 'light'
                    }-onHold`,
                    'addIssue.modal.input.issueStatus.resolved': `btn-${
                      getItemFromStore('isDark', settings.isDark)
                        ? 'dark'
                        : 'light'
                    }-resolved`
                  }}
                  className="d-flex w-100 flex-wrap bg-transparent border-0"
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.issueStatus.hint'
                  })}
                ></FormInput>
              )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'tag'}
                needsTranslation={true}
                value={`addIssue.modal.input.issueStatus.${Utils.toCamelCase(
                  Object.entries(ISSUE_STATUS)?.find(
                    ([key, value]) => value === reducer.issueStatus
                  )
                    ? Object.entries(ISSUE_STATUS)?.find(
                        ([key, value]) => value === reducer.issueStatus
                      )[0]
                    : 'new'
                )}`}
                className={'text-primary'}
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.issueStatus'
                })}
              />
            )}

            {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <FormInput
                type="textarea"
                value={reducer.description}
                icon={'align-left'}
                setValue={e =>
                  e.target.value.length <= INPUT_DESC_MAX_LEN
                    ? dispatchReducer({
                        type: ISSUE_MODAL_ACTIONS.SET_DESCRIPTION,
                        payload: e.target.value
                      })
                    : null
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.description'
                })}
                placeholder={intl.formatMessage({
                  id: 'addIssue.modal.placeholder.description'
                })}
                rows={5}
                className=" "
                hint={intl.formatMessage({
                  id: 'addIssue.modal.input.description.hint'
                })}
                isInvalid={reducer.descriptionInvalid}
                errMsg={intl.formatMessage({
                  id: 'addIssue.modal.input.description.error'
                })}
              ></FormInput>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'align-left'}
                value={
                  reducer.description?.length > 0 ? reducer.description : 'N/A'
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.description'
                })}
              />
            )}

            {(issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <FormInput
                type="select"
                icon={['far', 'clock']}
                value={reducer.sprint}
                setValue={e =>
                  dispatchReducer({
                    type: ISSUE_MODAL_ACTIONS.SET_SPRINT,
                    payload: e.target.value
                  })
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.sprint'
                })}
                className={`w-100`}
                options={sprints}
                needsTranslation={false}
              ></FormInput>
            )}

            {issueModalAction === ISSUE_ACTION.US_VIEW  && (
              <FormView
                type="text"
                icon={['far', 'clock']}
                value={reducer.sprint}
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.sprint'
                })}
                className={`w-100`}
                needsTranslation={false}
              ></FormView>
            )}

            {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <Col lg={6} className="p-0">
                <FormInput
                  type="timepicker"
                  icon={['far', 'clock']}
                  hours={reducer.estimatedHours}
                  minutes={reducer.estimatedMinutes}
                  setHours={e =>
                    dispatchReducer({
                      type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_HOURS,
                      payload: e.target.value
                    })
                  }
                  setMinutes={e =>
                    dispatchReducer({
                      type: ISSUE_MODAL_ACTIONS.SET_ESTIMATED_MINUTES,
                      payload: e.target.value
                    })
                  }
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.estimatedTime'
                  })}
                  className="w-100 d-flex flex-row gap-1"
                  inputRef={spentTimeRef}
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.estimatedTime.hint'
                  })}
                  errMsg={`${intl.formatMessage({
                    id: 'addIssue.modal.input.estimatedTime.error'
                  })}`}
                ></FormInput>
              </Col>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={['far', 'clock']}
                value={
                  reducer.estimatedHours !== '' ||
                  reducer.estimatedMinutes !== ''
                    ? `${reducer.estimatedHours}h ${reducer.estimatedMinutes}m`
                    : 'N/A'
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.estimatedTime'
                })}
              />
            )}

            {((issueModalAction === ISSUE_ACTION.ISSUE_CREATE &&
              reducer.issueStatus !== ISSUE_STATUS.NEW) ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS) && (
              <Col lg={6} className="p-0">
                <FormInput
                  type="select"
                  value={reducer.doneRatio}
                  icon={'percentage'}
                  setValue={e =>
                    dispatchReducer({
                      type: ISSUE_MODAL_ACTIONS.SET_DONE_RATIO,
                      payload: e.target.value
                    })
                  }
                  className="w-100"
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.doneRatio'
                  })}
                  options={RATIO_ARRAY.map(ratio => `${ratio}%`)}
                  // inputDisabled={issueStatus === ISSUE_STATUSES['New']}
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.doneRatio.hint'
                  })}
                  needsTranslation={false}
                ></FormInput>
              </Col>
            )}
            {issueModalAction === ISSUE_ACTION.ISSUE_VIEW && (
              <Col lg={6}>
                <FormView
                  type={'progress'}
                  className={'w-100'}
                  icon={'percentage'}
                  value={issueToBeUpdated?.done_ratio
                    .toString()
                    .replace('%', '')}
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.doneRatio'
                  })}
                />
              </Col>
            )}

            {(issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
              issueModalAction === ISSUE_ACTION.US_VIEW) && (
              <FormView
                type={'text'}
                icon={'clock'}
                value={
                  issueToBeUpdated?.spent_time
                    ? `${
                        Utils.convertToHoursAndMinutes(
                          issueToBeUpdated?.spent_time
                        ).hours
                      }h ${
                        Utils.convertToHoursAndMinutes(
                          issueToBeUpdated?.spent_time
                        ).minutes
                      }m`
                    : 'N/A'
                }
                label={intl.formatMessage({
                  id: 'addIssue.modal.label.spentTime'
                })}
              />
            )}

            {((issueModalAction === ISSUE_ACTION.ISSUE_CREATE &&
              reducer.issueStatus !== ISSUE_STATUS.NEW) ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS) && (
              <>
                {' '}
                <Row className="m-0">
                  <Col lg={6} className="p-0">
                    <FormInput
                      type="timepicker"
                      icon={'clock'}
                      hours={reducer.spentHours}
                      minutes={reducer.spentMinutes}
                      setHours={e =>
                        dispatchReducer({
                          type: ISSUE_MODAL_ACTIONS.SET_SPENT_HOURS,
                          payload: e.target.value
                        })
                      }
                      setMinutes={e =>
                        dispatchReducer({
                          type: ISSUE_MODAL_ACTIONS.SET_SPENT_MINUTES,
                          payload: e.target.value
                        })
                      }
                      label={intl.formatMessage({
                        id: 'addIssue.modal.label.spentTime'
                      })}
                      className="w-100 d-flex flex-row gap-1"
                      isInvalid={reducer.spentTimeInvalid}
                      inputRef={spentTimeRef}
                      hint={intl.formatMessage({
                        id: 'addIssue.modal.input.spentTime.hint'
                      })}
                      errMsg={`${intl.formatMessage({
                        id: 'addIssue.modal.input.spentTime.error'
                      })}`}
                    ></FormInput>
                  </Col>
                  <Col lg={6} className="p-0">
                    {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
                      issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
                      issueModalAction ===
                        ISSUE_ACTION.ISSUE_UPDATE_STATUS) && (
                      <FormInput
                        type="select"
                        value={reducer.activityType}
                        icon={'wrench'}
                        setValue={e =>
                          dispatchReducer({
                            type: ISSUE_MODAL_ACTIONS.SET_ACTIVITY_TYPE,
                            payload: e.target.value
                          })
                        }
                        label={intl.formatMessage({
                          id: 'addIssue.modal.label.activity'
                        })}
                        className={'w-100 m-0'}
                        options={Object.keys(ISSUE_ACTIVITY_TYPE)}
                        hint={intl.formatMessage({
                          id: 'addIssue.modal.input.activity.hint'
                        })}
                        needsTranslation={false}
                      ></FormInput>
                    )}
                  </Col>
                </Row>
                <FormInput
                  type="text"
                  value={reducer.comment}
                  icon={'comment'}
                  setValue={e =>
                    e.target.value.length <= INPUT_COMMENT_MAX_LEN
                      ? dispatchReducer({
                          type: ISSUE_MODAL_ACTIONS.SET_COMMENT,
                          payload: e.target.value
                        })
                      : null
                  }
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.comment'
                  })}
                  isInvalid={reducer.commentInvalid}
                  inputRef={commentRef}
                  className={' '}
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.comment.hint'
                  })}
                  errMsg={`${intl.formatMessage({
                    id: 'addIssue.modal.input.comment.error'
                  })}`}
                ></FormInput>
                <FormInput
                  type="textarea"
                  className=" "
                  value={reducer.notes}
                  icon={'align-left'}
                  setValue={e =>
                    e.target.value.length <= INPUT_NOTES_MAX_LEN
                      ? dispatchReducer({
                          type: ISSUE_MODAL_ACTIONS.SET_NOTES,
                          payload: e.target.value
                        })
                      : null
                  }
                  rows={5}
                  isInvalid={reducer.notesInvalid}
                  inputRef={notesRef}
                  label={intl.formatMessage({
                    id: 'addIssue.modal.label.notes'
                  })}
                  hint={intl.formatMessage({
                    id: 'addIssue.modal.input.notes.hint'
                  })}
                  errMsg={`${intl.formatMessage({
                    id: 'addIssue.modal.input.notes.error'
                  })}`}
                ></FormInput>
              </>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_CREATE ||
              issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
              issueModalAction === ISSUE_ACTION.ISSUE_UPDATE_STATUS ||
              issueModalAction === ISSUE_ACTION.US_CREATE ||
              issueModalAction === ISSUE_ACTION.US_EDIT) && (
              <Row className="gx-2">
                <Col>
                  <Button
                    variant="primary"
                    size="sm"
                    className="d-block w-100"
                    type="submit"
                  >
                    <FormattedMessage
                      id={
                        issueToBeUpdated
                          ? 'addIssue.modal.btn.update'
                          : 'addIssue.modal.btn.add'
                      }
                    />
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="sm"
                    className="d-block w-100 border-400 btn-danger"
                    type="button"
                    onClick={e => handleFormReset(e)}
                  >
                    <FormattedMessage id="addIssue.modal.btn.cancel" />
                  </Button>
                </Col>
              </Row>
            )}
            {(issueModalAction === ISSUE_ACTION.ISSUE_HISTORY ||
              issueModalAction === ISSUE_ACTION.US_HISTORY) && (
              <IssueHistoryTimeline />
            )}
          </Form>
        </Col>
        <Col xl={2} lg={3} className="p-0 m-0">
          {(issueModalAction === ISSUE_ACTION.ISSUE_EDIT ||
            issueModalAction === ISSUE_ACTION.ISSUE_VIEW ||
            issueModalAction === ISSUE_ACTION.ISSUE_HISTORY) && (
            <div className="bg-light rounded-3 pb-2 ms-3 h-100">
              <ModalSidebar />
            </div>
          )}
          {(issueModalAction === ISSUE_ACTION.US_VIEW ||
            issueModalAction === ISSUE_ACTION.US_EDIT ||
            issueModalAction === ISSUE_ACTION.US_HISTORY) && (
            <div className="bg-light rounded-3 pb-2 ms-3 h-100">
              <ModalSidebar story={true} />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

IssueModal.propTypes = {
  onSubmit: PropTypes.func,
  type: PropTypes.string
};

export default IssueModal;
