import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router";

function Footer() {
  function goToFacebook() {
    window.location.href =
      "https://www.facebook.com/";
  }

  function goToYoutube() {
    window.location.href =
"https://www.youtube.com/";
  }

  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="footer-section bg-dark text-white pt-5 pb-3">
      <Container>
        {/* Top Section: Grid Columns */}
        <Row className="gy-4 justify-content-between">
          
          {/* Company Info - 12 cols on mobile, 6 on tablet, 3 on desktop */}
          <Col xs={12} sm={6} md={3} className="footer_box">
            <h3 className="h5 text-warning mb-3">RideNow</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <NavLink to="/" className="footer_navLink text-decoration-none">
                  Home
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/about" className="footer_navLink text-decoration-none">
                  About Us
                </NavLink>
              </li>
            </ul>
          </Col>

          {/* Help & Support */}
          <Col xs={12} sm={6} md={3} className="footer_box">
            <h3 className="h5 text-warning mb-3">Help & Support</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <NavLink to="/faqs" className="footer_navLink text-decoration-none">
                  FAQs
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/contact" className="footer_navLink text-decoration-none">
                  Contact Us
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/how-it-works" className="footer_navLink text-decoration-none">
                  How it Works
                </NavLink>
              </li>
            </ul>
          </Col>

          {/* Follow Us */}
          <Col xs={12} sm={6} md={3} className="footer_box">
            <h3 className="h5 text-warning mb-3">Follow Us</h3>
            <ul className="list-unstyled">
              <li className="mb-2 text-secondary static-link">Twitter</li>
              <li onClick={goToYoutube} className="mb-2 footer_navLink style-clickable">
                YouTube
              </li>
              <li onClick={goToFacebook} className="mb-2 footer_navLink style-clickable">
                Facebook
              </li>
              <li className="mb-2 text-secondary static-link">Instagram</li>
            </ul>
          </Col>

          {/* Fast Link */}
          <Col xs={12} sm={6} md={3} className="footer_box">
            <h3 className="h5 text-warning mb-3">Fast Link</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <NavLink to="/offer" className="footer_navLink text-decoration-none">
                  Offers
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/location" className="footer_navLink text-decoration-none">
                  Location
                </NavLink>
              </li>
              <li className="mb-2 text-secondary static-link">Book a Vehicle</li>
            </ul>
          </Col>
        </Row>

        {/* Divider Line */}
        <hr className="border-secondary my-4" />

        {/* Bottom Section: Copyright & Privacy */}
        <Row className="align-items-center gy-2 text-center text-md-start">
          <Col md={6}>
            <p className="mb-0 text-secondary text-capitalize small">
              &copy; {year}, vehicle rental by nishan shrestha
            </p>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <NavLink to="/privacy-and-policy" className="footer_navLink text-decoration-none small">
              Privacy & Policy
            </NavLink>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;