import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoutImg from 'assets/img/icons/spot-illustrations/45.png';
import { FormattedMessage } from 'react-intl';

const LogoutContent = ({ layout, titleTag: TitleTag, counter }) => {
  return (
    <>
      <img
        className="d-block mx-auto mb-4"
        src={logoutImg}
        alt="shield"
        width={100}
      />
      <TitleTag>
        <FormattedMessage id="logout.confirmed.title" />
      </TitleTag>
      <p>
        <FormattedMessage id="logout.confirmed.message" />
        {` ${counter}`}
      </p>
      <Button as={Link} color="primary" size="sm" className="mt-3" to={`/`}>
        <FontAwesomeIcon
          icon="chevron-left"
          transform="shrink-4 down-1"
          className="me-1"
        />
        <FormattedMessage id="logout.confirmation.button.no" />
      </Button>
    </>
  );
};

LogoutContent.propTypes = {
  layout: PropTypes.string,
  titleTag: PropTypes.string,
  counter: PropTypes.number
};

LogoutContent.defaultProps = {
  layout: 'simple',
  titleTag: 'h4'
};

export default LogoutContent;
