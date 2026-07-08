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












// import { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Badge,
//   Button,
//   Form,
//   InputGroup,
// } from "react-bootstrap";

// // ─── Design tokens ────────────────────────────────────────────────
// const C = {
//   ink: "#0F1923",
//   smoke: "#1E2D3D",
//   slate: "#2E4057",
//   mist: "#6B8099",
//   fog: "#B8C9D9",
//   ghost: "#EEF3F8",
//   paper: "#F7F9FB",
//   white: "#FFFFFF",
//   saffron: "#E8A020",
//   saffronLight: "#FDF3E0",
//   crimson: "#C0392B",
//   jade: "#1A7A4A",
//   jadeLight: "#E6F5ED",
// };

// const T = {
//   display: "'Playfair Display', Georgia, serif",
//   body: "'Inter', system-ui, sans-serif",
// };

// // ─── Sample data ───────────────────────────────────────────────────
// const VEHICLES = [
//   {
//     id: 1,
//     name: "Toyota Hiace",
//     category: "Van",
//     license: "B",
//     seats: 12,
//     fuel: "Diesel",
//     priceDay: 4500,
//     priceHr: 650,
//     location: "Kathmandu",
//     available: true,
//     plate: "BA 1 KHA 2345",
//     image: "🚐",
//     rating: 4.8,
//     reviews: 124,
//     features: ["AC", "GPS", "Music System"],
//   },
//   {
//     id: 2,
//     name: "Maruti Swift",
//     category: "Car",
//     license: "B",
//     seats: 5,
//     fuel: "Petrol",
//     priceDay: 2200,
//     priceHr: 320,
//     location: "Lalitpur",
//     available: true,
//     plate: "BA 2 CHA 5678",
//     image: "🚗",
//     rating: 4.6,
//     reviews: 89,
//     features: ["AC", "Music System", "Bluetooth"],
//   },
//   {
//     id: 3,
//     name: "Hero Splendor Plus",
//     category: "Motorcycle",
//     license: "A",
//     seats: 2,
//     fuel: "Petrol",
//     priceDay: 800,
//     priceHr: 120,
//     location: "Bhaktapur",
//     available: false,
//     plate: "BA 3 GA 9012",
//     image: "🏍️",
//     rating: 4.5,
//     reviews: 67,
//     features: ["Helmet Included"],
//   },
//   {
//     id: 4,
//     name: "Tata Sumo",
//     category: "SUV",
//     license: "B",
//     seats: 7,
//     fuel: "Diesel",
//     priceDay: 3800,
//     priceHr: 550,
//     location: "Kathmandu",
//     available: true,
//     plate: "BA 1 NGA 3456",
//     image: "🚙",
//     rating: 4.3,
//     reviews: 45,
//     features: ["AC", "4WD", "GPS"],
//   },
//   {
//     id: 5,
//     name: "Mahindra Bolero",
//     category: "SUV",
//     license: "B",
//     seats: 7,
//     fuel: "Diesel",
//     priceDay: 3500,
//     priceHr: 500,
//     location: "Kathmandu",
//     available: true,
//     plate: "BA 2 PA 7890",
//     image: "🚙",
//     rating: 4.4,
//     reviews: 58,
//     features: ["AC", "Music System"],
//   },
//   {
//     id: 6,
//     name: "Yamaha FZ-S",
//     category: "Motorcycle",
//     license: "A",
//     seats: 2,
//     fuel: "Petrol",
//     priceDay: 1000,
//     priceHr: 150,
//     location: "Lalitpur",
//     available: true,
//     plate: "BA 1 BA 1234",
//     image: "🏍️",
//     rating: 4.7,
//     reviews: 92,
//     features: ["Helmet Included", "Fuel Full"],
//   },
// ];

// const CATEGORIES = ["All", "Car", "SUV", "Van", "Motorcycle"];
// const LOCATIONS = ["All Locations", "Kathmandu", "Lalitpur", "Bhaktapur"];

// // ─── Sub-components ────────────────────────────────────────────────
// function StarRating({ rating }) {
//   return (
//     <span style={{ color: C.saffron, fontSize: 13 }}>
//       {"★".repeat(Math.floor(rating))}
//       {"☆".repeat(5 - Math.floor(rating))}
//       <span style={{ color: C.mist, fontFamily: T.body, marginLeft: 4 }}>
//         {rating}
//       </span>
//     </span>
//   );
// }

// function VehicleCard({ v, onBook }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Card
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         border: hovered ? `1.5px solid ${C.saffron}` : `1.5px solid ${C.fog}`,
//         borderRadius: 16,
//         overflow: "hidden",
//         boxShadow: hovered
//           ? "0 8px 32px rgba(15,25,35,0.13)"
//           : "0 2px 8px rgba(15,25,35,0.06)",
//         transition: "all 0.22s ease",
//         background: C.white,
//         cursor: "pointer",
//         transform: hovered ? "translateY(-3px)" : "translateY(0)",
//       }}
//     >
//       {/* Availability ribbon */}
//       <div
//         style={{
//           position: "absolute",
//           top: 14,
//           right: 14,
//           zIndex: 2,
//         }}
//       >
//         <span
//           style={{
//             background: v.available ? C.jade : C.crimson,
//             color: C.white,
//             fontSize: 11,
//             fontFamily: T.body,
//             fontWeight: 600,
//             padding: "3px 10px",
//             borderRadius: 20,
//             letterSpacing: 0.5,
//           }}
//         >
//           {v.available ? "Available" : "Booked"}
//         </span>
//       </div>

//       {/* Vehicle visual */}
//       <div
//         style={{
//           background: `linear-gradient(135deg, ${C.ghost} 0%, ${C.saffronLight} 100%)`,
//           height: 150,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 64,
//           position: "relative",
//         }}
//       >
//         {v.image}
//         <div
//           style={{
//             position: "absolute",
//             bottom: 10,
//             left: 14,
//             background: C.white,
//             borderRadius: 8,
//             padding: "3px 10px",
//             fontSize: 11,
//             fontFamily: T.body,
//             fontWeight: 600,
//             color: C.slate,
//             border: `1px solid ${C.fog}`,
//             letterSpacing: 0.3,
//           }}
//         >
//           {v.plate}
//         </div>
//       </div>

//       <Card.Body style={{ padding: "18px 20px 20px" }}>
//         {/* Header row */}
//         <div className="d-flex justify-content-between align-items-start mb-1">
//           <div>
//             <h5
//               style={{
//                 fontFamily: T.display,
//                 fontWeight: 700,
//                 fontSize: 17,
//                 color: C.ink,
//                 margin: 0,
//                 lineHeight: 1.2,
//               }}
//             >
//               {v.name}
//             </h5>
//             <span
//               style={{
//                 fontFamily: T.body,
//                 fontSize: 12,
//                 color: C.mist,
//                 fontWeight: 500,
//               }}
//             >
//               {v.category} · {v.fuel} · {v.seats} seats
//             </span>
//           </div>
//           <span
//             style={{
//               background: C.saffronLight,
//               color: C.saffron,
//               fontFamily: T.body,
//               fontWeight: 700,
//               fontSize: 11,
//               padding: "3px 9px",
//               borderRadius: 8,
//               whiteSpace: "nowrap",
//               border: `1px solid ${C.saffron}30`,
//             }}
//           >
//             License {v.license}
//           </span>
//         </div>

//         {/* Rating */}
//         <div className="mb-2 mt-1">
//           <StarRating rating={v.rating} />
//           <span
//             style={{
//               fontFamily: T.body,
//               fontSize: 11,
//               color: C.mist,
//               marginLeft: 6,
//             }}
//           >
//             ({v.reviews} reviews)
//           </span>
//         </div>

//         {/* Features */}
//         <div className="d-flex flex-wrap gap-1 mb-3">
//           {v.features.map((f) => (
//             <span
//               key={f}
//               style={{
//                 background: C.ghost,
//                 color: C.slate,
//                 fontSize: 11,
//                 fontFamily: T.body,
//                 fontWeight: 500,
//                 padding: "2px 9px",
//                 borderRadius: 6,
//               }}
//             >
//               {f}
//             </span>
//           ))}
//         </div>

//         {/* Location */}
//         <div
//           className="d-flex align-items-center mb-3"
//           style={{ fontFamily: T.body, fontSize: 12, color: C.mist }}
//         >
//           <span style={{ marginRight: 5 }}>📍</span> {v.location}
//         </div>

//         {/* Pricing + CTA */}
//         <div
//           style={{
//             borderTop: `1px solid ${C.ghost}`,
//             paddingTop: 14,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontFamily: T.display,
//                 fontWeight: 700,
//                 fontSize: 20,
//                 color: C.ink,
//                 lineHeight: 1,
//               }}
//             >
//               रू {v.priceDay.toLocaleString()}
//               <span
//                 style={{
//                   fontFamily: T.body,
//                   fontSize: 11,
//                   fontWeight: 400,
//                   color: C.mist,
//                 }}
//               >
//                 /day
//               </span>
//             </div>
//             <div
//               style={{
//                 fontFamily: T.body,
//                 fontSize: 11,
//                 color: C.mist,
//                 marginTop: 1,
//               }}
//             >
//               रू {v.priceHr}/hr
//             </div>
//           </div>

//           <Button
//             disabled={!v.available}
//             onClick={() => v.available && onBook(v)}
//             style={{
//               background: v.available ? C.saffron : C.fog,
//               border: "none",
//               color: v.available ? C.ink : C.mist,
//               fontFamily: T.body,
//               fontWeight: 700,
//               fontSize: 13,
//               padding: "9px 20px",
//               borderRadius: 10,
//               letterSpacing: 0.2,
//               cursor: v.available ? "pointer" : "not-allowed",
//               transition: "background 0.15s",
//             }}
//           >
//             {v.available ? "Book Now" : "Unavailable"}
//           </Button>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }

// // ─── Main page ─────────────────────────────────────────────────────
// export default function RentalPage() {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [location, setLocation] = useState("All Locations");
//   const [availability, setAvailability] = useState("all");
//   const [bookedVehicle, setBookedVehicle] = useState(null);

//   const filtered = VEHICLES.filter((v) => {
//     const matchSearch =
//       v.name.toLowerCase().includes(search.toLowerCase()) ||
//       v.plate.toLowerCase().includes(search.toLowerCase());
//     const matchCat = category === "All" || v.category === category;
//     const matchLoc =
//       location === "All Locations" || v.location === location;
//     const matchAvail =
//       availability === "all" ||
//       (availability === "available" && v.available) ||
//       (availability === "booked" && !v.available);
//     return matchSearch && matchCat && matchLoc && matchAvail;
//   });

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: C.paper,
//         fontFamily: T.body,
//       }}
//     >
//       {/* ── Header ── */}
//       <div
//         style={{
//           background: `linear-gradient(135deg, ${C.ink} 0%, ${C.slate} 100%)`,
//           padding: "48px 0 36px",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         {/* Decorative saffron stripe (Nepal flag nod) */}
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             height: 4,
//             background: C.saffron,
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             height: 1,
//             background: `${C.saffron}30`,
//           }}
//         />

//         <Container>
//           <Row className="align-items-center">
//             <Col md={8}>
//               <p
//                 style={{
//                   fontFamily: T.body,
//                   fontSize: 12,
//                   letterSpacing: 2,
//                   color: C.saffron,
//                   fontWeight: 600,
//                   textTransform: "uppercase",
//                   marginBottom: 8,
//                 }}
//               >
//                 Drivex Vehicle Rental · Nepal
//               </p>
//               <h1
//                 style={{
//                   fontFamily: T.display,
//                   fontWeight: 700,
//                   fontSize: "clamp(28px, 4vw, 42px)",
//                   color: C.white,
//                   margin: 0,
//                   lineHeight: 1.15,
//                 }}
//               >
//                 Find Your Perfect
//                 <br />
//                 <span style={{ color: C.saffron }}>Ride Across Nepal</span>
//               </h1>
//               <p
//                 style={{
//                   color: C.fog,
//                   fontSize: 14,
//                   marginTop: 12,
//                   marginBottom: 0,
//                   maxWidth: 480,
//                   lineHeight: 1.7,
//                 }}
//               >
//                 Cars, SUVs, vans & motorcycles available across Kathmandu
//                 Valley. Verified drivers, eSewa payments, instant booking.
//               </p>
//             </Col>
//             <Col md={4} className="text-md-end mt-3 mt-md-0">
//               <div
//                 style={{
//                   display: "inline-block",
//                   background: `${C.white}10`,
//                   border: `1px solid ${C.white}20`,
//                   borderRadius: 14,
//                   padding: "16px 24px",
//                   backdropFilter: "blur(8px)",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontFamily: T.display,
//                     fontSize: 32,
//                     fontWeight: 700,
//                     color: C.white,
//                     lineHeight: 1,
//                   }}
//                 >
//                   {VEHICLES.filter((v) => v.available).length}
//                 </div>
//                 <div
//                   style={{ fontSize: 12, color: C.fog, marginTop: 2 }}
//                 >
//                   Vehicles Available
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* ── Filters ── */}
//       <div
//         style={{
//           background: C.white,
//           borderBottom: `1px solid ${C.fog}`,
//           padding: "20px 0",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//           boxShadow: "0 2px 12px rgba(15,25,35,0.06)",
//         }}
//       >
//         <Container>
//           <Row className="g-2 align-items-center">
//             <Col md={4}>
//               <InputGroup>
//                 <InputGroup.Text
//                   style={{
//                     background: C.ghost,
//                     border: `1px solid ${C.fog}`,
//                     borderRight: "none",
//                     color: C.mist,
//                     fontSize: 14,
//                   }}
//                 >
//                   🔍
//                 </InputGroup.Text>
//                 <Form.Control
//                   placeholder="Search by name or plate…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   style={{
//                     background: C.ghost,
//                     border: `1px solid ${C.fog}`,
//                     borderLeft: "none",
//                     fontFamily: T.body,
//                     fontSize: 13,
//                     color: C.ink,
//                   }}
//                 />
//               </InputGroup>
//             </Col>

//             <Col md={2}>
//               <Form.Select
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 style={{
//                   fontFamily: T.body,
//                   fontSize: 13,
//                   border: `1px solid ${C.fog}`,
//                   background: C.ghost,
//                   color: C.ink,
//                   borderRadius: 8,
//                 }}
//               >
//                 {LOCATIONS.map((l) => (
//                   <option key={l}>{l}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col md={2}>
//               <Form.Select
//                 value={availability}
//                 onChange={(e) => setAvailability(e.target.value)}
//                 style={{
//                   fontFamily: T.body,
//                   fontSize: 13,
//                   border: `1px solid ${C.fog}`,
//                   background: C.ghost,
//                   color: C.ink,
//                   borderRadius: 8,
//                 }}
//               >
//                 <option value="all">All Status</option>
//                 <option value="available">Available</option>
//                 <option value="booked">Booked</option>
//               </Form.Select>
//             </Col>

//             <Col md={4}>
//               <div className="d-flex gap-2 flex-wrap">
//                 {CATEGORIES.map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => setCategory(cat)}
//                     style={{
//                       background:
//                         category === cat ? C.saffron : C.ghost,
//                       color: category === cat ? C.ink : C.mist,
//                       border:
//                         category === cat
//                           ? `1px solid ${C.saffron}`
//                           : `1px solid ${C.fog}`,
//                       borderRadius: 8,
//                       padding: "6px 14px",
//                       fontSize: 12,
//                       fontFamily: T.body,
//                       fontWeight: 600,
//                       cursor: "pointer",
//                       transition: "all 0.15s",
//                     }}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* ── Vehicle Grid ── */}
//       <Container style={{ padding: "32px 15px 60px" }}>
//         {/* Results count */}
//         <div
//           className="d-flex justify-content-between align-items-center mb-4"
//         >
//           <p
//             style={{
//               fontFamily: T.body,
//               fontSize: 13,
//               color: C.mist,
//               margin: 0,
//             }}
//           >
//             Showing{" "}
//             <strong style={{ color: C.ink }}>{filtered.length}</strong>{" "}
//             vehicle{filtered.length !== 1 ? "s" : ""}
//           </p>
//           <span
//             style={{
//               fontFamily: T.body,
//               fontSize: 12,
//               color: C.mist,
//             }}
//           >
//             Prices in Nepalese Rupees (NPR)
//           </span>
//         </div>

//         {filtered.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "80px 20px",
//               color: C.mist,
//             }}
//           >
//             <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
//             <p style={{ fontFamily: T.display, fontSize: 20, color: C.slate }}>
//               No vehicles match your filters
//             </p>
//             <p style={{ fontSize: 13 }}>
//               Try adjusting your search or category.
//             </p>
//           </div>
//         ) : (
//           <Row className="g-4">
//             {filtered.map((v) => (
//               <Col key={v.id} sm={6} lg={4}>
//                 <VehicleCard v={v} onBook={setBookedVehicle} />
//               </Col>
//             ))}
//           </Row>
//         )}
//       </Container>

//       {/* ── Booking Modal (lightweight inline) ── */}
//       {bookedVehicle && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(15,25,35,0.65)",
//             zIndex: 999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 16,
//           }}
//           onClick={(e) =>
//             e.target === e.currentTarget && setBookedVehicle(null)
//           }
//         >
//           <div
//             style={{
//               background: C.white,
//               borderRadius: 20,
//               width: "100%",
//               maxWidth: 440,
//               overflow: "hidden",
//               boxShadow: "0 24px 64px rgba(15,25,35,0.22)",
//             }}
//           >
//             {/* Modal header */}
//             <div
//               style={{
//                 background: `linear-gradient(135deg, ${C.ink} 0%, ${C.slate} 100%)`,
//                 padding: "24px 28px 20px",
//                 borderBottom: `3px solid ${C.saffron}`,
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <p
//                     style={{
//                       fontFamily: T.body,
//                       fontSize: 11,
//                       color: C.saffron,
//                       fontWeight: 600,
//                       letterSpacing: 1.5,
//                       textTransform: "uppercase",
//                       margin: 0,
//                     }}
//                   >
//                     Confirm Booking
//                   </p>
//                   <h4
//                     style={{
//                       fontFamily: T.display,
//                       color: C.white,
//                       fontWeight: 700,
//                       margin: "6px 0 0",
//                       fontSize: 22,
//                     }}
//                   >
//                     {bookedVehicle.image} {bookedVehicle.name}
//                   </h4>
//                 </div>
//                 <button
//                   onClick={() => setBookedVehicle(null)}
//                   style={{
//                     background: `${C.white}15`,
//                     border: "none",
//                     color: C.white,
//                     width: 32,
//                     height: 32,
//                     borderRadius: 8,
//                     fontSize: 16,
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* Modal body */}
//             <div style={{ padding: "24px 28px" }}>
//               <Row className="g-3 mb-3">
//                 <Col>
//                   <label
//                     style={{
//                       fontFamily: T.body,
//                       fontSize: 12,
//                       fontWeight: 600,
//                       color: C.mist,
//                       display: "block",
//                       marginBottom: 6,
//                     }}
//                   >
//                     Pick-up Date
//                   </label>
//                   <Form.Control
//                     type="date"
//                     style={{
//                       border: `1.5px solid ${C.fog}`,
//                       borderRadius: 10,
//                       fontFamily: T.body,
//                       fontSize: 13,
//                     }}
//                   />
//                 </Col>
//                 <Col>
//                   <label
//                     style={{
//                       fontFamily: T.body,
//                       fontSize: 12,
//                       fontWeight: 600,
//                       color: C.mist,
//                       display: "block",
//                       marginBottom: 6,
//                     }}
//                   >
//                     Return Date
//                   </label>
//                   <Form.Control
//                     type="date"
//                     style={{
//                       border: `1.5px solid ${C.fog}`,
//                       borderRadius: 10,
//                       fontFamily: T.body,
//                       fontSize: 13,
//                     }}
//                   />
//                 </Col>
//               </Row>

//               {/* Summary */}
//               <div
//                 style={{
//                   background: C.ghost,
//                   borderRadius: 12,
//                   padding: "16px 18px",
//                   marginBottom: 20,
//                 }}
//               >
//                 <div className="d-flex justify-content-between mb-2">
//                   <span
//                     style={{ fontSize: 13, color: C.mist, fontFamily: T.body }}
//                   >
//                     Daily Rate
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: C.ink,
//                       fontWeight: 600,
//                       fontFamily: T.body,
//                     }}
//                   >
//                     रू {bookedVehicle.priceDay.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span
//                     style={{ fontSize: 13, color: C.mist, fontFamily: T.body }}
//                   >
//                     Location
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: C.ink,
//                       fontWeight: 600,
//                       fontFamily: T.body,
//                     }}
//                   >
//                     {bookedVehicle.location}
//                   </span>
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <span
//                     style={{ fontSize: 13, color: C.mist, fontFamily: T.body }}
//                   >
//                     License Required
//                   </span>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: C.jade,
//                       fontWeight: 700,
//                       fontFamily: T.body,
//                     }}
//                   >
//                     Class {bookedVehicle.license}
//                   </span>
//                 </div>
//               </div>

//               {/* Payment note */}
//               <div
//                 style={{
//                   background: C.jadeLight,
//                   border: `1px solid ${C.jade}30`,
//                   borderRadius: 10,
//                   padding: "10px 14px",
//                   marginBottom: 20,
//                   fontSize: 12,
//                   color: C.jade,
//                   fontFamily: T.body,
//                   fontWeight: 500,
//                 }}
//               >
//                 ✓ Payment via eSewa · Documents verified via Nagarikta
//               </div>

//               <button
//                 style={{
//                   width: "100%",
//                   background: C.saffron,
//                   border: "none",
//                   color: C.ink,
//                   fontFamily: T.body,
//                   fontWeight: 700,
//                   fontSize: 15,
//                   padding: "14px",
//                   borderRadius: 12,
//                   cursor: "pointer",
//                   letterSpacing: 0.3,
//                 }}
//               >
//                 Proceed to Payment →
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

