// import CheckOutSteps from "../components/CheckoutSteps";
// import { Row, Col, Button, ListGroup, Badge , Image } from "react-bootstrap";
// import { useSelector } from "react-redux";
// import { Link } from "react-router";

// function BookingPage() {
//   const cart = useSelector((state) => state.cart);
//   const { Nagariktapage } = cart;
//   const {License} = cart;
//   return (
//     <>
//       <CheckOutSteps step1 step2 step3 step4 step5 step6 />
//       <h2> this is booking page </h2>
//       <Row>
//         <Col md={8}>
//           <ListGroup variant="flush">
//             <ListGroup.Item>
//               <h2>nagarikta details</h2>
//               <p>
//                 <strong>fullName:</strong>
//                 {Nagariktapage.fullName}{" "}
//               </p>
//               <p>
//                 <strong>citizenshipNo:</strong>
//                 {Nagariktapage.citizenshipNo}{" "}
//               </p>
//               <p>
//                 <strong>permentAddress:</strong>
//                 {Nagariktapage.permentAddress}{" "}
//               </p>
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h2>license details</h2>
//               <p>
//                 <strong>fullname:</strong>
//                 {License.fullname}{" "}
//               </p>
//               <p>
//                 <strong>licesneNumber:</strong>
//                 {License.licesneNumber}{" "}
//               </p>
//               <p>
//                  <p>
//                 <strong>nagariktaNumber:</strong>
//                 {License.nagariktaNumber}{" "}
//               </p>
//                 <strong>address:</strong>
//                 {License.address}{" "}
//               </p>
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h2>payment method</h2>
//               <p>
//                 <strong>method:</strong>
//                 {cart.PaymentMethod == "cod" ? (
//                   <Badge>cash on booking </Badge>
//                 ) : (
//                   <Badge bg="success">E-sewa</Badge>
//                 )}
//               </p>
//             </ListGroup.Item>
//             <ListGroup.Item>
//                 <h2>vhicle</h2>
//                 <ListGroup variant="flush">
//                     {
//                         cart.CartItems.map(vehicle =>(
//                             <ListGroup.Item key={vehicle._id} >
//                                 <Row>
//                                     <Col md={3}>
//                                     <Image src={vehicle.image} fluid rounded/>
//                                     </Col>
//                                     <Col>
//                                     <Link to={`/vehicle/${vehicle._id}`}>
//                                     <strong>{vehicle.name}</strong>

//                                     </Link>
//                                     </Col>
//                                     <Col md={4}>
//                                     {vehicle.price} per x {vehicle.totalDays} days = {vehicle.totalPrice}
//                                     </Col>
//                                 </Row>
//                             </ListGroup.Item>
//                         ))
//                     }
//                 </ListGroup>
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={4}></Col>
//       </Row>
//     </>
//   );
// }
// export default BookingPage;

import CheckOutSteps from "../components/CheckoutSteps";
import {
  Row,
  Col,
  Button,
  ListGroup,
  Badge,
  Image,
  Card,
  Container,
  Stack,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { MdNoEncryptionGmailerrorred, MdPayment } from "react-icons/md";
import { PiNotepad } from "react-icons/pi";
import { useState } from "react";
import { useVehicleBookingMutation } from "../Slices/BookingApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ClearCart } from "../Slices/cartslice";
function Field({ label, value }) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 border-bottom">
      <span className="text-muted small">{label}</span>
      <span className="fw-semibold text-end small">{value || "—"}</span>
    </ListGroup.Item>
  );
}
//  section card
function SectionCard({ title, children }) {
  return (
    <Card className="mb-4 shadow-sm border-0 rounded-3">
      <Card.Header className="bg-black text-white fw-semibold rounded-top-3 py-3">
        {title}
      </Card.Header>
      <Card.Body className="px-4 py-3">
        <ListGroup variant="flush">{children}</ListGroup>
      </Card.Body>
    </Card>
  );
}
// main functions in this

function BookingPage() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const cart = useSelector((state) => state.cart);
  const { Nagariktapage, License, PaymentMethod, CartItems } = cart;
  const [VehicleBooking, { isLoading: vehicleBookingLoading }] =
    useVehicleBookingMutation();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const totalAmount = CartItems?.reduce(
    (acc, v) => acc + (v.totalPrice || 0),
    0,
  );

  const VehicleBookingHandler = async () => {
    // Guard: empty cart

    if (!CartItems || CartItems.length === 0) {
      toast.error("No vehicles in cart!");
      return;
    }
    const vehicle = CartItems[0];
    console.log(vehicle)

    // Guard: missing dates
    if (!vehicle.pickupDate || !vehicle.returnDate) {
      toast.error("Please select pickup and return date!");
      return;
    }

    // Guard: missing location
    if (!vehicle.pickupLocation) {
      toast.error("Please select pickup location!");
      return;
    }

    try {
      const res = await VehicleBooking({
        // Matches model field: vehicle
        vehicle: {
          vehicleId: vehicle._id,
          name: vehicle.name,
          image: vehicle.image,
          pricePerDay: vehicle.price,
          location: vehicle.pickupLocation,
        },
        //  Matches model field  bookingPeriod
        bookingPeriod: {
          start: vehicle.pickupDate,
          end: vehicle.returnDate,
        },
        //  Matches model fields exactly
        totalDays: vehicle.totalDays,
        totalPrice: vehicle.totalPrice,
        pickupLocation: vehicle.pickupLocation,
        dropLocation: vehicle.dropLocation,
        nagariktaId: Nagariktapage?._id,
        License: License?._id,
        payment: {
          method:
            PaymentMethod === "COD"
              ? "COD"
              : PaymentMethod === "eSewa"
                ? "eSewa"
                : "COD",
        },
      }).unwrap();
      dispatch(ClearCart())

      toast.success(res.message || "Booking confirmed!");
      navigate("/bookingdetails/" + res.bookingId);
    } catch (err) {
      toast.error(
        err?.data?.error ||
          err?.data?.message ||
          "Booking failed! Please try again.",
      );
      console.log("BOOKING ERROR =>", err);
      console.log("SENDING TO BACKEND =>", {
        nagariktaId: Nagariktapage?._id,
        License: License?._id,
        payment: {
          method:
            PaymentMethod === "COD"
              ? "COD"
              : PaymentMethod === "eSewa"
                ? "eSewa"
                : "COD",
        },
      });
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <CheckOutSteps step1 step2 step3 step4 step5 step6 />

      <div className="text-black py-4 mb-4">
        <Container>
          <div className="mt-3">
            <h2 className="fw-bold mb-1">Booking Summary</h2>
            <p className="text-black-50 mb-0 small">
              Please review your details before confirming
            </p>
          </div>
      
        </Container>
      </div>

      <Container>
        <Row className="g-4">
          {/* Left Column */}
          <Col lg={8}>
            {/* Nagarikta */}
            <SectionCard title="Nagarikta (Citizenship) Details">
              <Field label="Full Name" value={Nagariktapage?.fullName} />
              <Field
                label="Citizenship No."
                value={Nagariktapage?.citizenshipNo}
              />
              <Field
                label="Permanent Address"
                value={Nagariktapage?.permentAddress}
              />
            </SectionCard>

            {/* License */}
            <SectionCard title="Driving License Details">
              <Field label="Full Name" value={License?.fullname} />
              <Field label="License Number" value={License?.licesneNumber} />

              <Field
                label="Nagarikta Number"
                value={License?.nagariktaNumber}
              />
              <Field label="Address" value={License?.address} />
            </SectionCard>

            {/* Rental Details — reads from CartItems[0] */}
            <SectionCard title="Rental Details">
              <Field
                label="Pickup Date"
                value={CartItems?.[0]?.pickupDate || "Not Selected"}
              />
              <Field
                label="Return Date"
                value={CartItems?.[0]?.returnDate || "Not Selected"}
              />
              <Field label="Total Days" value={CartItems?.[0]?.totalDays} />
              <Field
                label="Pickup Location"
                value={CartItems?.[0]?.pickupLocation || "Not Selected"}
              />
              <Field
                label="Drop Location"
                value={CartItems?.[0]?.dropLocation || "Not Selected"}
              />
            </SectionCard>

            {/* Payment Method */}
            <SectionCard title="Payment Method">
              <ListGroup.Item className="px-0 border-0">
                <Stack
                  direction="horizontal"
                  gap={3}
                  className="align-items-center"
                >
                  {PaymentMethod === "COD" ? (
                    <>
                      <Badge bg="secondary" className="px-3 py-2 fs-6">
                        Cash on Delivery
                      </Badge>
                      <span className="text-muted small">
                        Pay when you receive the vehicle
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge bg="success" className="px-3 py-2 fs-6">
                        eSewa
                      </Badge>
                      <span className="text-muted small">
                        Paid securely via eSewa
                      </span>
                    </>
                  )}
                </Stack>
                
              </ListGroup.Item>
            </SectionCard>

            {/* Vehicles */}
            <SectionCard title="Vehicles in Booking">
              {CartItems?.length === 0 && (
                <ListGroup.Item className="text-center text-muted py-3 border-0">
                  No vehicles added.
                </ListGroup.Item>
              )}
              {CartItems?.map((v) => (
                <ListGroup.Item key={v._id} className="px-0 py-3 border-bottom">
                  <Row className="align-items-center g-3 ">
                    <Col xs={3} md={2}>
                      <Image
                        src={v.image}
                        fluid
                        rounded
                        className="border"
                        style={{
                          maxHeight: 60,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    </Col>
                    <Col>
                      <Link
                        to={`/vehicle/${v._id}`}
                        className="fw-bold text-decoration-none text-dark"
                      >
                        {v.name}
                      </Link>
                      <div className="text-muted small mt-1">
                        Rs.{v.price} x {v.totalDays} day
                        {v.totalDays > 1 ? "s" : ""}
                      </div>
                    </Col>
                    <Col xs="auto" className="fw-bold text-danger">
                      Rs.{v.totalPrice}
                    </Col>
                  </Row>

                  
                </ListGroup.Item>
              ))}
            </SectionCard>
          </Col>

          {/* Right Column — Order Summary */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: 24 }}>
              <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-danger text-white fw-bold rounded-top-3 py-3">
                  <PiNotepad /> Order Summary
                </Card.Header>
                <Card.Body className="p-4">
                  <ListGroup variant="flush" className="mb-3">
                    {CartItems?.map((v) => (
                      <ListGroup.Item
                        key={v._id}
                        className="d-flex justify-content-between px-0 small"
                      >
                        <span>
                          {v.name}{" "}
                          <span className="text-muted">x {v.totalDays}d</span>
                        </span>
                        <span className="fw-semibold">Rs.{v.totalPrice}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold">Total Amount</span>
                    <span className="fw-bold fs-5 text-danger">
                      Rs.{totalAmount}
                    </span>
                  </div>

                  <Form.Check
                    type="checkbox"
                    className="mb-3"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    label="I agree to the Terms & Conditions and Rental Policy"
                  />

                  <Button
                    variant="danger"
                    className="w-100 fw-bold py-2"
                    onClick={VehicleBookingHandler}
                    disabled={!agreeTerms || vehicleBookingLoading}
                  >
                    {vehicleBookingLoading
                      ? "Processing..."
                      : "Confirm Booking"}
                  </Button>

                  <p className="text-center text-muted small mt-3 mb-0">
                    <MdNoEncryptionGmailerrorred className="text-danger" /> Your
                    information is safe & encrypted
                  </p>
                </Card.Body>
              </Card>

              <div className="text-center mt-3">
                <Link
                  to="/payment"
                  className="text-muted small text-decoration-none"
                >
                  <Button className="text-white bg-danger">
                    {" "}
                    Back to Payment
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingPage;
