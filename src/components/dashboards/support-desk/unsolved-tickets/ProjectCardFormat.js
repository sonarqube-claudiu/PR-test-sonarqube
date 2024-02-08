import { Col, OverlayTrigger, Row, Tooltip, Form } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SoftBadge from 'components/common/SoftBadge';
import { formatDate } from 'utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import { setActiveProject } from 'features/projectsSlice';
import { useDispatch } from 'react-redux';
import { Utils } from 'models/Utils';
import useBulkSelect from 'hooks/useBulkSelect';

const ProjectCardFormat = ({ elements }) => {
  const dispatch = useDispatch();
  const elementIds = Object.values(elements).map(element => element.id);
  const { selectedItems, isSelectedItem, toggleSelectedItem } =
    useBulkSelect(elementIds);
  return (
    <>
      {Object.values(elements).map(element => (
        <div key={element.id} className='mb-5'>
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
          <Row className="d-flex justify-content-between">
            <Col xs="auto" className="lh-1 mb-3">
              <SoftBadge bg={'info'}>{`#${element.id}`}</SoftBadge>
            </Col>
            <Col xs="auto" className="lh-1 mb-3 me-0">
              <div className="text-secondary small">
                <FormattedMessage id="projects.page.column.updatedOn" />
                {`: ${Utils.formatDate(element.updated_on).toLocaleString()}`}
              </div>
            </Col>
          </Row>
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
                  <Tooltip style={{ position: 'fixed' }}><FormattedMessage id="projects.page.column.issueBtn"/></Tooltip>
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
        </div>
      ))}
    </>
  );
};

export default ProjectCardFormat;
