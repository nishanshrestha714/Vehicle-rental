import React from "react";
import { Nav, Container, Navbar, Badge, NavDropdown } from "react-bootstrap";
import logo from "../assets/logocar.png";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { NavLink } from "react-router";         
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../Slices/UserApiSlices";
import { clearCredentials } from "../Slices/Authslices";
import { useNavigate } from "react-router";      

function Header() {
  const { CartItems = [] } = useSelector((state) => state.cart || {});
  const { userInfo } = useSelector((state) => state.auth);
  
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.log(err?.data?.error || err);
    } finally {
      dispatch(clearCredentials());
      localStorage.removeItem("userInfo");
      navigate("/signin");
    }
  };

  return (
    <header className="position-relative top-0 start-0 w-100 z-2 bg-light costum-z">
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo */}
          <div className="logo d-flex justify-content-center align-items-center">
            <Navbar.Brand as={NavLink} to="/">
              <img
                className="img-fluid"
                style={{ width: "40px", height: "40px" }}
                src={logo}
                alt="logo"
              />
              <strong> rental</strong>
            </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="nav-bar" />
          <Navbar.Collapse id="nav-bar">
            <Nav className="ms-auto d-flex align-items-center">

              {/* Main Navigation */}
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>
              <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
              <Nav.Link as={NavLink} to="/service">Service</Nav.Link>

              {/* Cart */}
              <Nav.Link as={NavLink} to="/cart" style={{ position: "relative" }}>
                <FaShoppingCart className="text-warning mx-1 mb-1" />
                {CartItems.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      fontSize: "0.65rem",
                    }}
                  >
                    {CartItems.length}
                  </Badge>
                )}
                Cart
              </Nav.Link>

              {/* Auth Section */}
              {userInfo ? (
                userInfo.isAdmin ? (
                  //  ADMIN 
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <NavDropdown.Item as={NavLink} to="/admin/Bookings">
                      Bookings
                    </NavDropdown.Item>
                       <NavDropdown.Item as={NavLink} to="/admin/vehicles">
                      Vehicles
                    </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/admin/nagarikta">
                      Nagarita-Pages
                    </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/admin/license">
                      License-Page
                    </NavDropdown.Item>
                     <NavDropdown.Item as={NavLink} to="/admin/contact">
                      Contact-Page
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                          logoutHandler();
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging out..." : "Logout"}
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  //  NORMAL USER 
                  <NavDropdown
                    title={
                      <span>
                        <FaUser className="mx-1" />
                        {userInfo.name || userInfo.username || "User"}
                      </span>
                    }
                    id="user-nav-dropdown"
                  >
                    <NavDropdown.Item as={NavLink} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                          logoutHandler();
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging out..." : "Logout"}
                    </NavDropdown.Item>
                  </NavDropdown>
                )
              ) : (
                // Not Logged In
                <Nav.Link as={NavLink} to="/signin">
                  <FaUser className="text-danger mx-1 mb-1" />
                  Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;