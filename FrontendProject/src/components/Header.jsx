import React from "react";
import { Nav, Container, Navbar, Badge, NavDropdown } from "react-bootstrap";
import logo from "../assets/logocar.png";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { useSelector , useDispatch } from "react-redux";
import { useLogoutMutation } from "../Slices/UserApiSlices";
import { clearCredentials } from "../Slices/Authslices";
import { useNavigate } from "react-router";


function Header() {
  const { CartItems = [] } = useSelector((state) => state.cart || {});
  const {userInfo} = useSelector((state) => state.auth);
  const [logout , {isLoading}] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler=  async() => {
    try{ 
      const res = await  logout().unwrap();
      console.log (res.message);
    }
    catch(err) {
      console.log (err?.data?.error);
    }
    finally{
      dispatch(clearCredentials());
      localStorage.removeItem('userInfo');
      navigate('/signin');
    }
  };
console.log ( "this is user ",userInfo);

  return (
    <>
      <header className="position-relative top-0 start-0 w-100 z-2 bg-light costum-z">
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
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
              <Nav className="ms-auto d-flex justify-content-between">
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
                <Nav.Link as={NavLink} to="/service">Service</Nav.Link>

                {/* ── Cart ── */}
                <Nav.Link as={NavLink} to="/cart" style={{ position: "relative" }}>
                  <FaShoppingCart className="text-warning mx-1 mb-1" />
                  {CartItems.length > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "0px",
                        fontSize: "0.65rem",
                      }}
                    >
                       {/* ← total number of vehicles in cart */}
                      {CartItems.length} 
                    </Badge>
                  )}
                  Cart
                </Nav.Link>
   

                {userInfo ? ( <NavDropdown title ={userInfo.name}>
                    <NavDropdown.Item as ={Link} to="/profile">profile</NavDropdown.Item>
                    {/* <NavDropdown.Item  onClick={logoutHandler  alert ("are you sure logout ")}>logout</NavDropdown.Item> */}
                    <NavDropdown.Item
  onClick={() => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutHandler();
    }
  }}
>
  Logout
</NavDropdown.Item>


                </NavDropdown>) : (
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
    </>
  );
}

export default Header;