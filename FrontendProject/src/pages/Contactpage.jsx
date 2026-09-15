import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { FiMail, FiUser, FiMessageSquare, FiSend, FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";
// import { useSendContactMessageMutation } from "../Slices/ContactApiSlice";
import { useSendContactMessageMutation } from "../Slices/contactApiSlice";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phoneNumber, message } = formData;

    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !message.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        message: message.trim(),
      }).unwrap();

      toast.success(res?.message || "Message sent successfully!");
      setFormData({ name: "", email: "", phoneNumber: "", message: "" });
    } catch (err) {
      toast.error(
        err?.data?.error || err?.error || "Failed to send message. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "3.5rem 0 5rem",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4">
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "#211c16",
                  fontWeight: 700,
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                Get in Touch
              </h1>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "#6c757d",
                  fontSize: "1rem",
                  marginBottom: 0,
                }}
              >
                Questions about a booking or your vehicle? Send us a message.
              </p>
            </div>

            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "16px", overflow: "hidden" }}
            >
              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  {/* Name */}
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "#211c16",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      Full Name
                    </Form.Label>
                    <div className="position-relative">
                      <FiUser
                        size={16}
                        className="position-absolute text-muted"
                        style={{
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        disabled={isLoading}
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          paddingLeft: "40px",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                          height: "46px",
                        }}
                      />
                    </div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "#211c16",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      Email Address
                    </Form.Label>
                    <div className="position-relative">
                      <FiMail
                        size={16}
                        className="position-absolute text-muted"
                        style={{
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          paddingLeft: "40px",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                          height: "46px",
                        }}
                      />
                    </div>
                  </Form.Group>

                  {/* Phone Number (required by backend) */}
                  <Form.Group className="mb-3" controlId="contactPhone">
                    <Form.Label
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "#211c16",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      Phone Number
                    </Form.Label>
                    <div className="position-relative">
                      <FiPhone
                        size={16}
                        className="position-absolute text-muted"
                        style={{
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        required
                        disabled={isLoading}
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          paddingLeft: "40px",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                          height: "46px",
                        }}
                      />
                    </div>
                  </Form.Group>

                  {/* Message */}
                  <Form.Group className="mb-4" controlId="contactMessage">
                    <Form.Label
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "#211c16",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      Message
                    </Form.Label>
                    <div className="position-relative">
                      <FiMessageSquare
                        size={16}
                        className="position-absolute text-muted"
                        style={{
                          left: "14px",
                          top: "14px",
                          pointerEvents: "none",
                        }}
                      />
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        disabled={isLoading}
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          paddingLeft: "40px",
                          borderRadius: "10px",
                          border: "1px solid #e5e5e5",
                          resize: "none",
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: "#ff6b4a",
                      border: "none",
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 600,
                      padding: "0.75rem",
                      borderRadius: "10px",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" animation="border" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <FiSend size={16} />
                        Send Message
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <p
              className="text-center mt-3 mb-0"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              We usually reply within 24 hours.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;