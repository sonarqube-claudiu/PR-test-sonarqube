import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import engFlag from 'assets/img/country/eng.png';
import roFlag from 'assets/img/country/ro.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLanguage } from 'features/languageSlice';

const flags = {
  en: engFlag,
  ro: roFlag
};

export const LanguageDropDown = () => {
  const locale = useSelector(state => state.language.locale);
  const dispatch = useDispatch();
  return (
    <Dropdown as={Nav.Item} className="mb-1">
      <Dropdown.Toggle as={Nav.Link} id="language-dropdown">
        {/* Display the selected language's flag icon here */}
        <img src={flags[locale]} alt="English" width="25" height="15" /> &nbsp;
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-1" style={{ minWidth: 0 }}>
        <Dropdown.Item onClick={() => dispatch(setLanguage('en'))}>
          <img src={engFlag} alt="English" width="25" height="15" /> &nbsp;
        </Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(setLanguage('ro'))}>
          <img src={roFlag} alt="English" width="25" height="15" /> &nbsp;
        </Dropdown.Item>
        {/* Add more languages as needed */}
      </Dropdown.Menu>
    </Dropdown>
  );
};
