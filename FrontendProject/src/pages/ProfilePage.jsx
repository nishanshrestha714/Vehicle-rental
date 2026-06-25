import { Form, Col, Row, Card, Button, Badge } from "react-bootstrap";
import FromContainer from "../components/FromContainers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyBookingQuery } from "../Slices/BookingApiSlice";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router";

function ProfilePage() {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo?.phoneNumber || ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: booking, isLoading, error } = useGetMyBookingQuery();

  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold">My Profile</h2>
        <p className="text-muted">
          Manage your profile information and bookings
        </p>
      </div>

      <Row className="g-4">
        {/* LEFT SIDE PROFILE */}
        <Col lg={4}>
          <Card className="border-0 shadow rounded-4">
            <Card.Body className="p-4">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {name?.charAt(0)?.toUpperCase()}
                </div>

                <h4 className="mt-3 mb-1">{name}</h4>
                <small className="text-muted">{email}</small>
              </div>

              <FromContainer>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="dark"
                    className="w-100 rounded-3 fw-semibold"
                  >
                    Update Profile
                  </Button>
                </Form>
              </FromContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT SIDE BOOKINGS */}
        <Col lg={8}>
          <Card className="border-0 shadow rounded-4">
            <Card.Body>
              <h4 className="fw-bold mb-4">My Bookings</h4>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <ErrorMessage>
                  {error?.data?.message || "Something went wrong"}
                </ErrorMessage>
              ) : booking?.MyBooking?.length === 0 ? (
                <p className="text-muted">No bookings found.</p>
              ) : (
                <Row className="g-3">
                  {booking?.MyBooking?.map((booked) => (
                    <Col md={12} key={booked._id}>
                      <Card className="border shadow-sm rounded-4">
                        <Card.Body>
                          <Row className="align-items-center">
                            {/* Vehicle Image */}
                            <Col md={3}>
                              <img
                                src={booked?.vehicle?.image}
                                alt={booked?.vehicle?.name}
                                className="img-fluid rounded-3"
                                style={{
                                  width: "100%",
                                  height: "140px",
                                  objectFit: "cover",
                                }}
                              />
                            </Col>

                            {/* Booking Info */}
                            <Col md={6}>
                              <h5 className="fw-bold mb-2">
                                {booked?.vehicle?.name}
                              </h5>

                              <p className="mb-1 text-muted">
                                Booking ID:
                                <br />
                                <small>{booked._id}</small>
                              </p>

                              <p className="mb-1">
                                <strong>Pickup:</strong>{" "}
                                {booked.pickupLocation}
                              </p>

                              <p className="mb-1">
                                <strong>Drop:</strong>{" "}
                                {booked.dropLocation}
                              </p>

                              <p className="mb-1">
                                <strong>Created:</strong>{" "}
                                {booked.createdAt?.substring(0, 10)}
                              </p>

                              <p className="mb-0">
                                <strong>Total:</strong>{" "}
                                <span className="text-success fw-bold">
                                  Rs. {booked.totalPrice}
                                </span>
                              </p>
                            </Col>

                            {/* Status + Button */}
                            <Col
                              md={3}
                              className="text-md-center mt-3 mt-md-0"
                            >
                              <div className="mb-2">
                                {booked?.payment?.isPaid ? (
                                  <Badge bg="success">Paid</Badge>
                                ) : (
                                  <Badge bg="danger">Pending Payment</Badge>
                                )}
                              </div>

                              <div className="mb-3">
                                {booked?.bookingStatus ? (
                                  <Badge bg="primary">
                                    Confirmed
                                  </Badge>
                                ) : (
                                  <Badge bg="warning" text="dark">
                                    Waiting
                                  </Badge>
                                )}
                              </div>

                              <Link
                                to={`/booking/${booked._id}`}
                                className="btn btn-dark btn-sm w-100"
                              >
                                View Details
                              </Link>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProfilePage;