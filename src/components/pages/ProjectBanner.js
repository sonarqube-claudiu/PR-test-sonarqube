import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import Background from 'components/common/Background';
import Avatar from 'components/common/Avatar';
import classNames from 'classnames';

const ProjectBannerHeader = ({ avatar, coverSrc, className }) => {
  return (
    <Card.Header
      className={classNames(className, 'position-relative min-vh-25 mb-7')}
    >
      <Background image={coverSrc} className="rounded-3 rounded-bottom-0" />
      <Avatar
        size="5xl"
        className="avatar-profile"
        src={avatar}
        mediaClass="img-thumbnail shadow-sm"
      />
    </Card.Header>
  );
};

const ProjectBannerBody = ({ children }) => {
  return <Card.Body>{children}</Card.Body>;
};

const ProjectBanner = ({ children }) => {
  return <Card className="mb-3">{children}</Card>;
};

ProjectBanner.Header = ProjectBannerHeader;
ProjectBanner.Body = ProjectBannerBody;

ProjectBannerHeader.propTypes = {
  avatar: PropTypes.string.isRequired,
  coverSrc: PropTypes.string.isRequired,
  className: PropTypes.string
};

ProjectBannerBody.propTypes = {
  children: PropTypes.node.isRequired
};

ProjectBanner.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProjectBanner;
