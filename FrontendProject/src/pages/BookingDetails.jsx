
import { useParams, Link } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  useEsewaPaymentDetailsQuery,
  useGetBookingByIdQuery,
} from "../Slices/BookingApiSlice";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Card,
  ListGroup,
  Alert,
  Button,
} from "react-bootstrap";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsPersonFill,
  BsCardText,
  BsCarFront,
  BsGeoAlt,
  BsCreditCard2Back,
  BsCalendar2Check,
  BsArrowLeft,
} from "react-icons/bs";

//Helper format date nicely
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

//  Reusable row  label + value
function InfoRow({ label, children }) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 py-2 border-0 border-bottom">
      <span className="text-muted small">{label}</span>
      <span className="fw-semibold text-end ms-3" style={{ maxWidth: "60%" }}>
        {children || "—"}
      </span>
    </ListGroup.Item>
  );
}

//  Section card wrapper
function Section({ icon, title, children }) {
  return (
    <Card className="mb-3 border shadow-sm">
      <Card.Header className="bg-white d-flex align-items-center gap-2 py-2">
        <span className="text-success">{icon}</span>
        <span className="fw-bold small text-uppercase text-dark">{title}</span>
      </Card.Header>
      <Card.Body className="px-3 py-2">
        <ListGroup variant="flush">{children}</ListGroup>
      </Card.Body>
    </Card>
  );
}

//  Main Component
function BookingDetails() {
  const { id } = useParams();
  const { data: bookingRes, isLoading, error } = useGetBookingByIdQuery(id);
  const { data: PaymentDetails } = useEsewaPaymentDetailsQuery(id);
  console.log("this  is payment  details ", PaymentDetails);
  console.log(PaymentDetails?.details);
  console.log("Booking ID:", id);

  const navigate = useNavigate();
  // e sewa page handle page design and  output display
  const handleEsewaPayment = () => {
    const form = document.createElement("form");
    form.method = "POST"; // form.setAttribute("method" , "POST");
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    for (const key in PaymentDetails.details) {
      const input = document.createElement("input");
      input.name = key;
      //  input.setAttribute=("value", PaymentDetails.details[key]);
      input.value = PaymentDetails.details[key];
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    console.log(form);
  };

  // and then this is payment and booking status check  to true in rental page
//   const handleRental = () => {
//   if (!b?.payment?.isPaid) {
//     alert("Please complete payment first.");
//     return;
//   }

//   if (!b?.bookingStatus) {
//     alert("Booking is not confirmed yet.");
//     return;
//   }

//   navigate(`/rental/${b?._id}`);
// };



const handleRental = () => {
  if (!b) {
    toast.error("Booking not loaded yet");
    return;
  }

 if (b?.payment?.isPaid !== true) {
  toast.error("Please complete payment first");
  return;
}

// if (!b?.bookingStatus ) {
//   toast.error("Booking is not confirmed yet");
//   return;
// }

  toast.success("Redirecting to rental...");
  navigate("/rental");
    // navigate(`/rental/${b._id}`);
};

  // Safe read from Redux — optional chaining prevents crash if empty
  const { Nagariktapage, License } = useSelector((state) => state.cart);

  //  Support multiple backend response shapes
  const b = bookingRes?.bookingId || bookingRes?.booking || bookingRes;
  //  Safe user name build
  const userName =
    `${b?.user?.firstName || ""} ${b?.user?.lastName || ""}`.trim() || "—";

  console.log("Full booking data:", bookingRes);
  console.log("Normalized b:", b);
  console.log("Payment object:", b?.payment);
  console.log("isPaid:", b?.payment?.isPaid);
  console.log("payment method:", b?.payment?.method);

  //  Loading state
  if (isLoading) {
    return (
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="success" className="mb-3" />
        <span className="text-muted small">Loading booking details…</span>
      </Container>
    );
  }

  //  Error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <BsXCircleFill />
          Could not load booking. Please try again.
        </Alert>
        <Link to="/" className="btn btn-success btn-sm">
          <BsArrowLeft className="me-1" /> Back to Home
        </Link>
      </Container>
    );
  }

  const totalAmount = b?.totalPrice || 0;
  console.log("this is b ", b);
  console.log("this is is paid", b?.payment?.isPaid);
  console.log("this is booking status", b?.bookingStatus);

  return (
    <Container className="py-4">
      {/* ── Confirmation banner ── */}
      <Card
        className="mb-4 border-0 text-white text-center shadow"
        style={{ backgroundColor: "#445135" }}
      >
        <Card.Body className="py-4">
          <BsCheckCircleFill size={42} color="#afb3b1" className="mb-2" />
          <h4 className="fw-bold mb-1">Booking Confirmed!</h4>
          <p
            className="mb-2"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
          >
            Your vehicle is reserved. Review the details below.
          </p>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {/*  Left column  */}
        <Col lg={8}>
          {/* Customer Details */}
          <Section icon={<BsPersonFill />} title="Customer Details">
            <InfoRow label="Full Name">{userName}</InfoRow>
            {/*  optional chaining — no crash if user undefined */}
            <InfoRow label="Email">{b?.user?.email}</InfoRow>
            {/*  optional chaining on Redux Nagariktapage */}
            <InfoRow label="Permanent Address">
              {Nagariktapage?.permentAddress}
            </InfoRow>
            <InfoRow label="Citizenship No.">
              {Nagariktapage?.citizenshipNo}
            </InfoRow>
          </Section>

          {/* License Details */}
          <Section icon={<BsCardText />} title="Driving License Details">
            {/*  optional chaining on all License fields */}
            <InfoRow label="Full Name">{License?.fullname}</InfoRow>
            <InfoRow label="License Number">{License?.licesneNumber}</InfoRow>
            <InfoRow label="Nagarikta Number">
              {License?.nagariktaNumber}
            </InfoRow>
            <InfoRow label="Address">{License?.address}</InfoRow>
          </Section>

          {/* Vehicle */}
          <Section icon={<BsCarFront />} title="Vehicle">
            {b?.vehicle?.image && (
              <img
                src={b.vehicle.image}
                alt={b.vehicle.name}
                className="rounded mb-2"
                style={{ width: "50%", maxHeight: 180, objectFit: "cover" }}
              />
            )}
            <InfoRow label="Vehicle Name">{b?.vehicle?.name}</InfoRow>
            <InfoRow label="Price per Day">
              {b?.vehicle?.pricePerDay
                ? `Rs. ${b.vehicle.pricePerDay.toLocaleString()}`
                : "—"}
            </InfoRow>
          </Section>

          {/* Rental Details */}
          <Section icon={<BsCalendar2Check />} title="Rental Details">
            {/*  optional chaining on bookingPeriod */}
            <InfoRow label="Pickup Date">
              {fmtDate(b?.bookingPeriod?.start)}
            </InfoRow>
            <InfoRow label="Return Date">
              {fmtDate(b?.bookingPeriod?.end)}
            </InfoRow>
            <InfoRow label="Total Days">
              {b?.totalDays
                ? `${b.totalDays} day${b.totalDays > 1 ? "s" : ""}`
                : "—"}
            </InfoRow>
            <InfoRow label="Total Price">
              Rs. {totalAmount.toLocaleString()}
            </InfoRow>
          </Section>

          {/* Locations */}
          <Section icon={<BsGeoAlt />} title="Locations">
            <InfoRow label="Pickup Location">{b?.pickupLocation}</InfoRow>
            <InfoRow label="Drop Location">{b?.dropLocation}</InfoRow>
          </Section>

          {/* Payment */}
          <Section icon={<BsCreditCard2Back />} title="Payment">
            <InfoRow label="Method">
              <InfoRow label="Method">
                {b?.payment?.method === "eSewa" ? (
                  <Badge bg="primary">eSewa</Badge>
                ) : b?.payment?.method === "Khalti" ? (
                  <Badge bg="purple" style={{ backgroundColor: "#5C2D91" }}>
                    Khalti
                  </Badge>
                ) : (
                  <Badge bg="success">Cash on Delivery</Badge>
                )}
              </InfoRow>
            </InfoRow>

            <InfoRow label="Status">
              {b?.payment?.isPaid ? (
                <Badge bg="success">
                  Paid on {fmtDate(b?.payment?.paidAt)}
                </Badge>
              ) : (
                <Badge bg="danger">Not Paid Yet</Badge>
              )}
            </InfoRow>
            {/* Total row */}
            <ListGroup.Item className="px-0 pt-3 border-0">
              <div className="d-flex justify-content-between align-items-center bg-light rounded p-3">
                <span className="fw-bold">Total Amount</span>
                <span className="fw-bold text-danger fs-5">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </ListGroup.Item>
          </Section>
        </Col>

        {/*  Right column  */}
        <Col lg={4}>
          <div>
            <Card className="mb-3 border shadow-sm text-center">
              <Card.Header className="bg-white fw-bold small text-uppercase text-start py-2">
                <BsCheckCircleFill className="text-success me-2" />
                Booking Status
              </Card.Header>
              <Card.Body className="py-4">
                <BsCheckCircleFill size={38} color="#1d9e75" className="mb-2" />
                <div className="mb-2">
                  {b?.bookingStatus ? (
                    <Badge bg="success">
                      bookingStatus on {fmtDate(b?.bookingStatus)}
                    </Badge>
                  ) : (
                    <Badge bg="danger">Not bookingStatus Yet</Badge>
                  )}
                </div>
                {/* <div className="text-muted" style={{ fontSize: 12 }}>
                  Booking ID: <strong className="text-dark">#{id}</strong>
                </div> */}
              </Card.Body>
            </Card>

            <Card className="mb-3 border shadow-sm">
              <Card.Header className="bg-white fw-bold small text-uppercase py-2">
                Actions
              </Card.Header>
              <Card.Body className="d-grid gap-2">
                <Link to="/" className="btn btn-danger fw-semibold">
                  <BsArrowLeft className="me-1" /> Back to Home
                </Link>
                <Link
                  to="/mybookings"
                  className="btn btn-outline-secondary btn-sm"
                >
                  View All Bookings
                </Link>
              </Card.Body>
            </Card>

            {/* <Card className="border shadow-sm">
              <Card.Header className="bg-white fw-bold small text-uppercase py-2">
                <BsCalendar2Check className="text-success me-2" />
                What&apos;s Next?
              </Card.Header>
             
            </Card> */}
          </div>

          <Card style={{ position: "sticky", top: 20 }}>
            <ListGroup>
              <ListGroup.Item>
                <h2>Booking summery</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>vehicle price</Col>
                  <Col>
                    ${" "}
                    {b?.vehicle?.pricePerDay
                      ? `Rs. ${b.vehicle.pricePerDay.toLocaleString()}`
                      : "—"}
                  </Col>
                </Row>

                <Row>
                  <Col>tax price</Col>
                  <Col>{b?.orders?.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>total price</Col>
                  <Col>{totalAmount.toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>
              {b.paymentMethod != "COD" && !b?.payment?.isPaid && (
                <ListGroup.Item className="m-1 d-flex gap-5">
                  <Button variant="dark" onClick={handleEsewaPayment}>
                    Pay via Esewa
                  </Button>

                </ListGroup.Item>
              )}
              
                  <Button
                    type="button"

                    as={Link}
                  
                    variant="danger"
                    className="w-100 fw-bold py-2"
                    // disabled={!b?.payment?.isPaid || !b?.bookingStatus}
                     onClick={handleRental}
                  >
                    Go To Rental
                  </Button>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BookingDetails;
