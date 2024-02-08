import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getItemFromStore } from 'helpers/utils';
import { settings } from 'config';

const isDark = getItemFromStore('isDark', settings.isDark);

const SoftBadge = ({ bg = 'primary', pill, children, className, style }) => {

  return (
    <div
      className={classNames(className, `badge badge-soft-${bg}`, {
        'rounded-pill': pill
      })}
      style={style}
    >
      {children}
    </div>
  );
};

SoftBadge.propTypes = {
  bg: PropTypes.oneOf([
    `dark-new`,
    `light-new`,
    'dark-inProgress',
    'light-inProgress',
    'dark-onHold',
    'light-onHold',
    'dark-resolved', 
    'light-resolved',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
  ]),
  pill: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default SoftBadge;
