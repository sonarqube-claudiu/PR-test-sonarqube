import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import {
  Button,
  Col,
  Dropdown,
  Form,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { setProjectsPerPage } from 'features/projectsSlice';
import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { ITEMS_PER_PAGE_ARRAY } from 'models/Constants';

const AllElementsHeader = ({
  selectedRowIds,
  globalFilter,
  setGlobalFilter,
  layout,
  handleShow,
  selectedItems,
  handleSearch,
  headerTitle,
  changeViewActive,
  itemsPerPage,
  setItemsPerPage,
  tableViewLink,
  cardViewLink,
  handleNew
}) => {
  const intl = useIntl();

  return (
    <div className="d-lg-flex justify-content-between">
      <Row className="flex-between-center gy-2 px-x1">
        <Col xs="auto" className="pe-0">
          <h6 className="mb-0"> {headerTitle}</h6>
        </Col>
        <Col xs="auto">
          {/* {layout === 'table-view' ? (
            <AdvanceTableSearchBox
              className="input-search-width"
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              placeholder="Search by name"
            />
          ) : ( */}
          <InputGroup className="position-relative input-search-width">
            <FormControl
              size="sm"
              id="search"
              type="search"
              className="shadow-none"
              placeholder={intl.formatMessage({
                id: 'projects.page.header.searchbar'
              })}
              onChange={e => handleSearch(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline-secondary"
              className="border-300 hover-border-secondary"
            >
              <FontAwesomeIcon icon="search" className="fs--1" />
            </Button>
          </InputGroup>
          {/* )} */}
        </Col>
      </Row>
      <div className="border-bottom border-200 my-3"></div>
      <div className="d-flex align-items-center justify-content-between justify-content-lg-end px-x1">
        {/* <IconButton
          variant="falcon-default"
          size="sm"
          icon="filter"
          transform="shrink-4"
          iconAlign="middle"
          onClick={handleShow}
          className="d-xl-none"
        >
          <span className="d-none d-sm-inline-block ms-1">Filter</span>
        </IconButton> */}
        <div
          className="bg-300 mx-3 d-none d-lg-block d-xl-none"
          style={{ width: '1px', height: '29px' }}
        ></div>
        {(selectedRowIds && Object.keys(selectedRowIds).length > 0) ||
        (selectedItems && selectedItems.length > 0) ? (
          <div className="d-flex">
            <Form.Select size="sm" aria-label="Bulk actions">
              <option>Bulk Actions</option>
              <option value="refund">Refund</option>
              <option value="delete">Delete</option>
              <option value="archive">Archive</option>
            </Form.Select>
            <Button
              type="button"
              variant="falcon-default"
              size="sm"
              className="ms-2"
            >
              Apply
            </Button>
          </div>
        ) : (
          <div id="orders-actions">
            {changeViewActive && (
              <Dropdown
                align="end"
                className="btn-reveal-trigger d-inline-block me-2"
              >
                <Dropdown.Toggle split variant="falcon-default" size="sm">
                  <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block me-1">
                    {layout === 'table-view' ? (
                      <FormattedMessage id="btn.tableView" />
                    ) : (
                      <FormattedMessage id="btn.cardView" />
                    )}
                  </span>
                  <FontAwesomeIcon icon="chevron-down" transform="shrink-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="border py-0">
                  <div className="py-2">
                    <Link
                      className={classNames('dropdown-item', {
                        active: layout === 'table-view'
                      })}
                      to={tableViewLink}
                    >
                      <FormattedMessage id="btn.tableView" />
                    </Link>
                    <Link
                      className={classNames('dropdown-item', {
                        active: layout === 'card-view'
                      })}
                      to={cardViewLink}
                    >
                      <FormattedMessage id="btn.cardView" />
                    </Link>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip
                  style={{
                    position: 'fixed' //changed properties of .tooltip-inner class in theme.css
                  }}
                >
                  <FormattedMessage id="projects.page.header.itemsPerPage" />
                </Tooltip>
              }
            >
              <select
                className="btn text-dark btn-light btn-sm shadow-none me-2"
                defaultValue={itemsPerPage}
                onChange={setItemsPerPage}
              >
                {ITEMS_PER_PAGE_ARRAY.map(number => (
                  <option key={number}>{number}</option>
                ))}
              </select>
            </OverlayTrigger>
            <IconButton
              variant="falcon-default"
              size="sm"
              icon="plus"
              transform="shrink-3"
              iconAlign="middle"
              onClick={handleNew}
            >
              <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                <FormattedMessage id="btn.new" />
              </span>
            </IconButton>
            {/* <IconButton
              variant="falcon-default"
              size="sm"
              icon="external-link-alt"
              transform="shrink-3"
              className="mx-2"
              iconAlign="middle"
            >
              <span className="d-none d-sm-inline-block d-xl-none d-xxl-inline-block ms-1">
                Export
              </span>
            </IconButton> */}
            {/* <Dropdown align="end" className="btn-reveal-trigger d-inline-block">
              <Dropdown.Toggle split variant="falcon-default" size="sm">
                <FontAwesomeIcon icon="ellipsis-h" className="fs--2" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="border py-0">
                <div className="py-2">
                  <Dropdown.Item>View</Dropdown.Item>
                  <Dropdown.Item>Export</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger">Remove</Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown> */}
          </div>
        )}
      </div>
    </div>
  );
};

AllElementsHeader.propTypes = {
  selectedRowIds: PropTypes.object,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
  handleShow: PropTypes.func,
  layout: PropTypes.string,
  selectedItems: PropTypes.array,
  handleTicketsSearch: PropTypes.func
};

export default AllElementsHeader;
