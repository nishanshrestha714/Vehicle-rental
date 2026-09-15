import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMyBookingQuery } from "../Slices/BookingApiSlice";
import {
  useAddReviewMutation,
  useUpdateReviewMutation,
} from "../Slices/VehicleApislice";

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
  Alert,
} from "react-bootstrap";

import {
  FiSearch,
  FiStar,
  FiFileText,
  FiDownload,
  FiEdit2,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { toast } from "react-toastify";

// Get booking status: cancelled, completed, or pending
const getBookingStatus = (b) => {
  if (b?.isCancelled) return "cancelled";
  if (b?.bookingStatus) return "completed";
  return "pending";
};

// Badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "primary";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
};

const FILTERS = ["All", "Pending", "Completed", "Cancelled"];

// Check if booking matches selected filter
const filterMatchesStatus = (filter, status) => {
  if (filter === "All") return true;
  return filter.toLowerCase() === status;
};

// Format date to Nepali locale (en-NP)
const fmt = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-NP") : "N/A";

// Calculate number of rental days (minimum 1)
const daysBetween = (start, end) => {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

// Find current user's review for this vehicle (if any)
const findMyReview = (booking, userId) => {
  if (!userId || !booking) return null;
  const reviews =
    booking.vehicle?.reviews ||
    booking.vehicle?.vehicleId?.reviews ||
    [];
  if (!Array.isArray(reviews)) return null;
  return (
    reviews.find(
      (r) =>
        r.user?.toString() === userId.toString() ||
        r.user?._id?.toString() === userId.toString()
    ) || null
  );
};

// Modal: show full rental details
function RentalDetailsModal({ booking, show, onClose }) {
  if (!booking) return null;

  // Support both array and single image
  const vehicleImage = Array.isArray(booking.vehicle?.image)
    ? booking.vehicle.image[0]?.url
    : booking.vehicle?.image ?? null;

  const status = getBookingStatus(booking);

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Rental Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center gap-3 mb-3">
          {vehicleImage ? (
            <img
              src={vehicleImage}
              alt="vehicle"
              style={{
                width: 80,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center"
              style={{ width: 80, height: 60, borderRadius: 8 }}
            >
              <FaCar size={28} className="text-secondary" />
            </div>
          )}
          <div>
            <h5 className="mb-1">{booking.vehicle?.name ?? "Vehicle"}</h5>
            <Badge bg={getStatusColor(status)}>{status.toUpperCase()}</Badge>
          </div>
        </div>

        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Booking ID</span>
            <strong>{booking._id?.slice(-10).toUpperCase()}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Pickup Date</span>
            <strong>{fmt(booking.bookingPeriod?.start)}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Return Date</span>
            <strong>{fmt(booking.bookingPeriod?.end)}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Total Days</span>
            <strong>{booking.totalDays ?? "N/A"} days</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Pickup Location</span>
            <strong>{booking.pickupLocation ?? "N/A"}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Drop Location</span>
            <strong>{booking.dropLocation ?? "N/A"}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Payment Method</span>
            <strong>{booking.payment?.method ?? "N/A"}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted">Payment Status</span>
            {booking.payment?.isPaid ? (
              <Badge bg="success">Paid</Badge>
            ) : (
              <Badge bg="warning" text="dark">
                Unpaid
              </Badge>
            )}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <span className="text-muted fw-bold">Total Amount</span>
            <strong className="text-danger fs-5">
              Rs {(booking.totalPrice ?? 0).toLocaleString()}
            </strong>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Modal: show invoice + download / print
function InvoiceModal({ booking, show, onClose }) {
  if (!booking) return null;

  const status = getBookingStatus(booking);
  const bookingId = booking._id?.slice(-10).toUpperCase() || "N/A";
  const vehicleName = booking.vehicle?.name ?? "N/A";
  const totalPrice = (booking.totalPrice ?? 0).toLocaleString();

  // Download invoice as HTML file
  //The code builds a full HTML page as a string, then downloads it as a file.
  //Backticks create a template string.
  //They let you insert variables with ${...} (e.g. ${bookingId}, ${vehicleName}).
  //you write multi-line text easily.
  const handleDownloadInvoice = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${bookingId}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
    h1 { text-align: center; margin-bottom: 4px; }
    .meta { text-align: center; color: #666; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; color: #fff; background: #0d6efd; }
    hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    h3 { margin: 18px 0 8px; font-size: 16px; }
    p { margin: 4px 0; }
    .total { background: #f8d7da; padding: 14px 18px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
    .total strong { font-size: 18px; }
    .total span { font-size: 22px; font-weight: bold; color: #dc3545; }
  </style>
</head>
<body>
  <h1>Vehicle Rental Invoice</h1>
  <div class="meta">
    <p>Booking ID: ${bookingId}</p>
    <span class="badge">${status.toUpperCase()}</span>
  </div>
  <hr />
  <h3>Vehicle Information</h3>
  <p><strong>Name:</strong> ${vehicleName}</p>
  <h3>Rental Period</h3>
  <p><strong>Pickup:</strong> ${fmt(booking.bookingPeriod?.start)}</p>
  <p><strong>Return:</strong> ${fmt(booking.bookingPeriod?.end)}</p>
  <p><strong>Duration:</strong> ${booking.totalDays ?? "N/A"} days</p>
  <h3>Locations</h3>
  <p><strong>Pickup:</strong> ${booking.pickupLocation ?? "N/A"}</p>
  <p><strong>Drop:</strong> ${booking.dropLocation ?? "N/A"}</p>
  <h3>Payment</h3>
  <p><strong>Method:</strong> ${booking.payment?.method ?? "N/A"}</p>
  <p><strong>Status:</strong> ${booking.payment?.isPaid ? "Paid" : "Unpaid"}</p>
  <div class="total">
    <strong>Total Amount</strong>
    <span>Rs ${totalPrice}</span>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded!");
  };

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <FiFileText className="me-2" />
          Invoice
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-4">
          <h4 className="fw-bold">Vehicle Rental Invoice</h4>
          <p className="text-muted mb-1">Booking ID: {bookingId}</p>
          <Badge bg={getStatusColor(status)}>{status.toUpperCase()}</Badge>
        </div>
        <hr />
        <h6 className="fw-bold mb-2">Vehicle Information</h6>
        <p className="mb-1">
          <strong>Name:</strong> {vehicleName}
        </p>
        <h6 className="fw-bold mt-3 mb-2">Rental Period</h6>
        <p className="mb-1">
          <strong>Pickup:</strong> {fmt(booking.bookingPeriod?.start)}
        </p>
        <p className="mb-1">
          <strong>Return:</strong> {fmt(booking.bookingPeriod?.end)}
        </p>
        <p className="mb-1">
          <strong>Duration:</strong> {booking.totalDays ?? "N/A"} days
        </p>
        <h6 className="fw-bold mt-3 mb-2">Locations</h6>
        <p className="mb-1">
          <strong>Pickup:</strong> {booking.pickupLocation ?? "N/A"}
        </p>
        <p className="mb-1">
          <strong>Drop:</strong> {booking.dropLocation ?? "N/A"}
        </p>
        <h6 className="fw-bold mt-3 mb-2">Payment</h6>
        <p className="mb-1">
          <strong>Method:</strong> {booking.payment?.method ?? "N/A"}
        </p>
        <p className="mb-1">
          <strong>Status:</strong>{" "}
          {booking.payment?.isPaid ? (
            <Badge bg="success">Paid</Badge>
          ) : (
            <Badge bg="warning" text="dark">
              Unpaid
            </Badge>
          )}
        </p>
        <Alert
          variant="danger"
          className="mt-4 d-flex justify-content-between align-items-center"
        >
          <strong>Total Amount</strong>
          <span className="fs-4 fw-bold">Rs {totalPrice}</span>
        </Alert>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleDownloadInvoice}>
          <FiDownload size={14} className="me-1" />
          Download Invoice
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          Print Invoice
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Modal: add new review or edit existing review
function ReviewModal({ booking, existingReview = null, show, onClose }) {
  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isEditMode = Boolean(existingReview);

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Fill form when editing, clear when adding
  useEffect(() => {
    if (show && existingReview) {
      setTitle(existingReview.title || "");
      setComment(existingReview.comment || "");
      setRating(existingReview.rating || 0);
    } else if (show && !existingReview) {
      setTitle("");
      setComment("");
      setRating(0);
    }
    setHoverRating(0);
  }, [show, existingReview]);

  if (!booking) return null;

  // Support different vehicle id shapes from API
  const vehicleId =
    booking.vehicle?.vehicleId?._id ||
    booking.vehicle?.vehicleId ||
    booking.vehicle?._id;

  const vehicleImage = Array.isArray(booking.vehicle?.image)
    ? booking.vehicle.image[0]?.url
    : booking.vehicle?.image ?? null;

  const isLoading = isAdding || isUpdating;

  const resetForm = () => {
    setTitle("");
    setComment("");
    setRating(0);
    setHoverRating(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validate and submit review (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a review title.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter your review comment.");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    if (!vehicleId) {
      toast.error("Vehicle ID is missing. Cannot submit review.");
      return;
    }

    try {
      if (isEditMode) {
        await updateReview({
          vehicleId,
          reviewId: existingReview._id,
          title: title.trim(),
          comment: comment.trim(),
          rating,
        }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await addReview({
          vehicleId,
          title: title.trim(),
          comment: comment.trim(),
          rating,
        }).unwrap();
        toast.success("Review submitted successfully!");
      }

      resetForm();
      onClose();
    } catch (apiErr) {
      toast.error(
        apiErr?.data?.error ||
          apiErr?.error ||
          (isEditMode
            ? "Could not update your review."
            : "Could not submit your review.")
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Edit Your Review" : "Write a Review"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="d-flex align-items-center gap-3 mb-3">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="vehicle"
                style={{
                  width: 60,
                  height: 45,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 45, borderRadius: 6 }}
              >
                <FaCar size={22} className="text-secondary" />
              </div>
            )}
            <strong>{booking.vehicle?.name ?? "Vehicle"}</strong>
          </div>

          <Form.Label>Your Rating</Form.Label>
          <div className="d-flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <FiStar
                key={n}
                size={28}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                style={{
                  cursor: "pointer",
                  color: (hoverRating || rating) >= n ? "#ffc107" : "#dee2e6",
                  fill: (hoverRating || rating) >= n ? "#ffc107" : "none",
                }}
              />
            ))}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Review Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent vehicle"
              maxLength={100}
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Your Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              maxLength={1000}
              required
              disabled={isLoading}
            />
            <Form.Text className="text-muted">{comment.length}/1000</Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="warning" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                {isEditMode ? "Updating…" : "Submitting…"}
              </>
            ) : (
              <>
                <FiStar size={14} className="me-1" />
                {isEditMode ? "Update Review" : "Submit Review"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

// Single booking card in the list
function BookingCard({
  b,
  userId,
  onView,
  onReview,
  onEditReview,
  onInvoice,
}) {
  const vehicleImage = Array.isArray(b.vehicle?.image)
    ? b.vehicle.image[0]?.url
    : b.vehicle?.image ?? null;

  const status = getBookingStatus(b);
  const duration =
    b.totalDays ?? daysBetween(b.bookingPeriod?.start, b.bookingPeriod?.end);
  const isCompleted = status === "completed";

  const myReview = findMyReview(b, userId);
  const hasReview = Boolean(myReview);

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <FaCar className="text-primary" />
            {b.vehicle?.name ?? "Unknown Vehicle"}
          </h5>
          <Badge bg={getStatusColor(status)} pill>
            {status.toUpperCase()}
          </Badge>
        </div>

        <Row className="g-3">
          <Col xs={12} md={3} className="text-center">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="vehicle"
                className="img-fluid rounded"
                style={{ maxHeight: 120, objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ height: 110 }}
              >
                <FaCar size={36} className="text-secondary" />
              </div>
            )}
          </Col>

          <Col xs={12} md={9}>
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Pickup:</span>
                <strong>{fmt(b.bookingPeriod?.start)}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Return:</span>
                <strong>{fmt(b.bookingPeriod?.end)}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Days:</span>
                <strong>{duration ?? "N/A"} days</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Pickup Location:</span>
                <strong>{b.pickupLocation ?? "N/A"}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Drop Location:</span>
                <strong>{b.dropLocation ?? "N/A"}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-1 border-0">
                <span className="text-muted me-2">Payment:</span>
                {b.payment?.isPaid ? (
                  <Badge bg="success">Paid</Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Unpaid
                  </Badge>
                )}
              </ListGroup.Item>
              <ListGroup.Item className="px-0 py-2 border-0">
                <span className="text-muted me-2">Total Price:</span>
                <strong className="text-danger fs-5">
                  रू {(b.totalPrice ?? 0).toLocaleString()}
                </strong>
              </ListGroup.Item>
            </ListGroup>

            {/* Action buttons */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onView(b)}
              >
                View Details
              </Button>

              {/* Review + Invoice only for completed rentals */}
              {isCompleted && (
                <>
                  {!hasReview ? (
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => onReview(b)}
                    >
                      <FiStar size={13} className="me-1" />
                      Write Review
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => onEditReview(b, myReview)}
                    >
                      <FiEdit2 size={13} className="me-1" />
                      Edit Review
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => onInvoice(b)}
                  >
                    <FiFileText size={13} className="me-1" />
                    View Invoice
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

// Main page: list of user's rentals
function RentalPage() {
  const { data, isLoading, error } = useGetMyBookingQuery();

  const { userInfo } = useSelector((state) => state.auth || {});
  const userId = userInfo?._id;

  // Modal states
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  // Filters & sort
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const bookings = data?.MyBooking || [];

  // Filter by status + search, then sort by date
  const filteredBookings = useMemo(() => {
    let list = bookings.filter((b) =>
      filterMatchesStatus(filter, getBookingStatus(b))
    );

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) =>
        String(b.vehicle?.name || "")
          .toLowerCase()
          .includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt || a.bookingPeriod?.start || 0).getTime();
      const db = new Date(b.createdAt || b.bookingPeriod?.start || 0).getTime();
      return sort === "newest" ? db - da : da - db;
    });

    return list;
  }, [bookings, filter, search, sort]);

  // Open review modal in add mode
  const handleOpenReview = (booking) => {
    setReviewingBooking(booking);
    setExistingReview(null);
  };

  // Open review modal in edit mode
  const handleOpenEditReview = (booking, review) => {
    setReviewingBooking(booking);
    setExistingReview(review);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Loading your rentals…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">Failed to load rentals</h4>
        <p className="text-muted">Please try refreshing the page.</p>
      </Container>
    );
  }

  return (
    <>
      {/* Header + search + stats + filters */}
      <div className="bg-dark text-white py-4 mb-4">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <FaCar />
                My Rental Dashboard
              </h2>
              <p className="mb-0 text-white-50">
                Manage your bookings and payments
              </p>
            </div>

            <div style={{ maxWidth: 280, width: "100%" }}>
              <div className="position-relative">
                <FiSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  size={16}
                />
                <Form.Control
                  placeholder="Search vehicle…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-5 rounded-pill"
                />
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <Row className="g-3 mt-3">
            {[
              { label: "Total", value: bookings.length },
              {
                label: "Completed",
                value: bookings.filter(
                  (b) => getBookingStatus(b) === "completed"
                ).length,
              },
              {
                label: "Pending",
                value: bookings.filter((b) => getBookingStatus(b) === "pending")
                  .length,
              },
              {
                label: "Cancelled",
                value: bookings.filter(
                  (b) => getBookingStatus(b) === "cancelled"
                ).length,
              },
            ].map((item) => (
              <Col key={item.label} xs={6} md={3}>
                <Card className="bg-secondary bg-opacity-25 border-0 text-center py-2">
                  <div className="fs-4 fw-bold text-warning">{item.value}</div>
                  <small className="text-white-50">{item.label}</small>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Status filters + sort */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
            <div className="d-flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "warning" : "outline-light"}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>

            <Form.Select
              size="sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: 150 }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Form.Select>
          </div>
        </Container>
      </div>

      {/* Booking list */}
      <Container className="pb-5">
        {filteredBookings.length === 0 ? (
          <Card className="text-center border-0 shadow-sm py-5">
            <Card.Body>
              <FaCar size={48} className="text-muted mb-3" />
              <h5 className="mt-3">No Rentals Found</h5>
              <p className="text-muted">
                {bookings.length === 0
                  ? "You have not booked any vehicle yet."
                  : "No rentals match this filter or search."}
              </p>
              <Button variant="warning">Browse Vehicles</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {filteredBookings.map((b) => (
              <Col lg={6} key={b._id}>
                <BookingCard
                  b={b}
                  userId={userId}
                  onView={setDetailsBooking}
                  onReview={handleOpenReview}
                  onEditReview={handleOpenEditReview}
                  onInvoice={setInvoiceBooking}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modals */}
      <RentalDetailsModal
        booking={detailsBooking}
        show={!!detailsBooking}
        onClose={() => setDetailsBooking(null)}
      />

      <InvoiceModal
        booking={invoiceBooking}
        show={!!invoiceBooking}
        onClose={() => setInvoiceBooking(null)}
      />

      <ReviewModal
        booking={reviewingBooking}
        existingReview={existingReview}
        show={!!reviewingBooking}
        onClose={() => {
          setReviewingBooking(null);
          setExistingReview(null);
        }}
      />
    </>
  );
}

export default RentalPage;