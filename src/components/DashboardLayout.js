import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
      </Navbar>

      <Container fluid>
        <Row>
          <Col md={2} className="bg-light">
            <Nav className="flex-column">
              <Nav.Link href="#overview">Overview</Nav.Link>
              <Nav.Link href="#reports">Reports</Nav.Link>
              <Nav.Link href="#settings">Settings</Nav.Link>
            </Nav>
          </Col>
          <Col md={10}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardLayout;
