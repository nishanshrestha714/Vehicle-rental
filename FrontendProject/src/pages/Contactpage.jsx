import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: hook up to backend contact endpoint
    console.log('Contact form submitted:', formData)
  }

  return (
    <div
      style={{
        backgroundColor: '#fbf7f0',
        minHeight: '100vh',
        padding: '4rem 0',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                color: '#211c16',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Get in Touch
            </h1>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#211c16',
                opacity: 0.7,
                marginBottom: '2rem',
              }}
            >
              Questions about a booking or your vehicle? Send us a message.
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="contactName">
                <Form.Label
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#211c16' }}
                >
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contactEmail">
                <Form.Label
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#211c16' }}
                >
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="contactMessage">
                <Form.Label
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#211c16' }}
                >
                  Message
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
              </Form.Group>

              <Button
                type="submit"
                style={{
                  backgroundColor: '#ff6b4a',
                  border: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  padding: '0.6rem 2rem',
                }}
              >
                Send Message
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ContactPage