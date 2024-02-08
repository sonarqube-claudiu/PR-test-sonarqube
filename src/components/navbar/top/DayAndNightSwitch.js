import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'context/Context';
import React, { useContext } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const DayAndNightSwitch = () => {
  const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext);
  return (
    <Nav.Item as={'li'}>
      <Nav.Link
        className="theme-control-toggle px-2 mb-1"
        onClick={() => setConfig('isDark', !isDark)}
      >
        <OverlayTrigger
          key="left"
          placement={isRTL ? 'bottom' : 'left'}
          overlay={
            <Tooltip style={{ position: 'fixed' }} id="ThemeColor">
            <FormattedMessage id={isDark? "sidebar.theme.light" : "sidebar.theme.dark"}/> 
            </Tooltip>
          }
        >
          <div className="theme-control-toggle-label">
            <FontAwesomeIcon icon={isDark ? 'sun' : 'moon'} className="fs-0" />
          </div>
        </OverlayTrigger>
      </Nav.Link>
    </Nav.Item>
  );
};
