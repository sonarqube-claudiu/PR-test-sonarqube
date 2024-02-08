import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';

const FilteringForm = () => {

  return (
    <Card className="shadow-none shadow-show-xl scrollbar">
      <Card.Header className="bg-body-tertiary d-none d-xl-block">
        <h6 className="mb-0">Filter</h6>
      </Card.Header>
      <Card.Body>
        <Form>
          <div className="mb-2 mt-n2">
            <Form.Label className="mb-1 fs--1">Priority</Form.Label>
            <Form.Select size="sm">
              <option>None</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Form.Select>
          </div>
        </Form>
      </Card.Body>
      <Card.Footer className="border-top border-200 py-x1">
        <Button varient="primary" className="w-100">
          Update
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default FilteringForm;
