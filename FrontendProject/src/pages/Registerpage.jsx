
import { useState, useEffect, useMemo } from "react";
import { Row, Col, Container, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../Slices/UserApiSlices";
import { setCredentials } from "../Slices/Authslices";

const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

/*  Icons  */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeCrossedIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/*  Validation helpers  */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NEPAL_PHONE_REGEX = /^9[78]\d{8}$/; // 98/97 + 8 digits

function getPasswordScore(pw) {
  let score = 0;
  // pw.length returns the number of characters in the password.
  //If the password has 8 or more characters, increase the score by 1.
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_BAR_COLORS = { 1: "#d64545", 2: "#4242dc", 3: "#d7b23c", 4: "#4caf6e" };

function RegisterPage() {
  const { userInfo } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

// It runs code after the component renders.

  // useEffect(() => {
  //   const link = document.createElement("link");
  //   link.rel = "stylesheet";
  //   link.href =
  //     "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap";
  //   document.head.appendChild(link);
  //   return () => document.head.removeChild(link);
  // }, []);

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);

  const fieldErrors = useMemo(() => {
    // e meaning first ma error empty xa 
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email) e.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    if (!phoneNumber) e.phoneNumber = "Phone number is required";
    else if (!NEPAL_PHONE_REGEX.test(phoneNumber))
      e.phoneNumber = "Enter a valid Nepali mobile number";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";
    return e;
  }, [firstName, lastName, email, phoneNumber, password]);

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const registerHandler = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true,
    });
    //If any validation errors exist, exit the function immediately.
    setErrors(fieldErrors);
    //If there are any validation errors, stop the function here
    //Object.keys() returns an array of all the keys (property names) in an object.
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      const res = await register({ firstName, lastName, email, phoneNumber, password }).unwrap();
      dispatch(setCredentials(res.user));
      toast.success(res.message || "Account created. Welcome to Drivex!");
      navigate(redirect);
    } catch (err) {
      const errorMsg = err?.data?.message || err?.data?.errormessage || "Registration failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  const showError = (field) => touched[field] && fieldErrors[field];

  /*  Inline style helpers  */
  const inputStyle = (field, extra = {}) => {
    const invalid = !!showError(field);
    const focused = focusedField === field;
    return {
      background: "rgb(255, 255, 255)",
      border: `1.5px solid ${invalid ? "#5145d6" : focused ? "#564aff" : "#afaeba"}`,
      borderRadius: "0.65rem",
      padding: "0.65rem 0.9rem",
      fontSize: "0.95rem",
      color: "#211c16",
      boxShadow: focused && !invalid ? `0 0 0 3px ${"#ffe7de"}` : "none",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      outline: "none",
      width: "100%",
    };
  };

  return (
    <div style={{  background:" #f4f6f9", fontFamily: FONT_BODY, color: "#211c16", minHeight: "" }} >
      <Container style={{ minHeight: "100vh" }}>
        <Row className="justify-content-flex-start align-items-center ">
          <Col lg={5} md={7} sm={9} xs={12}>
            <div
              style={{
                width: "100%",
                margin: "3rem auto",
                padding: "2.5rem 2rem",
                background: "#ffffff",
                border: `1.5px solid ${"#e8e9f0"}`,
                borderRadius: "1rem",
                boxShadow: "0 20px 40px -24px rgba(33, 28, 22, 0.18)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <Link
                  to="/"
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#211c16",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Drive<span style={{ color: "#ff6b4a" }}>x</span>
                </Link>
              </div>

              <div style={{ textAlign: "center", marginTop: 0, marginBottom: "2rem" }}>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#e0563a",
                    marginBottom: "0.5rem",
                  }}
                >
                  Create your account
                </p>
                {/* <h1
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: "1.85rem",
                    lineHeight: 1.15,
                    color: "#211c16",
                    marginBottom: "0.65rem",
                  }}
                >
                  Get on the road in minutes
                </h1>
                <p style={{ fontSize: "0.95rem", color: "#6f6558", marginBottom: 0, lineHeight: 1.5 }}>
                  Book verified vehicles anywhere in Nepal — pay with eSewa or Khalti, no paperwork at the counter.
                </p> */}
              </div>

              <Form onSubmit={registerHandler} noValidate>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group style={{ marginBottom: "1.1rem" }} controlId="firstName">
                      <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#211c16", marginBottom: "0.4rem" }}>
                        First name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => {
                          markTouched("firstName");
                          setFocusedField(null);
                        }}
                        placeholder="First Name"
                        style={inputStyle("firstName")}
                        isInvalid={!!showError("firstName")}
                      />
                      {showError("firstName") && (
                        <div style={{ fontSize: "0.78rem", color: "#d64545", marginTop: "0.35rem" }}>
                          {fieldErrors.firstName}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col sm={6}>
                    <Form.Group style={{ marginBottom: "1.1rem" }} controlId="lastName">
                      <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#211c16", marginBottom: "0.4rem" }}>
                        Last name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => {
                          markTouched("lastName");
                          setFocusedField(null);
                        }}
                        placeholder="Last Name"
                        style={inputStyle("lastName")}
                        isInvalid={!!showError("lastName")}
                      />
                      {showError("lastName") && (
                        <div style={{ fontSize: "0.78rem", color: "#d64545", marginTop: "0.35rem" }}>
                          {fieldErrors.lastName}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group style={{ marginBottom: "1.1rem" }} controlId="email">
                  <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#211c16", marginBottom: "0.4rem" }}>
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => {
                      markTouched("email");
                      setFocusedField(null);
                    }}
                    placeholder="you@example.com"
                    style={inputStyle("email")}
                    isInvalid={!!showError("email")}
                  />
                  {showError("email") && (
                    <div style={{ fontSize: "0.78rem", color: "#d64545", marginTop: "0.35rem" }}>
                      {fieldErrors.email}
                    </div>
                  )}
                </Form.Group>

                <Form.Group style={{ marginBottom: "1.1rem" }} controlId="phoneNumber">
                  <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#211c16", marginBottom: "0.4rem" }}>
                    Phone number
                  </Form.Label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      border: `1.5px solid ${
                        showError("phoneNumber") ? "#456cd6" : focusedField === "phoneNumber" ? "#4a71ff" : "#e6ddcd"
                      }`,
                      borderRadius: "0.65rem",
                      overflow: "hidden",
                      background: "#ffffff",
                      boxShadow:
                        focusedField === "phoneNumber" && !showError("phoneNumber") ? `0 0 0 3px ${"#ffe7de"}` : "none",
                      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 0.75rem",
                        background: "#f3ecdf",
                        color: "#6f6558",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        borderRight: `1.5px solid ${"#e6ddcd"}`,
                      }}
                    >
                      +977
                    </span>
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onFocus={() => setFocusedField("phoneNumber")}
                      onBlur={() => {
                        markTouched("phoneNumber");
                        setFocusedField(null);
                      }}
                      placeholder="98XXXXXXXX"
                      style={{
                        border: "none",
                        borderRadius: 0,
                        boxShadow: "none",
                        padding: "0.65rem 0.9rem",
                        fontSize: "0.95rem",
                        color: "#211c16",
                        outline: "none",
                        width: "100%",
                      }}
                    />
                  </div>
                  {showError("phoneNumber") && (
                    <div style={{ fontSize: "0.78rem", color: "#d64545", marginTop: "0.35rem" }}>
                      {fieldErrors.phoneNumber}
                    </div>
                  )}
                </Form.Group>

                <Form.Group style={{ marginBottom: "1.1rem" }} controlId="password">
                  <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#211c16", marginBottom: "0.4rem" }}>
                    Password
                  </Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => {
                        markTouched("password");
                        setFocusedField(null);
                      }}
                      placeholder="At least 8 characters"
                      style={inputStyle("password", { paddingRight: "2.5rem" })}
                      autoComplete="new-password"
                      isInvalid={!!showError("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "0.85rem",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#6f6558",
                        display: "flex",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? <EyeCrossedIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            style={{
                              height: "4px",
                              flex: 1,
                              borderRadius: "2px",
                              background: i < passwordScore ? STRENGTH_BAR_COLORS[passwordScore] : "#e6ddcd",
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6f6558", minWidth: "40px", textAlign: "right" }}>
                        {STRENGTH_LABELS[Math.max(passwordScore - 1, 0)]}
                      </span>
                    </div>
                  )}
                  {showError("password") && (
                    <div style={{ fontSize: "0.78rem", color: "#d64545", marginTop: "0.35rem" }}>
                      {fieldErrors.password}
                    </div>
                  )}
                </Form.Group>

                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    width: "100%",
                    background: btnHover && !isLoading ? "#3a4be0" : "#4a7aff",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.65rem",
                    padding: "0.75rem 1rem",
                    fontFamily: FONT_BODY,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s ease",
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? <Spinner animation="border" size="sm" style={{ color: "#ffffff" }} /> : "Create account"}
                </button>

                <p style={{ fontSize: "0.75rem", color: "#6f6558", textAlign: "center", marginTop: "0.85rem", marginBottom: 0, lineHeight: 1.4 }}>
                  By creating an account you agree to Drivex's Terms of Service and Privacy Policy.
                </p>
              </Form>

              <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "#6f6558" }}>
                <span>Already have an account? </span>
                <Link
                  to={redirect ? `/signin?redirect=${redirect}` : "/signin"}
                  onMouseEnter={() => setLinkHover(true)}
                  onMouseLeave={() => setLinkHover(false)}
                  style={{
                    color: "#3a45e0",
                    fontWeight: 700,
                    textDecoration: linkHover ? "underline" : "none",
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RegisterPage;