import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { Link } from 'react-router-dom';
import Member from 'components/app/projects/Member';
import IconButton from 'components/common/IconButton';
import { FormattedMessage } from 'react-intl';

const ProjectMembers = ({
  totalMembers,
  members,
  title,
  colBreakpoints = { xs: 12, sm: `${totalMembers > 1 ? 6 : 12}` }
}) => {
  return (
    <Card className="p-0">
      <Card.Header className="bg-light">
        <Flex justifyContent="between">
          <h5 className="mb-0 fs-0">
            {title} (
            {totalMembers || 0}){' '}
          </h5>
        </Flex>
      </Card.Header>
      <Card.Body className="bg-light p-2 fs--1 overflow-x-scroll scrollbar">
        <Row className="gx-1 gy-1 text-center">
          {members &&
            members?.map(member => (
              <Col key={member?.user?.id} {...colBreakpoints}>
                <Member name={member?.user?.display_name} />
              </Col>
            ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProjectMembers;
