import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { FaLocationDot, FaCreditCard, FaShieldHalved } from "react-icons/fa6";
import "../AboutPage/Aboutpage.css";

function Aboutpage() {
  return (
    <Container className="py-5 const-about-page">
      {/* Hero Section */}
      <Row className="align-items-center mb-5 mt-3">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Badge bg="dark" className="px-3 py-2 mb-3 text-uppercase tracking-wider">
            Who We Are
          </Badge>
          <h1 className="display-4 fw-bold mb-3 text-dark">
            Simplifying Your Journey, <br />
            <span className="text-primary">One Mile at a Time</span>
          </h1>
          <p className="lead text-secondary mb-4">
            Welcome to our Vehicle Rental Management System, where we bridge the gap between seamless technology and unforgettable road trips. Whether you need a compact car for a city sprint, a luxury sedan for business, or a rugged SUV for an off-road adventure, we've got your keys waiting.
          </p>
          <Button as={Link} to="/" variant="dark" size="lg" className="px-4 py-3 fw-bold shadow-sm">
            Explore Our Fleet
          </Button>
        </Col>
        <Col lg={6}>
          <img
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
            alt="Our Luxury Fleet"
            className="img-fluid rounded-4 shadow-lg w-100 object-fit-cover"
            style={{ maxHeight: '450px' }}
          />
        </Col>
      </Row>

      <hr className="my-5 opacity-25" />

      {/* Statistics / Value Proposition */}
      <Row className="text-center g-4 mb-5">
        <Col md={4}>
          <div className="p-3">
            <h2 className="display-5 fw-extrabold text-dark mb-1">150+</h2>
            <p className="text-muted text-uppercase fw-semibold tracking-wide">Premium Vehicles</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-3">
            <h2 className="display-5 fw-extrabold text-dark mb-1">50k+</h2>
            <p className="text-muted text-uppercase fw-semibold tracking-wide">Happy Rentals</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-3">
            <h2 className="display-5 fw-extrabold text-dark mb-1">24/7</h2>
            <p className="text-muted text-uppercase fw-semibold tracking-wide">Roadside Support</p>
          </div>
        </Col>
      </Row>

      {/* Why Choose Us Section */}
      <Row className="mb-5">
        <Col xs={12} className="text-center mb-5">
          <h2 className="fw-bold text-dark">Why Choose Our Rental System?</h2>
          <p className="text-muted max-w-2xl mx-auto">
            We engineered a smarter platform to take the friction out of traditional car rentals.
          </p>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100 text-center p-4 custom-about-card">
            <Card.Body>
              <div className="icon-wrapper bg-light text-dark rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <FaLocationDot size={24} />
              </div>
              <Card.Title className="fw-bold mb-3">Flexible Locations</Card.Title>
              <Card.Text className="text-secondary">
                Pick up and drop off your vehicle across various hubs in the city with seamless cross-terminal routing.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100 text-center p-4 custom-about-card">
            <Card.Body>
              <div className="icon-wrapper bg-light text-dark rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <FaCreditCard size={24} />
              </div>
              <Card.Title className="fw-bold mb-3">Transparent Pricing</Card.Title>
              <Card.Text className="text-secondary">
                No hidden fees. Dynamic calculation scales pricing down the longer you borrow. What you see is what you pay.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100 text-center p-4 custom-about-card">
            <Card.Body>
              <div className="icon-wrapper bg-light text-dark rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <FaShieldHalved size={24} />
              </div>
              <Card.Title className="fw-bold mb-3">Verified Safety</Card.Title>
              <Card.Text className="text-secondary">
                Every single ride in our fleet undergoes rigorous mechanical detailing and multi-point inspections prior to dispatch.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CTA Banner Section */}
      <div className="bg-dark text-white rounded-4 p-5 text-center shadow-lg my-5">
        <h2 className="fw-bold mb-3 text-white">Ready to Hit the Road?</h2>
        <p className="mb-4 opacity-75 max-w-xl mx-auto">
          Sign up today, configure your booking dates, and grab your dream vehicle inside of 5 minutes.
        </p>
        <Button as={Link} to="/" variant="light" size="lg" className="px-4 py-2 fw-bold text-dark">
          Book Your Ride Now
        </Button>
      </div>
    </Container>
  );
}

export default Aboutpage;