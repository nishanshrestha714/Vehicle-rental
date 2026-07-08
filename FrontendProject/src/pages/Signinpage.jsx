// import { Button, Form } from "react-bootstrap";
// import FromContainer from "../components/FromContainers";
// import { useLoginMutation } from "../Slices/UserApiSlices";
// import { useDispatch ,useSelector } from "react-redux";
// import { setCredentials } from "../Slices/Authslices";
// import { useState , useEffect } from "react";
// import { useNavigate ,useLocation } from "react-router";
// import { toast } from "react-toastify";

// function SigninPage() {
//   const {userInfo} = useSelector ((state) => state.auth)
//   const [email, setemail] = useState("");
//   const [password, setpassword] = useState("");
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatach = useDispatch();
// const navigate = useNavigate();
// const location = useLocation();
// const sp = new URLSearchParams(location.search);
// // console.log(sp);
// const redirect = sp.get('redirect') || "/";
// console.log(redirect);
// console.log('location' , location);

// useEffect (() => {
//   if(userInfo){
//      navigate(redirect);
//   }
// },[userInfo , navigate , redirect]);

//   const Loginhandler = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await login({
//         email,
//         password,
//       }).unwrap();

//       console.log(res);
//       dispatach (setCredentials(res.user));
//       navigate("/");
//       alert("you are login successfull!");

//     } catch (err) {
//       toast.error(err?.data?.error || err?.error);
//     }
//   };

//   return (
//     <>
//       <h1>name</h1>

//       <FromContainer>
//         <h2>login</h2>

//         <Form onSubmit={Loginhandler}>
//           <Form.Group className="my-3" controlId="email">
//             <Form.Label>Email</Form.Label>

//             <Form.Control
//               type="email"
//               value={email}
//               onChange={(e) => setemail(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="my-3" controlId="password">
//             <Form.Label>Password</Form.Label>

//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setpassword(e.target.value)}
//             />
//           </Form.Group>

//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? "Loading..." : "Login"}
//           </Button>
//         </Form>
//       </FromContainer>
//     </>
//   );
// }

// export default SigninPage;

// import { useState, useEffect } from "react";
// import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation, Link } from "react-router";
// import { toast } from "react-toastify";
// import { useLoginMutation } from "../Slices/UserApiSlices";
// import { setCredentials } from "../Slices/Authslices";
// import "./Signinpage.css";

// function SigninPage() {
//   const { userInfo } = useSelector((state) => state.auth);

//   const [email, setEmail]       = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);

//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch   = useDispatch();
//   const navigate   = useNavigate();
//   const location   = useLocation();

//   const redirect = new URLSearchParams(location.search).get("redirect") || "/";

//   // ✅ Redirect if already logged in
//   useEffect(() => {
//     if (userInfo) navigate(redirect);
//   }, [userInfo, navigate, redirect]);

//   const loginHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await login({ email, password }).unwrap();
//       dispatch(setCredentials(res.user));
//       toast.success("Welcome back! Login successful.");
//       navigate(redirect);
//     } catch (err) {
//       toast.error(err?.data?.error || err?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div className="signin-root">
//       <Row className="g-0 min-vh-100">

//         {/* ── Left decorative panel ── */}
//         <Col md={5} className="signin-left">
//           {/* Brand */}
//           <div className="signin-brand">
//             <div className="signin-brand-icon">🚗</div>
//             <span className="signin-brand-name">Drivex</span>
//           </div>

//           {/* Hero text */}
//           <div className="signin-left-content">
//             <h1>
//               Your journey<br />starts <span>here</span>
//             </h1>
//             <p>
//               Sign in to access Nepal's most flexible vehicle rental platform —
//               from city sedans to mountain SUVs, all in one place.
//             </p>

//             {/* Feature list */}
//             <div className="signin-feature">
//               <div className="signin-feature-icon">✅</div>
//               <span className="signin-feature-text">Nagarikta & License verified rentals</span>
//             </div>
//             <div className="signin-feature">
//               <div className="signin-feature-icon">💳</div>
//               <span className="signin-feature-text">Pay via eSewa, Khalti or Cash</span>
//             </div>
//             <div className="signin-feature">
//               <div className="signin-feature-icon">📍</div>
//               <span className="signin-feature-text">50+ pickup locations across Nepal</span>
//             </div>
//             <div className="signin-feature">
//               <div className="signin-feature-icon">🔒</div>
//               <span className="signin-feature-text">Safe, encrypted & verified bookings</span>
//             </div>
//           </div>
//         </Col>

//         {/* ── Right login panel ── */}
//         <Col md={7} className="signin-right">
//           <div className="signin-card">

//             {/* Header */}
//             <div className="text-center mb-4">
//               <h2
//                 className="fw-bold mb-1"
//                 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, color: "#111" }}
//               >
//                 Welcome back 👋
//               </h2>
//               <p className="text-muted" style={{ fontSize: 14 }}>
//                 Sign in to your Drivex account
//               </p>
//             </div>

//             {/* Google sign-in */}
//             <button className="signin-google-btn mb-1" type="button" disabled>
//               <img
//                 className="signin-google-icon"
//                 src="https://www.svgrepo.com/show/475656/google-color.svg"
//                 alt="Google"
//               />
//               Continue with Google
//             </button>

//             <div className="signin-divider">or sign in with email</div>

//             {/* Login form */}
//             <Card className="border-0 shadow-sm rounded-4 p-4">
//               <Form onSubmit={loginHandler}>

//                 {/* Email */}
//                 <Form.Group className="mb-3" controlId="email">
//                   <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
//                     Email address
//                   </Form.Label>
//                   <Form.Control
//                     type="email"
//                     placeholder="yourname@email.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="signin-input"
//                     required
//                   />
//                 </Form.Group>

//                 {/* Password */}
//                 <Form.Group className="mb-2" controlId="password">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <Form.Label className="fw-semibold mb-0" style={{ fontSize: 13 }}>
//                       Password
//                     </Form.Label>
//                     <Link
//                       to="/forgot-password"
//                       style={{ fontSize: 12, color: "#1d9e75", textDecoration: "none", fontWeight: 600 }}
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <div className="position-relative">
//                     <Form.Control
//                       type={showPass ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="signin-input"
//                       required
//                     />
//                     <span
//                       onClick={() => setShowPass(!showPass)}
//                       style={{
//                         position: "absolute", right: 14, top: "50%",
//                         transform: "translateY(-50%)",
//                         cursor: "pointer", fontSize: 16, color: "#aaa",
//                         userSelect: "none",
//                       }}
//                     >
//                       {showPass ? "🙈" : "👁️"}
//                     </span>
//                   </div>
//                 </Form.Group>

//                 {/* Remember me */}
//                 <Form.Check
//                   type="checkbox"
//                   label="Remember me"
//                   className="mb-4 mt-3 text-muted"
//                   style={{ fontSize: 13 }}
//                 />

//                 {/* Submit */}
//                 <Button
//                   type="submit"
//                   className="signin-submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Signing in…
//                     </>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </Button>
//               </Form>
//             </Card>

//             {/* Register link */}

//             <div className="signin-footer">
//               Don't have an account?{" "}
//               <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
//                 Create account
//               </Link>
//             </div>

//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default SigninPage;

import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router";
import { toast } from "react-toastify";
import { useLoginMutation } from "../Slices/UserApiSlices";
import { setCredentials } from "../Slices/Authslices";
import "./Signinpage.css";

/* ── SVG Icons ────────────────────────────────── */
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const EyeCrossedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    <path
      d="M2 2L22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="22"
    height="22"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="22"
    height="22"
  >
    <path fill="#039BE5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
    <path
      fill="#fff"
      d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="currentColor"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

/* ── Main Component ───────────────────────────── */
function SigninPage() {
  const { userInfo } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  /* ── Validation ── */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const loginHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // reset server errors
    setEmailError("");
    setPasswordError("");

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res.user));
      toast.success("Welcome back! Login successful.");
      navigate(redirect);
    } catch (err) {
      const msg = err?.data?.error || err?.error || "";
      if (msg === "Email not Found") setEmailError("Email not found");
      else if (msg === "verify your email first!")
        setEmailError("Verify your email first!");
      else if (msg === "Invalid password") setPasswordError("Invalid password");
      else toast.error(msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="si-root">
      <Row className="g-0 min-vh-100">
        <Col md={7} xs={12} className="si-right">
          <div className="si-card">
            {/* Signup link top right */}
            <div className="si-top-link text-center">
              <span>New User? </span>
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Sign Up
              </Link>
            </div>

            <h2>Welcome Back!</h2>
            <p className="si-subtext">Login to continue</p>

            {/* Form */}
            <form onSubmit={loginHandler} noValidate>
              {/* Email */}
              <div className="si-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example123@gmail.com"
                  className={
                    errors.email || emailError
                      ? "si-input si-input-error"
                      : "si-input"
                  }
                />
                {errors.email && (
                  <span className="si-error">{errors.email}</span>
                )}
                {emailError && <span className="si-error">{emailError}</span>}
              </div>
 
              {/* Password */}
              <div className="si-group">
                <label>Password</label>
                <div className="si-pass-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={
                      errors.password || passwordError
                        ? "si-input si-input-error"
                        : "si-input"
                    }
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="si-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeCrossedIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <span className="si-error">{errors.password}</span>
                )}
                {passwordError && (
                  <span className="si-error">{passwordError}</span>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="si-btn" disabled={isLoading}>
                {isLoading ? <div className="si-spinner" /> : "LOGIN"}
              </button>
            </form>

            {/* Forgot password */}
            <div className="si-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Social login */}
            <div className="si-social">
              <span>Login with</span>
              <div className="si-social-icons">
                <button
                  type="button"
                  className="si-social-btn"
                  title="Google"
                  disabled
                >
                  <GoogleIcon />
                </button>
                <button
                  type="button"
                  className="si-social-btn"
                  title="Facebook"
                  disabled
                >
                  <FacebookIcon />
                </button>
                <button
                  type="button"
                  className="si-social-btn"
                  title="GitHub"
                  disabled
                >
                  <GithubIcon />
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SigninPage;
