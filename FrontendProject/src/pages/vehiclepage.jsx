import { Link, useParams } from "react-router";
import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import Rating from "../components/Rating";
import { useGetVehicleByIdQuery } from "../Slices/VehicleApislice";
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { AddToCart } from "../Slices/cartslice";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { PiStarThin } from "react-icons/pi";
import { FaLocationDot, FaFlagCheckered, FaCalendarDay, FaCalendarCheck } from "react-icons/fa6";
import { useNavigate } from "react-router"
import { FaCalendarDays } from "react-icons/fa6";

import "./vehiclepage.css";

function Vehiclepage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetVehicleByIdQuery(id);
  const vehicle = data?.VechileById || {};

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [added, setAdded] = useState(false);
  const { CartItems } = useSelector((state) => state.cart);

  const totalDays =
    pickupDate && returnDate
      ? Math.max(
        0,
        Math.ceil(
          (new Date(returnDate) - new Date(pickupDate)) / 86400000
        )
      )
      : 0;

  const totalPrice = totalDays > 0 ? totalDays * vehicle.price : 0;

  const navigate = useNavigate();

  const AddToCartHandler = () => {
    if (!pickupLocation || !dropLocation || !pickupDate || !returnDate) {
      alert(" Please fill all booking fields");
      return;
    }
    if (totalDays <= 0) {
      alert("Return date must be after pickup date");
      return;
    }
    const exitCartItem = CartItems.find((item) => item.id === vehicle._id);
    if (exitCartItem) {
      return alert("This vehicle is already added to cart!");
    }

    dispatch(
      AddToCart({
        _id: vehicle._id,
        name: vehicle.name,
        image: vehicle.image,
        price: vehicle.price,
        pickupLocation,
        dropLocation,
        pickupDate,
        returnDate,
        totalDays,
        totalPrice,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 200);
    navigate("/cart");
  };

  console.log(vehicle._id);
  console.log(CartItems);

  return (
    <div className="vp-page">
      <Container className="py-4">

        <Link to="/" className=" p-2">
          <span className=" btn btn-dark text-white">Back</span>
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage type="danger">
            {error?.data?.message || error?.error}
          </ErrorMessage>
        ) : (
          <Row className="g-4">

            {/* ── Image Column ── */}
            <Col md={6}>
              <div className="vp-card vp-image-card">
                <div className="vp-img-wrap">
                  <span className="vp-img-badge"><PiStarThin className="text-danger" />
                    Premium</span>
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="vp-vehicle-img"
                  />
                </div>
                <div className="vp-img-footer">
                  <span className="vp-img-meta">&#128247; {vehicle.images?.length || 1} Photos</span>
                  <span className="vp-img-meta">{vehicle.name} </span>
                </div>
              </div>
            </Col>

            {/*  Detail Column  */}
            <Col md={6}>
              <div className="vp-card vp-detail-card">

                <div className="vp-name-row">
                  <h2 className="vp-vehicle-name">{vehicle.name}</h2>
                  {vehicle.fuelType && (
                    <span className="vp-ribbon">{vehicle.fuelType}</span>
                  )}
                </div>

                <div className="vp-rating-row">
                  <Rating
                    value={vehicle.rating}
                    text={`${vehicle.numReview} Reviews`}
                  />
                </div>

                <hr className="vp-hr" />

                <div>
                  <div className="vp-price">
                    <sup>$</sup>{vehicle.price}
                    <sub>/Day</sub>
                  </div>
                  <p className="vp-tax-note">Inclusive of all taxes &amp; fees</p>
                </div>

                <p className="vp-desc">{vehicle.discription}</p>

                <hr className="vp-hr" />

                <div className="vp-tags">
                  {vehicle.countInStock > 0 ? (
                    <span className="vp-tag vp-tag-green">&#10003; Available</span>
                  ) : (
                    <span className="vp-tag vp-tag-red">&#10005; Not Available</span>
                  )}
                  {vehicle.seats && (
                    <span className="vp-tag vp-tag-blue">&#128101; {vehicle.seats} Seats</span>
                  )}
                  {vehicle.transmission && (
                    <span className="vp-tag vp-tag-amber">{vehicle.transmission}</span>
                  )}
                </div>

                <hr className="vp-hr" />

              </div>
            </Col>

            {/*  Booking Card  */}
            <Col md={12}>
              <div className="vp-card vp-booking-card">

             <div className="vp-booking-title">
  <FaCalendarDays className="vp-title-icon" />
  Book This Vehicle
</div>

                <Form>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="vp-form-label">
                          <FaLocationDot className="vp-lbl-icon" />
                          Pickup Location
                        </Form.Label>
                        <Form.Control
                          className="vp-input"
                          type="text"
                          placeholder="e.g. Kathmandu, Thamel"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="vp-form-label">
                          <FaFlagCheckered className="vp-lbl-icon" />
                          Drop Location
                        </Form.Label>
                        <Form.Control
                          className="vp-input"
                          type="text"
                          placeholder="e.g. Pokhara, Lakeside"
                          value={dropLocation}
                          onChange={(e) => setDropLocation(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="vp-form-label">
                          <FaCalendarDay className="vp-lbl-icon" />
                          Pickup Date
                        </Form.Label>
                        <Form.Control
                          className="vp-input"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="vp-form-label">
                          <FaCalendarCheck className="vp-lbl-icon" />
                          Return Date
                        </Form.Label>
                        <Form.Control
                          className="vp-input"
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Summary */}
                  <div className="vp-summary">
                    <div className="vp-summary-item">
                      <span className="vp-summary-label">Total Days</span>
                      <strong className="vp-summary-value">{totalDays}</strong>
                    </div>
                    <div className="vp-summary-sep" />
                    <div className="vp-summary-item">
                      <span className="vp-summary-label">Rate / Day</span>
                      <strong className="vp-summary-value">${vehicle.price}</strong>
                    </div>
                    <div className="vp-summary-sep" />
                    <div className="vp-summary-item">
                      <span className="vp-summary-label">Total Price</span>
                      <strong className="vp-summary-value vp-total-price">
                        ${totalPrice}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`vp-submit-btn ${added ? "vp-btn-added" : ""}`}
                    disabled={!vehicle.countInStock}
                    onClick={AddToCartHandler}
                  >
                    {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                  </button>
                </Form>

              </div>
            </Col>

          </Row>
        )}
      </Container>
    </div>
  );
}

export default Vehiclepage;