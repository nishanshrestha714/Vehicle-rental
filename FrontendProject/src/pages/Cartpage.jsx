
import { Link, useNavigate } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RemoveFromCart, ClearCart } from "../Slices/cartslice";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { CgCalendarDates } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { MdCancel } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";



// import "./cartpage.css";

function Cartpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CartItems } = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(RemoveFromCart(id));
  };

  const handleClear = () => {
    dispatch(ClearCart());
  };

  const handleCheckout = () => {
    navigate("/signin?redirect=/shipping");
  };
 
  const totalItems = CartItems.length;
  const grandTotal = CartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="cp-page">
      <Container className="py-4">

        {/* ── Header ── */}
        <div className="cp-header">
          <div>
            <h2 className="cp-title"><FaShoppingCart className="text-danger" />
              Your Cart</h2>
            <p className="cp-subtitle">{totalItems} vehicle{totalItems !== 1 ? "s" : ""} added</p>
          </div>
          <Link to="/">
            <button className="cp-back-btn "> <IoMdArrowBack className="text-danger" />
              back</button>
          </Link>
        </div>

        {CartItems.length === 0 ? (
          /* ── Empty State ── */
          <div className="cp-empty">
            <div className="cp-empty-icon"><FaCarSide  className="text-danger"/>
            </div>
            <h3 className="cp-empty-title">Your cart is empty</h3>
            <p className="cp-empty-sub">Browse our vehicles and add one to get started.</p>
            <Link to="/">
              <button className="cp-browse-btn">Show Vehicles </button>
            </Link>
          </div>
        ) : (
          <Row className="g-4">

            {/* ── Cart Items ── */}
            <Col lg={8}>
              <div className="cp-items-wrap">
                {CartItems.map((item) => (
                  
                  <div className="cp-card" key={item._id}>

                    {/* Image */}
                    <div className="cp-img-wrap">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cp-vehicle-img"
                      />
                    </div>

                    {/* Details */}
                    <div className="cp-details">
                      <div className="cp-name-row">
                        <h4 className="cp-vehicle-name">{item.name}</h4>
                        <button
                          className="cp-remove-btn"
                          onClick={() => handleRemove(item._id)}
                        >
                          <MdCancel className="text-danger " style={{
                            height: "30px",
                            width:"30px",
                            objectFit: "cover",
                            //  background:"red"

                          }} />

                        </button>
                      </div>
                     

                      <div className="cp-info-grid">
                        <div className="cp-info-item">
                          <span className="cp-info-label"><FaLocationArrow /> Pickup Location</span>
                          <span className="cp-info-value">{item.pickupLocation}</span>
                        </div>
                        <div className="cp-info-item">
                          <span className="cp-info-label"><CiLocationOn />
                            Drop Location</span>
                          <span className="cp-info-value">{item.dropLocation}</span>
                        </div>
                        <div className="cp-info-item">
                          <span className="cp-info-label"><CgCalendarDates />
                            Pickup Date</span>
                          <span className="cp-info-value">{item.pickupDate}</span>
                        </div>
                        <div className="cp-info-item">
                          <span className="cp-info-label"><CgCalendarDates />
                            Return Date</span>
                          <span className="cp-info-value">{item.returnDate}</span>
                        </div>
                      </div>

                      <div className="cp-price-row">
                        <span className="cp-days-badge">{item.totalDays} Day{item.totalDays !== 1 ? "s" : ""}</span>
                        <span className="cp-rate">${item.price}/day</span>
                        <span className="cp-total">${item.totalPrice}</span>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Clear Cart */}
                <button className="cp-clear-btn" onClick={handleClear}>
                  <MdDelete />
                  Clear Cart
                </button>
              </div>
            </Col>

            {/* ── Order Summary ── */}
            <Col lg={4}>
              <div className="cp-summary-card">
                <h4 className="cp-summary-title">Order Summary</h4>

                <div className="cp-summary-list">
                  {CartItems.map((item) => (
                    <div className="cp-summary-row" key={item._id}>
                      <span className="cp-summary-name">{item.name}</span>
                      <span className="cp-summary-price">${item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <hr className="cp-divider" />

                <div className="cp-grand-row">
                  <span className="cp-grand-label">Grand Total</span>
                  <span className="cp-grand-total">${grandTotal}</span>
                </div>

                <div className="cp-tax-note">Inclusive of all taxes & fees</div>

                <button
                  className="cp-checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout 
                </button>

                <div className="cp-secure">
                  <GrSecure className=" text-danger" /> {" "}
                  Secure &amp; Encrypted Checkout
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Cartpage;
