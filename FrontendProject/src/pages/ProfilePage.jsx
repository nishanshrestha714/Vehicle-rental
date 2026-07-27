import { Form, Col, Row, Card, Button, Badge, Table } from "react-bootstrap";
import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMyBookingQuery } from "../Slices/BookingApiSlice";
import { useUserUpdateMutation } from "../Slices/UserApiSlices";
import { setCredentials } from "../Slices/Authslices";
//  import { Toast } from "react-bootstrap";
import {toast} from "react-toastify"
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router";
import { CiEdit } from "react-icons/ci";
 import { useDispatch } from "react-redux";

/*  SVG Icons (outside component)  */
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const EyeCrossedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
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

/*  ProfilePage Component  */
function ProfilePage() {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || "");
  //  const [firstName, setFirstName] = useState(userInfo.firstName);
  // const [lastName, setLastName] = useState(userInfo.lastName);
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  console.log("this is pnone number", phoneNumber);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [emailError, setEmailError] = useState("");
   const [isDirty  , setIsDirty] = useState(false);
   const dispatch = useDispatch();
   

  const { data: booking, isLoading, error } = useGetMyBookingQuery();
  const [update, {isLoading:UpdateLoading}] = useUserUpdateMutation();

  const  ProfileUpdatehandler = async  (e) => {
    e.preventDefault();

     // and so  conditions in this function 
     try {
      const  res = await  update  ({
        // firstName,
        // lastName,
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
      }).unwrap();
      // dispatch -> This is the command that actually updates the app’s global state.
      // setCredentials -> This is a function that saves the user’s login info.
       // reuse the SAME fix you made earlier — pass res.user, not res
       //dispatch(setCredentials(res.user)); 
       //"After the user registers successfully
       // , take the user information from the server response (res.user) and save it in the app's memory (Redux) so the user stays logged in."
      dispatch(setCredentials({ ...userInfo, ...res.user }));
      toast.success("Profile updated successfully.");
      setPassword("");
      setConfirmPassword("");
     }
         catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }

     
  };


  //  Recalculate dirty state whenever any tracked field changes
  useEffect(() => {
    const fieldsChanged =
      name !== (userInfo?.name || "") ||
      email !== (userInfo?.email || "") ||
      String(phoneNumber) !== String(userInfo?.phoneNumber || "");

    const passwordChanged = password.length > 0 || confirmPassword.length > 0;

    setIsDirty(fieldsChanged || passwordChanged);
  }, [name, email, phoneNumber, password, confirmPassword, userInfo]);
  


  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold">My Profile</h2>
        <p className="text-muted">
          Manage your profile information and bookings
        </p>
      </div>

      <Row className="g-4">
        {/*  LEFT SIDE PROFILE  */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-0">
              {/* Avatar */}
              <div
                className="d-flex justify-content-center"
                style={{ paddingTop: "28px" }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "75px",
                    height: "75px",
                    background: "transparent",
                    border: "3px solid #dee2e6",
                    color: "#212529",
                    fontSize: "26px",
                    fontWeight: "700",
                  }}
                >
                  {name?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              {/* Name & Email */}
              <div className="text-center mt-3 pb-2 px-4">
                <h5 className="fw-bold mb-0">{name}</h5>
                <small className="text-muted">{email}</small>
                <div className="mt-1">
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: "#e9ecef",
                      color: "#495057",
                      fontSize: "11px",
                    }}
                  >
                    Member
                  </span>
                </div>
              </div>

              <hr className="mx-4 my-2" />

              {/* Form Section */}
              <div className="px-4 pb-4 pt-2">
                <p
                  className="fw-semibold mb-2"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    color: "#6c757d",
                  }}
                >
                  ACCOUNT DETAILS
                </p>

                <Form onSubmit={ProfileUpdatehandler}>
                  {/* Row 1 — Name + Phone */}
                  {/* Row 1 — Name + Phone */}
                  <Row className="g-2 mb-2">
                    <Col xs={6}>
                      <Form.Label
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Full Name
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-3"
                          disabled={!editName}
                          style={{
                            fontSize: "13px",
                            paddingRight: "36px",
                            background: editName ? "#fff" : "#f8f9fa",
                            color: editName ? "#212529" : "#6c757d",
                          }}
                        />
                        <span
                          onClick={() => setEditName(!editName)}
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right: "10px",
                            cursor: "pointer",
                            color: editName ? "#212529" : "#6c757d",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                          }}
                        >
                          <CiEdit />
                        </span>
                      </div>
                    </Col>

                    <Col xs={6}>
                      <Form.Label
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Phone
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="rounded-3"
                          disabled={!editPhone}
                          style={{
                            fontSize: "13px",
                            paddingRight: "36px",
                            background: editPhone ? "#fff" : "#f8f9fa",
                            color: editPhone ? "#212529" : "#6c757d",
                          }}
                        />
                        <span
                          onClick={() => setEditPhone(!editPhone)}
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right: "10px",
                            cursor: "pointer",
                            color: editPhone ? "#212529" : "#6c757d",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                          }}
                        >
                          <CiEdit />
                        </span>
                      </div>
                    </Col>
                  </Row>

                  {/* Row 2 — Email full width */}

                  {/* <Row className="g-2 mb-2">
                    <Col xs={12}>
                      <Form.Label
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Email Address
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-3"
                          disabled={!editEmail}
                          style={{
                            fontSize: "13px",
                            paddingRight: "36px",
                            background: editEmail ? "#fff" : "#f8f9fa",
                            color: editEmail ? "#212529" : "#6c757d",
                          }}
                        />
                        <span
                          onClick={() => setEditEmail(!editEmail)}
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right: "10px",
                            cursor: "pointer",
                            color: editEmail ? "#212529" : "#6c757d",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                          }}
                        >
                          <CiEdit />
                        </span>
                      </div>
                    </Col>
                  </Row> */}


                  {/* Row 2 — Email full width */}
                  <Row className="g-2 mb-2">
                    <Col xs={12}>
                      <Form.Label
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Email Address
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(e.target.value)) {
                              setEmailError(
                                "Please enter a valid email address.",
                              );
                            } else {
                              setEmailError("");
                            }
                          }}
                          className={`rounded-3 ${emailError ? "is-invalid" : email && !emailError ? "is-valid" : ""}`}
                          disabled={!editEmail}
                          style={{
                            fontSize: "13px",
                            paddingRight: "36px",
                            background: editEmail ? "#fff" : "#f8f9fa",
                            color: editEmail ? "#212529" : "#6c757d",
                          }}
                        />
                        <span
                          onClick={() => {
                            setEditEmail(!editEmail);
                            setEmailError("");
                          }}
                          className="position-absolute top-50 translate-middle-y"
                          style={{
                            right:
                              emailError || (email && !emailError)
                                ? "19px"
                                : "10px",
                            cursor: "pointer",
                            color: editEmail ? "#212529" : "#6c757d",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                          }}
                        >
                          <CiEdit />
                        </span>
                      </div>
                      {emailError && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#dc3545",
                            marginTop: "4px",
                          }}
                        >
                          {emailError}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <hr className="my-2" />

                  <p
                    className="fw-semibold mb-2"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.5px",
                      color: "#6c757d",
                    }}
                  >
                    CHANGE PASSWORD
                  </p>

                  {/* Row 3 — New Password + Confirm Password */}
                  <Row className="g-2 mb-3">
                    <Form.Label style={{ fontSize: "12px", fontWeight: "500" }}>
                      New Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-3"
                        style={{ fontSize: "13px", paddingRight: "36px" }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="position-absolute top-50 translate-middle-y"
                        style={{
                          right: "10px",
                          cursor: "pointer",
                          color: "#6c757d",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showPassword ? <EyeCrossedIcon /> : <EyeIcon />}
                      </span>
                    </div>

                    <Form.Label style={{ fontSize: "12px", fontWeight: "500" }}>
                      Confirm
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-3"
                        style={{ fontSize: "13px", paddingRight: "36px" }}
                      />
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="position-absolute top-50 translate-middle-y"
                        style={{
                          right: "10px",
                          cursor: "pointer",
                          color: "#6c757d",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showConfirmPassword ? <EyeCrossedIcon /> : <EyeIcon />}
                      </span>
                    </div>
                  </Row>

                  <Button
                  type="submit"
                  // disabled={UpdateLoading}
                   disabled={!isDirty || UpdateLoading}
                    variant="dark"
                    className="w-100 rounded-3 fw-semibold"
                    style={{ fontSize: "14px", padding: "9px" }}
                  >
                    {UpdateLoading ? "Saving.." : "Save Change"}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/*  RIGHT SIDE BOOKINGS  */}
        <Col lg={8}>
          <Card className="border-0 shadow rounded-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">My Bookings</h4>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <ErrorMessage>{error?.data?.error}</ErrorMessage>
              ) : booking?.MyBooking?.length === 0 ? (
                <p className="text-muted">No bookings found.</p>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Vehicle</th>
                        <th>V.Number</th>
                        <th>Pickup</th>
                        <th>Drop</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking?.MyBooking?.map((booked) => (
                        <tr key={booked._id}>
                          {/* Vehicle Image + Name */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={booked?.vehicle?.image}
                                alt={booked?.vehicle?.name}
                                style={{
                                  width: "50px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                              <span
                                className="fw-semibold"
                                style={{ fontSize: "14px" }}
                              >
                                {booked?.vehicle?.name}
                              </span>
                            </div>
                          </td>
                            <td style={{ fontSize: "13px" }}>
                            {booked?.vehicle?.vehicleNumber}
                          </td>

                          {/* Pickup */}
                          <td style={{ fontSize: "13px" }}>
                            {booked.pickupLocation}
                          </td>

                          {/* Drop */}
                          <td style={{ fontSize: "13px" }}>
                            {booked.dropLocation}
                          </td>

                          {/* Date */}
                          <td style={{ fontSize: "13px" }}>
                            {booked.createdAt?.substring(0, 10)}
                          </td>

                          {/* Total */}
                          <td
                            className="text-success fw-bold"
                            style={{ fontSize: "13px" }}
                          >
                            Rs. {booked.totalPrice}
                          </td>

                          {/* Payment Badge */}
                          <td>
                            {booked?.payment?.isPaid ? (
                              <Badge bg="success">Paid</Badge>
                            ) : (
                              <Badge bg="danger">Pending</Badge>
                            )}
                          </td>

                          {/* Booking Status Badge */}
                          <td>
                            {booked?.bookingStatus ? (
                              <Badge bg="primary">Confirmed</Badge>
                            ) : (
                              <Badge bg="warning" text="dark">
                                Waiting
                              </Badge>
                            )}
                          </td>

                          {/* Action */}
                          <td>
                            <Link
                              to={`/booking/${booked._id}`}
                              className="btn btn-dark btn-sm"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProfilePage;
