import { useMemo, useState } from "react";
import {
  useGetMyBookingQuery,
  useUpdateBookingMutation,
  useCancelBookingMutation,
} from "../Slices/BookingApiSlice";
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
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiXCircle,
  FiStar,
  FiFileText,
} from "react-icons/fi";

// ── helpers ──────────────────────────────────────────────────────
const getStatusColor = (status) => {
  switch (status) {
    case "accepted":
    case "confirmed":  return "success";
    case "active":      return "info";
    case "completed":   return "primary";
    case "cancelled":
    case "rejected":    return "danger";
    default:            return "warning"; // pending
  }
};

const FILTERS = ["All", "Upcoming", "Active", "Completed", "Cancelled"];

const filterMatchesStatus = (filter, status) => {
  if (filter === "All") return true;
  const map = {
    Upcoming: ["pending", "accepted", "confirmed"],
    Active: ["active"],
    Completed: ["completed"],
    Cancelled: ["cancelled", "rejected"],
  };
  return map[filter]?.includes((status || "pending").toLowerCase());
};

const fmt = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-NP") : "N/A";

const daysBetween = (start, end) => {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

//  RentalSuccessModal  ────────────────────────────────────────────
// mode="success" -> shown right after booking succeeds
// mode="details" -> shown from the "View Details" button on an existing rental
function RentalSuccessModal({ booking, show, onClose, mode = "success" }) {
  if (!booking) return null;

  const vehicleImage = Array.isArray(booking.vehicle?.image)
    ? booking.vehicle.image[0]?.url
    : booking.vehicle?.image ?? null;

  const isDetails = mode === "details";

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Body style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}>

        {/* Header */}
        <div
          style={{
            background: isDetails
              ? "linear-gradient(135deg, #0F1923 0%, #2E4057 100%)"
              : "linear-gradient(135deg, #1a7a4a 0%, #145c37 100%)",
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
            {isDetails ? "🚗" : "✓"}
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
            {isDetails ? "Rental Details" : "Rental Successful!"}
          </h4>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6, marginBottom: 0 }}>
            {isDetails ? "Full booking and payment breakdown" : "Your vehicle has been booked successfully"}
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
              background: isDetails ? "#0F1923" : "#1a7a4a",
              border: "none",
              fontWeight: 700,
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 14,
            }}
          >
            {isDetails ? "Close" : "Done"}
          </Button>
          {!isDetails && (
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
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

//  EditBookingModal  ────────────────────────────────────────────
function EditBookingModal({ booking, show, onClose }) {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();
  const [form, setForm] = useState(() => ({
    start: booking?.bookingPeriod?.start?.slice(0, 10) || "",
    end: booking?.bookingPeriod?.end?.slice(0, 10) || "",
    pickupLocation: booking?.pickupLocation || "",
    dropLocation: booking?.dropLocation || "",
  }));
  const [err, setErr] = useState("");

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (new Date(form.start) >= new Date(form.end)) {
      setErr("Start date must be before end date.");
      return;
    }
    try {
      // Backend must re-run the vehicle availability/overlap check on update
      // and reject with 400 if the vehicle is already booked for the new dates.
      await updateBooking({
        id: booking._id,
        bookingPeriod: { start: form.start, end: form.end },
        pickupLocation: form.pickupLocation,
        dropLocation: form.dropLocation,
      }).unwrap();
      onClose();
    } catch (apiErr) {
      setErr(apiErr?.data?.error || "This vehicle is already booked for the selected dates.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19 }}>
          Edit Rental
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ padding: "20px 24px" }}>
          {err && (
            <div
              style={{
                background: "#FBE3E0",
                color: "#c0392b",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13.5,
                marginBottom: 14,
              }}
            >
              {err}
            </div>
          )}
          <Row className="g-3">
            <Col sm={6}>
              <Form.Label style={{ fontSize: 13, color: "#6B8099" }}>Start date</Form.Label>
              <Form.Control
                type="date"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                required
              />
            </Col>
            <Col sm={6}>
              <Form.Label style={{ fontSize: 13, color: "#6B8099" }}>End date</Form.Label>
              <Form.Control
                type="date"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                required
              />
            </Col>
            <Col sm={6}>
              <Form.Label style={{ fontSize: 13, color: "#6B8099" }}>Pickup location</Form.Label>
              <Form.Control
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                required
              />
            </Col>
            <Col sm={6}>
              <Form.Label style={{ fontSize: 13, color: "#6B8099" }}>Return location</Form.Label>
              <Form.Control
                value={form.dropLocation}
                onChange={(e) => setForm({ ...form, dropLocation: e.target.value })}
                required
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Discard</Button>
          <Button
            type="submit"
            disabled={isLoading}
            style={{ background: "#E8A020", border: "none", fontWeight: 700 }}
          >
            {isLoading ? "Saving…" : "Save changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

//  CancelConfirmModal  ──────────────────────────────────────────
function CancelConfirmModal({ booking, show, onClose }) {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  if (!booking) return null;

  const handleCancel = async () => {
    await cancelBooking(booking._id).unwrap();
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body style={{ padding: "28px 26px", textAlign: "center" }}>
        <FiXCircle size={36} color="#c0392b" />
        <h5 style={{ fontFamily: "'Playfair Display', Georgia, serif", margin: "14px 0 6px" }}>
          Cancel this rental?
        </h5>
        <p style={{ color: "#6B8099", fontSize: 13.5, marginBottom: 20 }}>
          This can't be undone. The rental will be marked as cancelled.
        </p>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="flex-fill" onClick={onClose}>
            Keep rental
          </Button>
          <Button
            className="flex-fill"
            disabled={isLoading}
            style={{ background: "#c0392b", border: "none", fontWeight: 700 }}
            onClick={handleCancel}
          >
            {isLoading ? "Cancelling…" : "Cancel rental"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ── BookingCard ────────────────────────────────────────────────────
function BookingCard({ b, onView, onEdit, onCancel }) {
  const vehicleImage = Array.isArray(b.vehicle?.image)
    ? b.vehicle.image[0]?.url
    : b.vehicle?.image ?? null;

  const status = (b.bookingStatus || "pending").toLowerCase();
  const duration = b.totalDays ?? daysBetween(b.bookingPeriod?.start, b.bookingPeriod?.end);
  const canEdit = ["pending", "accepted", "confirmed"].includes(status);
  const canCancel = ["pending", "accepted", "confirmed"].includes(status);
  const isCompleted = status === "completed";

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
            status === "accepted" || status === "confirmed" ? "#1a7a4a"
            : status === "active" ? "#0F1923"
            : status === "completed" ? "#0d6efd"
            : status === "cancelled" || status === "rejected" ? "#c0392b"
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
            bg={getStatusColor(status)}
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20 }}
          >
            {status.toUpperCase()}
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
                { label: "Total Days",       value: `${duration ?? "N/A"} days` },
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
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => onView(b)}
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                View Details
              </Button>

              {canEdit && (
                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => onEdit(b)}
                  style={{ borderRadius: 8, fontSize: 13 }}
                >
                  <FiEdit2 size={12} /> Edit
                </Button>
              )}

              {canCancel && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onCancel(b)}
                  style={{ borderRadius: 8, fontSize: 13 }}
                >
                  Cancel
                </Button>
              )}

              {isCompleted && (
                <>
                  <Button size="sm" variant="outline-warning" style={{ borderRadius: 8, fontSize: 13 }}>
                    <FiStar size={12} /> Write a Review
                  </Button>
                  <Button size="sm" variant="outline-secondary" style={{ borderRadius: 8, fontSize: 13 }}>
                    <FiFileText size={12} /> View Invoice
                  </Button>
                </>
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
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("success");

  const [editingBooking, setEditingBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const bookings = data?.MyBooking || [];

  const handleSuccess = (booking) => {
    setSuccessBooking(booking);
    setModalMode("success");
    setShowModal(true);
  };

  const handleView = (booking) => {
    setSuccessBooking(booking);
    setModalMode("details");
    setShowModal(true);
  };

  const filteredBookings = useMemo(() => {
    let list = bookings.filter((b) => filterMatchesStatus(filter, b.bookingStatus));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => (b.vehicle?.name || "").toLowerCase().includes(q));
    }

    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt || a.bookingPeriod?.start || 0).getTime();
      const db = new Date(b.createdAt || b.bookingPeriod?.start || 0).getTime();
      return sort === "newest" ? db - da : da - db;
    });

    return list;
  }, [bookings, filter, search, sort]);

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
      {/*  Page header  */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F1923 0%, #2E4057 100%)",
          borderBottom: "4px solid #E8A020",
          padding: "36px 0 28px",
        }}
      >
        <Container>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
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
            </div>

            <InputGroup style={{ maxWidth: 260 }}>
              <InputGroup.Text style={{ background: "#fff" }}>
                <FiSearch size={14} color="#6B8099" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search vehicle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Stats row */}
          <div className="d-flex gap-3 mt-4 flex-wrap">
            {[
              { label: "Total Bookings", value: bookings.length },
              { label: "Active",         value: bookings.filter((b) => ["accepted", "active"].includes((b.bookingStatus || "").toLowerCase())).length },
              { label: "Completed",      value: bookings.filter((b) => (b.bookingStatus || "").toLowerCase() === "completed").length },
              { label: "Pending",        value: bookings.filter((b) => (b.bookingStatus || "pending").toLowerCase() === "pending").length },
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

          {/* Filter tabs + sort */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
            <div className="d-flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: filter === f ? "#E8A020" : "rgba(255,255,255,0.08)",
                    color: filter === f ? "#0F1923" : "#B8C9D9",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <Form.Select
              size="sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: 140 }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Form.Select>
          </div>
        </Container>
      </div>

      {/*  Booking cards  */}
      <Container style={{ padding: "32px 15px 60px" }}>
        {filteredBookings.length === 0 ? (
          <Card
            className="text-center border-0 shadow-sm"
            style={{ borderRadius: 16, padding: "60px 20px" }}
          >
            <div style={{ fontSize: 52 }}>🚫</div>
            <h5 className="mt-3 fw-bold">No Rentals Found</h5>
            <p className="text-muted">
              {bookings.length === 0
                ? "You have not booked any vehicle yet."
                : "No rentals match this filter or search."}
            </p>
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
            {filteredBookings.map((b) => (
              <Col lg={6} key={b._id}>
                <BookingCard
                  b={b}
                  onView={handleView}
                  onEdit={setEditingBooking}
                  onCancel={setCancellingBooking}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/*  Modals  */}
      <RentalSuccessModal
        booking={successBooking}
        show={showModal}
        mode={modalMode}
        onClose={() => setShowModal(false)}
      />
      <EditBookingModal
        booking={editingBooking}
        show={!!editingBooking}
        onClose={() => setEditingBooking(null)}
      />
      <CancelConfirmModal
        booking={cancellingBooking}
        show={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
      />
    </>
  );
}

export default RentalPage;