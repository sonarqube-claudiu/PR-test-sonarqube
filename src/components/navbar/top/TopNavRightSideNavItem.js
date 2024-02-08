
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import React, { useContext } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { LanguageDropDown } from './LanguageDropDown';
import { DayAndNightSwitch } from './DayAndNightSwitch';

const TopNavRightSideNavItem = () => {
  const user = useSelector(state => state.user);

  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <Nav.Item as={'li'}>
        <FormattedMessage id="sidebar.greetings" />
        {` ${user.displayName}`}
      </Nav.Item>
      <ProfileDropdown />
      <DayAndNightSwitch />
      <LanguageDropDown />

    </Nav>
  );
};

export default TopNavRightSideNavItem;
