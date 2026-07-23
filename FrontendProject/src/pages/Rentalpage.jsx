import { useState } from "react";
import { useGetMyBookingQuery } from "../Slices/BookingApiSlice";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  ListGroup,
  Modal,
} from "react-bootstrap";

// ── helpers 
const getStatusColor = (status) => {
  switch (status) {
    case "accepted":   return "success";
    case "completed":  return "primary";
    case "cancelled":  return "danger";
    default:           return "warning";
  }
};

const fmt = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-NP") : "N/A";

// ── RentalSuccessModal ─────────────────────────────────────────────
function RentalSuccessModal({ booking, show, onClose }) {
  if (!booking) return null;

  const vehicleImage = Array.isArray(booking.vehicle?.image)
    ? booking.vehicle.image[0]?.url
    : booking.vehicle?.image ?? null;

    

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Body style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}>

        {/* Green success header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a7a4a 0%, #145c37 100%)",
            padding: "36px 28px 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "3px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 32,
              color: "#fff",
            }}
          >
            ✓
          </div>
          <h4
            style={{
              color: "#fff",
              fontWeight: 700,
              fontFamily: "'Playfair Display', Georgia, serif",
              margin: 0,
              fontSize: 24,
            }}
          >
            Rental Successful!
          </h4>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6, marginBottom: 0 }}>
            Your vehicle has been booked successfully
          </p>
        </div>

        {/* Vehicle highlight strip */}
        <div
          style={{
            background: "#f0faf5",
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderBottom: "1px solid #e0f0e8",
          }}
        >
          {vehicleImage ? (
            <img
              src={vehicleImage}
              alt="vehicle"
              style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 10 }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 56,
                background: "#d0e8da",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🚗
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0F1923" }}>
              {booking.vehicle?.name ?? "Vehicle"}
            </div>
            <Badge bg={getStatusColor(booking.bookingStatus)} style={{ fontSize: 11 }}>
              {booking.bookingStatus}
            </Badge>
          </div>
        </div>

        {/* Booking summary rows */}
        <div style={{ padding: "20px 28px" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "#6B8099",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Booking Summary
          </p>

          {[
            { label: "Booking ID",      value: booking._id?.slice(-10).toUpperCase() },
            { label: "Pickup Date",     value: fmt(booking.bookingPeriod?.start) },
            { label: "Return Date",     value: fmt(booking.bookingPeriod?.end) },
            { label: "Total Days",      value: `${booking.totalDays ?? "N/A"} days` },
            { label: "Pickup Location", value: booking.pickupLocation ?? "N/A" },
            { label: "Drop Location",   value: booking.dropLocation ?? "N/A" },
            { label: "Payment Method",  value: booking.payment?.method ?? "N/A" },
            {
              label: "Payment Status",
              value: booking.payment?.isPaid ? (
                <Badge bg="success">Paid ✓</Badge>
              ) : (
                <Badge bg="warning" text="dark">Unpaid</Badge>
              ),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #EEF3F8",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#6B8099", fontWeight: 500 }}>{label}</span>
              <span style={{ color: "#0F1923", fontWeight: 600 }}>{value}</span>
            </div>
          ))}

          {/* Total price highlight */}
          <div
            style={{
              background: "#FDF3E0",
              border: "1px solid rgba(232,160,32,0.25)",
              borderRadius: 12,
              padding: "14px 18px",
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0F1923" }}>
              Total Amount
            </span>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#E8A020" }}>
              रू {(booking.totalPrice ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "0 28px 28px", display: "flex", gap: 10 }}>
          <Button
            onClick={onClose}
            style={{
              flex: 1,
              background: "#1a7a4a",
              border: "none",
              fontWeight: 700,
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 14,
            }}
          >
            Done
          </Button>
          <Button
            variant="outline-secondary"
            onClick={onClose}
            style={{
              flex: 1,
              fontWeight: 600,
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 14,
            }}
          >
            View All Rentals
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ── BookingCard ────────────────────────────────────────────────────
function BookingCard({ b, onSuccess }) {
  const vehicleImage = Array.isArray(b.vehicle?.image)
    ? b.vehicle.image[0]?.url
    : b.vehicle?.image ?? null;

  return (
    <Card
      className="shadow-sm border-0 mb-4"
      style={{ borderRadius: 16, overflow: "hidden", background: "#fff" }}
    >
      {/* Coloured status strip at top */}
      <div
        style={{
          height: 4,
          background:
            b.bookingStatus === "accepted"  ? "#1a7a4a"
            : b.bookingStatus === "completed" ? "#0d6efd"
            : b.bookingStatus === "cancelled" ? "#c0392b"
            : "#E8A020",
        }}
      />

      <Card.Body style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: "#0F1923", fontSize: 17 }}>
            🚗 {b.vehicle?.name ?? "Unknown Vehicle"}
          </h5>
 <Badge
  bg={getStatusColor(b.bookingStatus)}
  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20 }}
>
  {typeof b.bookingStatus === "string" 
    ? b.bookingStatus.toUpperCase() 
    : "UNKNOWN"}
</Badge>
        </div>

        <hr style={{ borderColor: "#EEF3F8", margin: "0 0 16px" }} />

        <Row className="g-3">
          {/* Image */}
          <Col md={3} className="d-flex align-items-center justify-content-center">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="vehicle"
                className="img-fluid"
                style={{ maxHeight: 110, objectFit: "cover", borderRadius: 12 }}
              />
            ) : (
              <div
                style={{
                  height: 100,
                  width: "100%",
                  background: "#EEF3F8",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                }}
              >
                🚗
              </div>
            )}
          </Col>

          {/* Details */}
          <Col md={9}>
            <ListGroup variant="flush">
              {[
                { label: "Pickup Date",      value: fmt(b.bookingPeriod?.start) },
                { label: "Return Date",      value: fmt(b.bookingPeriod?.end) },
                { label: "Total Days",       value: `${b.totalDays ?? "N/A"} days` },
                { label: "Pickup Location",  value: b.pickupLocation ?? "N/A" },
                { label: "Drop Location",    value: b.dropLocation ?? "N/A" },
                { label: "Payment Method",   value: b.payment?.method ?? "N/A" },
              ].map(({ label, value }) => (
                <ListGroup.Item
                  key={label}
                  className="border-0 px-0 py-1"
                  style={{ fontSize: 13, color: "#2E4057", background: "transparent" }}
                >
                  <span
                    style={{
                      color: "#6B8099",
                      minWidth: 140,
                      display: "inline-block",
                      fontWeight: 500,
                    }}
                  >
                    {label}:
                  </span>
                  <strong>{value}</strong>
                </ListGroup.Item>
              ))}

              <ListGroup.Item
                className="border-0 px-0 py-1"
                style={{ fontSize: 13, background: "transparent" }}
              >
                <span
                  style={{
                    color: "#6B8099",
                    minWidth: 140,
                    display: "inline-block",
                    fontWeight: 500,
                  }}
                >
                  Payment Status:
                </span>
                {b.payment?.isPaid ? (
                  <Badge bg="success">Paid</Badge>
                ) : (
                  <Badge bg="warning" text="dark">Unpaid</Badge>
                )}
              </ListGroup.Item>

              <ListGroup.Item
                className="border-0 px-0 pt-2"
                style={{ fontSize: 15, background: "transparent" }}
              >
                <span
                  style={{
                    color: "#6B8099",
                    minWidth: 140,
                    display: "inline-block",
                    fontWeight: 500,
                  }}
                >
                  Total Price:
                </span>
                <strong style={{ color: "#E8A020", fontSize: 17 }}>
                  रू {(b.totalPrice ?? 0).toLocaleString()}
                </strong>
              </ListGroup.Item>
            </ListGroup>

            {/* Action buttons */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
              {/* ✅ Rental Success button */}
              <Button
                size="sm"
                onClick={() => onSuccess(b)}
                style={{
                  background: "#1a7a4a",
                  border: "none",
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: "7px 18px",
                  fontSize: 13,
                }}
              >
                ✓ Rental Success
              </Button>

              <Button
                size="sm"
                variant="outline-secondary"
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                View Details
              </Button>

              {b.bookingStatus === "pending" && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  style={{ borderRadius: 8, fontSize: 13 }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
function RentalPage() {
  const { data, isLoading, error } = useGetMyBookingQuery();
  const [successBooking, setSuccessBooking] = useState(null);
  const [showModal, setShowModal]           = useState(false);

  const bookings = data?.MyBooking || [];

  const handleSuccess = (booking) => {
    setSuccessBooking(booking);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: "#E8A020" }} />
        <p className="mt-3 text-muted">Loading your rentals…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h5 className="mt-3 text-danger">Failed to load rentals</h5>
        <p className="text-muted">Please try refreshing the page.</p>
      </Container>
    );
  }

  return (
    <>
      {/* ── Page header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F1923 0%, #2E4057 100%)",
          borderBottom: "4px solid #E8A020",
          padding: "36px 0 28px",
        }}
      >
        <Container>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              color: "#fff",
              fontSize: "clamp(22px, 3.5vw, 32px)",
              marginBottom: 4,
            }}
          >
            🚗 My Rental Dashboard
          </h2>
          <p style={{ color: "#B8C9D9", fontSize: 13, margin: 0 }}>
            Manage all your bookings, payments and rentals
          </p>

          {/* Stats row */}
          <div className="d-flex gap-3 mt-4 flex-wrap">
            {[
              { label: "Total Bookings", value: bookings.length },
              { label: "Active",         value: bookings.filter((b) => b.bookingStatus === "accepted").length },
              { label: "Completed",      value: bookings.filter((b) => b.bookingStatus === "completed").length },
              { label: "Pending",        value: bookings.filter((b) => b.bookingStatus === "pending").length },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "12px 20px",
                  minWidth: 100,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: "#E8A020" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#B8C9D9", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Booking cards ── */}
      <Container style={{ padding: "32px 15px 60px" }}>
        {bookings.length === 0 ? (
          <Card
            className="text-center border-0 shadow-sm"
            style={{ borderRadius: 16, padding: "60px 20px" }}
          >
            <div style={{ fontSize: 52 }}>🚫</div>
            <h5 className="mt-3 fw-bold">No Rentals Found</h5>
            <p className="text-muted">You have not booked any vehicle yet.</p>
            <div>
              <Button
                style={{
                  background: "#E8A020",
                  border: "none",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "10px 28px",
                }}
              >
                Browse Vehicles
              </Button>
            </div>
          </Card>
        ) : (
          <Row>
            {bookings.map((b) => (
              <Col lg={6} key={b._id}>
                <BookingCard b={b} onSuccess={handleSuccess} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* ── Rental Success Modal ── */}
      <RentalSuccessModal
        booking={successBooking}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default RentalPage;


