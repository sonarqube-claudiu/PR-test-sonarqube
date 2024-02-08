import React from 'react';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import SoftBadge from 'components/common/SoftBadge';
import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import IconButton from 'components/common/IconButton';
import { useDispatch } from 'react-redux';
import { setActiveProject } from 'features/projectsSlice';
import { Utils } from 'models/Utils';

const PrioritySelect = ({ title, color, data, className, style }) => {
  return (
    <div
      style={style}
      className={classNames('d-flex align-items-center gap-2', className)}
    >
      <div style={{ '--falcon-circle-progress-bar': data }}>
        <svg
          className="circle-progress-svg"
          width="26"
          height="26"
          viewBox="0 0 120 120"
        >
          <circle
            className="progress-bar-rail"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeLinecap="round"
            strokeWidth="12"
          ></circle>
          <circle
            className="progress-bar-top"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeLinecap="round"
            stroke={color}
            strokeWidth="12"
          ></circle>
        </svg>
      </div>
      <h6 className="mb-0 text-700">{title}</h6>
    </div>
  );
};

PrioritySelect.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  data: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

const AgentSelect = ({ agent, className, style }) => {
  return (
    <Form.Select
      style={style}
      className={className}
      size="sm"
      defaultValue={agent}
    >
      {['Select Agent', 'Anindya', 'Nowrin', 'Khalid'].map(item => (
        <option key={item}>{item}</option>
      ))}
    </Form.Select>
  );
};
  
AgentSelect.propTypes = {
  agent: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export const columns = [
  {
    accessor: 'name',
    Header: 'Client',
    headerProps: { className: 'ps-2', style: { height: '46px' } },
    cellProps: {
      className: 'py-2 white-space-nowrap pe-3 pe-xxl-4 ps-2'
    },
    Cell: rowData => {
      const { name, avatar } = rowData.row.original;
      return (
        <Flex alignItems="center" className="position-relative py-1">
          {avatar.img ? (
            <Avatar src={avatar.img} size="xl" className="me-2" />
          ) : (
            <Avatar size="xl" name={avatar.name} className="me-2" />
          )}
          <h6 className="mb-0">
            <Link
              to="/support-desk/contact-details"
              className="stretched-link text-900"
            >
              {name}
            </Link>
          </h6>
        </Flex>
      );
    }
  },
  {
    accessor: 'subject',
    Header: 'Subject',
    headerProps: { style: { minWidth: '14.625rem' } },
    cellProps: {
      className: 'py-2 pe-4'
    },
    Cell: rowData => {
      const { subject } = rowData.row.original;
      return (
        <Link to="/support-desk/tickets-preview" className="fw-semi-bold">
          {subject}
        </Link>
      );
    }
  },
  {
    accessor: 'status',
    Header: 'Status',
    cellProps: {
      className: 'fs-0 pe-4'
    },
    Cell: rowData => {
      const { status } = rowData.row.original;
      return (
        <SoftBadge bg={status.type} className="me-2">
          {status.content}
        </SoftBadge>
      );
    }
  },
  {
    accessor: 'priority',
    Header: 'Priority',
    cellProps: {
      className: 'pe-4'
    },
    Cell: rowData => {
      const { priority } = rowData.row.original;
      return (
        <PrioritySelect
          title={priority.title}
          color={priority.color}
          data={priority.data}
        />
      );
    }
  },
  {
    accessor: 'agent',
    Header: 'Agent',
    headerProps: { className: 'text-end' },
    Cell: rowData => {
      const { agent } = rowData.row.original;
      return <AgentSelect agent={agent} className="w-auto ms-auto" />;
    }
  }
];

export const CardLayout = ({
  data,
  isSelectedItem,
  toggleSelectedItem,
  format
}) => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex flex-column gap-3 w-100">
      {data.map(
        (
          element,
          index //.slice(0, 12)
        ) => (
          <div
            key={index}
            className="bg-white dark__bg-1100 d-md-flex d-xl-inline-block d-xxl-flex align-items-center p-x1 rounded-3 shadow-sm card-view-height w-100"
          >
            <div className="d-flex align-items-start align-items-sm-center w-100">
              <Form.Check
                type="checkbox"
                id="inboxBulkSelect"
                className="fs-0 form-check me-2 me-xxl-3 mb-0"
              >
                <Form.Check.Input
                  type="checkbox"
                  checked={isSelectedItem(element.id)}
                  onChange={() => toggleSelectedItem(element.id)}
                />
              </Form.Check>
              {/* <Link
              to="/support-desk/contact-details"
              className="d-none d-sm-block"
            >
              {ticket.avatar.img ? (
                <Avatar src={ticket.avatar.img} size="3xl" />
              ) : (
                <Avatar size="3xl" name={ticket.avatar.name} />
              )}
            </Link> */}
              <div className="ms-1 ms-sm-3 w-100">
                {/* <p className="fw-semi-bold mb-3 mb-sm-2">
                <Link to="/support-desk/tickets-preview"></Link>
              </p> */}
                {/* <Row className="d-flex justify-content-between">
                  <Col xs="auto" className="lh-1 mb-3">
                    <SoftBadge bg={'info'}>{`#${element.id}`}</SoftBadge>
                  </Col>
                  
                </Row> */}
                <Row className="align-items-center gx-0 gy-2 d-flex">
                  <Col xs="auto" className="me-2">
                    <h6 className="mb-0">
                      <Link
                        to={`/projects/view/${element.id}`}
                        className="text-800 d-flex align-items-center gap-1"
                      >
                        <FontAwesomeIcon
                          icon="layer-group"
                          transform="shrink-3 up-1"
                        />
                        <span className="text-break">{element.name}</span>
                      </Link>
                    </h6>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip style={{ position: 'fixed' }}>
                          <FormattedMessage id="projects.page.column.issueBtn"/>
                        </Tooltip>
                      }
                    >
                      <Link to="/">
                        <IconButton
                          variant="falcon-default"
                          size="sm"
                          icon={['fab', 'trello']}
                          transform="shrink-3"
                          className="me-3"
                          onClick={() => dispatch(setActiveProject(element))}
                          iconAlign="middle"
                        />
                      </Link>
                    </OverlayTrigger>
                  </Col>
                  {/* <Col xs="auto">
                  <h6 className="mb-0 text-500">{ticket.date}</h6>
                </Col> */}
                </Row>
                <Row>
                <Col xs="auto" className="lh-1 mb-3 me-0">
                    <div className="text-secondary small">
                      <FormattedMessage id="projects.page.column.updatedOn" />
                      {`: ${Utils.formatDateToYYYYMMDD(Utils.formatDate(element.updated_on).toLocaleString(), 'ddmmyyyy')}`}
                      {Utils.formatDate(element.updated_on).split(',')[1]}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="border-bottom mt-4 mb-x1"></div>
            {/* <div className="d-flex justify-content-between ms-auto">
            <PrioritySelect
              title={ticket.priority.title}
              color={ticket.priority.color}
              data={ticket.priority.data}
              className="ms-md-4 ms-xl-0"
              style={{ width: '7.5rem' }}
            />
            <AgentSelect agent={ticket.agent} style={{ width: '9.375rem' }} />
          </div> */}
          </div>
        )
      )}
    </div>
  );
};

CardLayout.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isSelectedItem: PropTypes.func,
  toggleSelectedItem: PropTypes.func
};
