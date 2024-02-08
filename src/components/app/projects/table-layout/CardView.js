import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { CardLayout } from 'components/dashboards/support-desk/unsolved-tickets/CardsLayout';
import { useBreakpoints } from 'hooks/useBreakpoints';
import useBulkSelect from 'hooks/useBulkSelect';
import usePagination from 'hooks/usePagination';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Offcanvas, Row } from 'react-bootstrap';
import AllTicketsHeader from '../../../common/table-template/AllElementsHeader';
import { useSelector } from 'react-redux';

const CardView = ({
  dataArray,
  elementsPerPage,
  searchBy,
  format,
  headerTitle,
  setElementsPerPage,
  tableViewLink,
  cardViewLink,
  changeViewActive
}) => {
  // const projects = useSelector(state => state.projects.projects);
  const [show, setShow] = useState(false);
  // const { breakpoints } = useBreakpoints();
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const elementIds = dataArray.map(element => element.id);
  const { selectedItems, isSelectedItem, toggleSelectedItem } =
    useBulkSelect(elementIds);
  const [primaryElements, setPrimaryElements] = useState(dataArray);
  // const projectsPerPage = useSelector(state => state.projects.projectsPerPage);
  const {
    paginationState: {
      data: paginatedElement,
      currentPage,
      canNextPage,
      canPreviousPage,
      paginationArray
    },
    nextPage,
    prevPage,
    goToPage
  } = usePagination(primaryElements, elementsPerPage);

  const handleSearch = text => {
    const filteredElements = dataArray.filter(element =>
      element[searchBy].toLowerCase().includes(text.toLowerCase())
    );
    setPrimaryElements(filteredElements);
  };

  return (
    <Row className="gx-3">
      <Col xxl={12} xl={12}>
        <Card>
          <Card.Header className="border-bottom border-200 px-0">
            <AllTicketsHeader
              layout="card-view"
              handleShow={handleShow}
              selectedItems={selectedItems}
              handleSearch={handleSearch}
              itemsPerPage={elementsPerPage}
              setItemsPerPage={setElementsPerPage}
              headerTitle={headerTitle}
              tableViewLink={tableViewLink}
              cardViewLink={cardViewLink}
              changeViewActive={changeViewActive}
            />
          </Card.Header>
          <Card.Body className="bg-body-tertiary w-100">
            <CardLayout
              data={paginatedElement}
              isSelectedItem={isSelectedItem}
              toggleSelectedItem={toggleSelectedItem}
              format={format}
            />
          </Card.Body>
          <Card.Footer className="d-flex justify-content-center">
            <div>
              <Button
                variant="falcon-default"
                size="sm"
                className={classNames('me-2', { disabled: !canPreviousPage })}
                onClick={prevPage}
              >
                <FontAwesomeIcon icon="chevron-left" />
              </Button>
            </div>

            <ul className="pagination mb-0">
              {paginationArray.map(page => (
                <li
                  key={page}
                  className={classNames({ active: currentPage === page })}
                >
                  <Button
                    size="sm"
                    variant="falcon-default"
                    className="page me-2"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                </li>
              ))}
            </ul>
            <div>
              <Button
                variant="falcon-default"
                size="sm"
                className={classNames({ disabled: !canNextPage })}
                onClick={nextPage}
              >
                <FontAwesomeIcon icon="chevron-right" />
              </Button>
            </div>
          </Card.Footer>
        </Card>
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

export default CardView;
