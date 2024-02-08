import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Offcanvas,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AllElementsHeader from './AllElementsHeader';
import { Utils } from 'models/Utils';

const TableView = ({
  dataArray,
  elementsPerPage,
  setElementsPerPage,
  searchBy,
  columns,
  handleNew,
  headerTitle,
  tableViewLink,
  changeViewActive,
  cardViewLink,
  sortBy,
  selection
}) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [searchText, setSearchText] = useState('');
  const [primaryElements, setPrimaryElements] = useState(null);

  const handleSearch = text => {
    if (text === '') return setPrimaryElements(dataArray);
    const filteredElements = dataArray.filter(element =>
      element[searchBy].toLowerCase().includes(text.toLowerCase())
    );
    setPrimaryElements(filteredElements);
  };

  useEffect(() => {
    if (dataArray && dataArray.length > 0) {
      setPrimaryElements(dataArray);
    }
  }, [dataArray]);

  useEffect(() => {
    handleSearch(searchText);
  }, [elementsPerPage, searchText]);

  return (
    <Row className="gx-3">
      <Col xxl={12} xl={12}>
        <AdvanceTableWrapper
          columns={columns}
          data={primaryElements || dataArray}
          selection={selection}
          selectionColumnWidth={52}
          sortable
          pagination
          perPage={elementsPerPage}
          sortBy={sortBy}
          // rowCount={tickets.length}
        >
          <Card>
            <Card.Header className="border-bottom border-200 px-0">
              <AllElementsHeader
                table
                layout="table-view"
                handleShow={handleShow}
                handleNew={handleNew}
                itemsPerPage={elementsPerPage}
                setItemsPerPage={setElementsPerPage}
                tableViewLink={tableViewLink}
                cardViewLink={cardViewLink}
                changeViewActive={changeViewActive}
                handleSearch={value => {
                  setSearchText(value);
                }}
                headerTitle={headerTitle}
              />
            </Card.Header>
            <Card.Body className="p-0">
              <AdvanceTable
                table
                headerClassName="bg-body-tertiary align-middle"
                rowClassName="btn-reveal-trigger align-middle"
                tableProps={{
                  size: 'sm',
                  className: 'fs--1 mb-0 overflow-hidden'
                }}
              />
            </Card.Body>
            <Card.Footer>
              <AdvanceTablePagination table />
            </Card.Footer>
          </Card>
        </AdvanceTableWrapper>
      </Col>
      {/* <Col xxl={2} xl={3}>
        {breakpoints.down('xl') ? (
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className="dark__bg-card-dark"
          >
            <Offcanvas.Header closeButton className="bg-body-tertiary">
              <h6 className="fs-0 mb-0 fw-semi-bold">Filter</h6>
            </Offcanvas.Header>
            <TicketFilteringForm />
          </Offcanvas>
        ) : (
          <TicketFilteringForm />
        )}
      </Col> */}
    </Row>
  );
};

export default TableView;
