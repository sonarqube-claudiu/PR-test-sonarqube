import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
import SoftBadge from 'components/common/SoftBadge';
import { Utils } from 'models/Utils';
import React from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

export const ProjectHistoryTimeline = ({ journals }) => {
  const intl = useIntl();
  return (
    <Card className='m-2'>
      <Card.Body>
        <div className="timeline-vertical">
          {journals &&
            journals?.length !== 0 &&
            [...journals].reverse()?.map((item, index) => {
              const { notes, created_on, details, activity } = item;
              const { id: activityTranslationId, icon: activityIcon } =
                Utils.getJournalActivityTranslation(activity?.type);
              return (
                <div
                  key={index}
                  className={classNames('timeline-item', {
                    'timeline-item-start': index % 2 === 0,
                    'timeline-item-end': index % 2 !== 0
                  })}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip style={{ position: 'fixed' }}>
                        <FormattedMessage id={activityTranslationId} />
                      </Tooltip>
                    }
                  >
                    <div className="timeline-icon icon-item icon-item-lg text-primary border-300">
                      <FontAwesomeIcon icon={activityIcon} className="fs-1" />
                    </div>
                  </OverlayTrigger>

                  <Row
                    className={` ${
                      index % 2 == 0
                        ? 'timeline-item-start'
                        : 'timeline-item-end'
                    }`}
                  >
                    <Col className="timeline-item-time">
                      <div>
                        <h6 className="mb-0 text-700">
                          {' '}
                          {+created_on && new Date(+created_on).toDateString()}
                        </h6>
                        {/* <p className="fs--2 text-500 font-sans-serif">{day}</p> */}
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="timeline-item-content arrow-bg-white">
                        <div className="timeline-item-card bg-white dark__bg-1100 text-break">
                          {/* <Link to="/support-desk/tickets-preview"> */}
                          {notes && notes !== '' && (
                            <h5 className="mb-2">{notes}</h5>
                          )}
                          {/* </Link> */}
                          {details &&
                            details?.length > 0 &&
                            details?.map((detail, index) => {
                              const { prop_key, property, old_value, value } =
                                detail;
                              const { icon, id } =
                                Utils.getJournalDetailKeyTranslation(
                                  prop_key,
                                  property
                                );
                              const {
                                old_value: translated_old_value,
                                new_value: translated_new_value,
                                old_value_color,
                                new_value_color
                              } = Utils.getJournalDetailKeyValueTranslation(
                                prop_key,
                                old_value,
                                value
                              );
                              return (
                                <div
                                  className="border-bottom mb-3 pb-4 text-600 fs--1"
                                  key={index}
                                >
                                  <FontAwesomeIcon
                                    icon={icon}
                                    className="me-2 text-primary"
                                  />
                                  {id && <FormattedMessage id={id} />}{' '}
                                  {prop_key !== 'member' && (
                                    <>
                                      <FormattedMessage id="history.from" />
                                      <SoftBadge
                                        className="mx-1 text-wrap text-break"
                                        bg={old_value_color}
                                      >
                                        {translated_old_value}
                                      </SoftBadge>
                                      <FormattedMessage id="history.to" />
                                    </>
                                  )}
                                  <SoftBadge
                                    className="mx-1 text-wrap text-break"
                                    bg={new_value_color}
                                  >
                                    {translated_new_value}
                                  </SoftBadge>
                                </div>
                              );
                            })}
                          {/* <p className="border-bottom mb-3 pb-4 text-600 fs--1">
                          {`${prop_key} => from ${old_value} to ${value}`}
                        </p> */}
                          <Flex wrap="wrap" className="pt-2">
                            <h6 className="mb-0 text-600 lh-base">
                              <FontAwesomeIcon
                                icon={['far', 'clock']}
                                className="me-1"
                              />
                              {+created_on &&
                                new Date(+created_on).toLocaleTimeString()}
                            </h6>
                            {/* <Flex
                            alignItems="center"
                            className="ms-auto me-2 me-sm-x1 me-xl-2 me-xxl-x1"
                          >
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip style={{ position: 'fixed' }}>
                                  {priority.text}
                                </Tooltip>
                              }
                            >
                              <div
                                className={`dot me-0 me-sm-2 me-xl-0 me-xxl-2 bg-${priority.color}`}
                              ></div>
                            </OverlayTrigger>
                            <h6 className="mb-0 text-700 d-none d-sm-block d-xl-none d-xxl-block">
                              {priority.text}
                            </h6>
                          </Flex>
                          <SubtleBadge bg={status.type}>
                            {status.content}
                          </SubtleBadge> */}
                          </Flex>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
      </Card.Body>
    </Card>
  );
};
