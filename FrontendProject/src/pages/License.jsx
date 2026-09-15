import CheckOutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { FaIdCard, FaFileUpload, FaCheckCircle, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { SaveLicense } from "../Slices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import {
  useLicenseApiMutation,
  useLicenseCatagoryMutation,
  //  Imported but never actually used in active code
} from "../Slices/LicenseApiSlices";
import { useUploadImageMutation } from "../Slices/UploadsapiSlice";
import Loader from "../components/Loader";

function LicensePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // License and cart from Redux store
  const License = useSelector((state) => state.cart?.License || {});
  const cart = useSelector((state) => state.cart);

  //  RTK Query mutations
  const [LicenseApi, { isLoading: licenseLoading }] = useLicenseApiMutation();
  //  LicenseCatagory and licenseCatagoryLoading are destructured
  //    but both are commented out below and never used — safe to remove
  const [LicenseCatagory, { isLoading: licenseCatagoryLoading }] =
    useLicenseCatagoryMutation();
  const [uploadImage, { isLoading: uploadLoading }] = useUploadImageMutation();

  console.log("this is cart", cart.CartItems);

  // State Variables

  const [licesneNumber, setlicesneNumber] = useState("");
  const [fullname, setfullname] = useState("");
  // const [deteofBirth, setdeteofBirth] = useState("");
  const [issueDate, setissueDate] = useState("");
  const [expiryDate, setexpiryDate] = useState("");
  const [cotegory, setcotegory] = useState("");
  const [nagariktaNumber, setnagariktaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  //  selectedFile stores the actual File object for upload and preview
  const [selectedFile, setSelectedFile] = useState(null);

  // Nepal Districts List

  // File Change Handler
  const handleFileChange = (e) => {
    e.preventDefault();
    const { files } = e.target;
    if (files && files[0]) {
      // sets selectedFile for preview and upload
      setSelectedFile(files[0]);
    }
  };

  // Form Submit Handler

  const SubmitFormhandler = async (e) => {
    e.preventDefault();

    if (
      !licesneNumber ||
      !fullname ||
      // !deteofBirth ||
      !cotegory ||
      !expiryDate ||
      !selectedFile
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    //  expiry date could be before issue date

    if (
      issueDate &&
      expiryDate &&
      new Date(expiryDate) <= new Date(issueDate)
    ) {
      toast.error("Expiry date must be after issue date!");
      return;
    }

    try {
      setLoading(true);

      //  Upload the license image first
      const licenseImage = new FormData();
      licenseImage.append("image", selectedFile);
      const LicenseUpload = await uploadImage(licenseImage).unwrap();

      // Build the license data payload
      const licenseDate = {
        licesneNumber,
        fullname,
        // deteofBirth,
        issueDate,
        expiryDate,
        cotegory,
        image: LicenseUpload.image, //
        nagariktaNumber,
      };

      //  Call the license API
      const res = await LicenseApi(licenseDate).unwrap();
      console.log("this is license", res); //  Remove in production

      dispatch(
        SaveLicense({
          licesneNumber,
          fullname,
          // deteofBirth,
          issueDate,
          expiryDate,
          cotegory,
          nagariktaNumber,
          _id: res.createlicesne._id,
        }),
      );

      toast.success(res.message || " License add sucessfully!");

      // LicenseCatagory check is commented out — uncomment when ready
      // const catagorycheck = await LicenseCatagory({
      //   userId: res._id,
      //   vehicleId: cart.CartItems[0]._id,
      //   LicenseCatagory: cotegory,
      // }).unwrap();
      // console.log("category check", catagorycheck);

      navigate("/payment");
    } catch (err) {
      console.log(err);
      //  Shows backend error message if available, otherwise generic fallback
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to save license",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />

      <div className="gov-portal-wrapper">
        {/* Top Banner */}
        {/* <div className="gov-top-bar text-white d-flex justify-content-between align-items-center">
          <h4>License Verify Page</h4>
        </div> */}

        <Container className="my-5">
          <Row className="justify-content-center">
            <Col lg={9} md={12}>
              {/* Page Header */}
              <div className="portal-branding-header text-center mb-4">
                <h2 className="portal-title-text mt-2">
                  Driving License Certificate Portal
                </h2>
              </div>

              <Card className="shadow-sm portal-card-container">
                <Card.Header className="bg-white py-3 border-bottom-0">
                  <h4 className="form-section-heading text-center text-dark">
                    <small className="text-muted fs-6">
                      Fill out your official verified driving license records
                    </small>
                  </h4>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                  <Form onSubmit={SubmitFormhandler}>
                    <Row>
                      {/* Full Name */}
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="fullNameField">
                          <Form.Label className="fw-semibold">
                            Full Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={fullname}
                            onChange={(e) => setfullname(e.target.value)}
                            placeholder="Enter your full name as printed on card"
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* License Number — type="text" to allow dash-format like 12-34-56789 */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="licenseNoField">
                          <Form.Label className="fw-semibold">
                            License Number{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text" // type="text" so dash format works (type="number" would break it)
                            value={licesneNumber}
                            onChange={(e) => setlicesneNumber(e.target.value)}
                            placeholder="e.g. 12-34-56-78901"
                            required
                          />

                          <Form.Text
                            className="text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            Format rule must match: 00-00-00000000
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* Nagarikta Number */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="nagariktaNoField">
                          <Form.Label className="fw-semibold">
                            Nagarikta Number{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={nagariktaNumber}
                            onChange={(e) => setnagariktaNumber(e.target.value)}
                            placeholder="e.g. 12-34-56-78901"
                            required
                          />
                          <Form.Text
                            className="text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            Format rule must match: 00-00-00000000
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* Date of Birth */}
                      {/* <Col md={6} className="mb-3">
                        <Form.Group controlId="dateOfBirthField">
                          <Form.Label className="fw-semibold">
                            Date of Birth{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={deteofBirth}
                            onChange={(e) => setdeteofBirth(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col> */}

                      {/* Issue Date */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="issueDateField">
                          <Form.Label className="fw-semibold">
                            License Issue Date{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={issueDate}
                            onChange={(e) => setissueDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Expiry Date */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="expiryDateField">
                          <Form.Label className="fw-semibold">
                            License Expiry Date{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setexpiryDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Vehicle Category */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="categoryField">
                          <Form.Label className="fw-semibold">
                            Category <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="cotegory"
                            value={cotegory}
                            onChange={(e) => setcotegory(e.target.value)}
                            required
                          >
                            <option value="">-- Select Category --</option>
                            <option value="A">
                              Category A - Motorcycle / Scooter
                            </option>
                            <option value="B">
                              Category B - Car / Jeep / Van
                            </option>
                            <option value="C">
                              Category C - Heavy Truck / Bus
                            </option>
                            <option value="D">Category D - Tractor</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4 border-2 opacity-25" />

                    {/* File Upload Section */}
                    <h6
                      className="mb-3 text-primary text-uppercase fw-bold"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <FaFileUpload className="me-2" /> Digital Card Upload
                    </h6>

                    <Row className="mb-4 justify-content-center">
                      <Col md={8}>
                        <Form.Group
                          controlId="licenseFileField"
                          className="p-3 bg-light rounded border text-center"
                        >
                          <Form.Label className="fw-semibold small d-block mb-2">
                            License Card Front Copy
                          </Form.Label>

                          {/*  name="image" matches FormData key in handleFileChange */}
                          <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />

                          {selectedFile ? (
                            <div className="mt-3 position-relative">
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="License Preview"
                                className="img-thumbnail rounded"
                                style={{
                                  maxHeight: "180px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-block mx-auto mt-2 py-1"
                                onClick={() => setSelectedFile(null)}
                              >
                                ✕ Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="py-4 my-2 rounded bg-white border"
                              style={{ borderStyle: "dashed", color: "#aaa" }}
                            >
                              <FaIdCard className="text-muted opacity-50 fs-1 mb-2" />
                              <p
                                className="m-0 small"
                                style={{ fontSize: "12px" }}
                              >
                                No Document Image Uploaded Yet
                              </p>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* License Card Live Preview */}
                    <Col xs={12}>
                      <div className="mb-4">
                        <h6
                          className="mb-3 text-dark text-uppercase fw-bold"
                          style={{ fontSize: "0.85rem" }}
                        >
                          <FaCheckCircle className="text-success me-2" />
                          License Digital Card Preview
                        </h6>

                        <div
                          className="p-4 text-dark rounded shadow mx-auto position-relative"
                          style={{
                            maxWidth: "450px",
                            background:
                              "linear-gradient(135deg, #eef2f3 0%, #eaedef 100%)",
                            borderTop: "6px solid #b7d0f6",
                            fontFamily: "sans-serif",
                            minHeight: "240px",
                          }}
                        >
                          {/* Card Header */}
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3 border-secondary">
                            <div>
                              <h6
                                className="m-0 fw-bold text-primary"
                                style={{
                                  fontSize: "0.9rem",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                NEPAL DRIVING LICENSE
                              </h6>
                              <small
                                className="text-muted fw-bold"
                                style={{ fontSize: "10px" }}
                              >
                                SMART CARD PREVIEW
                              </small>
                            </div>
                            <span
                              className="badge bg-primary text-uppercase px-2 py-1"
                              style={{ fontSize: "9px" }}
                            >
                              Cat: {cotegory || "—"}
                            </span>
                          </div>

                          {/* Card Body */}
                          <Row className="g-0 align-items-center">
                            <Col
                              xs={4}
                              className="pe-3 text-center border-end border-secondary border-opacity-50"
                            >
                              {selectedFile ? (
                                <img
                                  src={URL.createObjectURL(selectedFile)} //  second call  use previewUrl state instead
                                  alt="User Avatar"
                                  className="img-fluid rounded"
                                  style={{
                                    maxHeight: "100px",
                                    objectFit: "cover",
                                    border: "1px solid #6c757d",
                                  }}
                                />
                              ) : (
                                <div
                                  className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center mx-auto"
                                  style={{ width: "80px", height: "95px" }}
                                >
                                  <FaUser className="text-secondary fs-2" />
                                </div>
                              )}
                            </Col>

                            {/* Live Preview Info  updates as user types  */}
                            <Col xs={8} className="ps-3 text-dark">
                              <div className="mb-1">
                                <span
                                  className="text-uppercase text-muted d-block"
                                  style={{ fontSize: "9px", fontWeight: "700" }}
                                >
                                  Name:
                                </span>
                                <span
                                  className="fw-bold text-uppercase"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {fullname || "YOUR FULL NAME"}
                                </span>
                              </div>

                              <div className="mb-1">
                                <span
                                  className="text-uppercase text-muted d-block"
                                  style={{ fontSize: "9px", fontWeight: "700" }}
                                >
                                  License No:
                                </span>
                                <span
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {licesneNumber || "XX-XX-XXXXXXXX"}
                                </span>
                              </div>

                              <Row className="g-0 mt-2 pt-1 border-top border-secondary border-opacity-25">
                                <Col xs={6}>
                                  <span
                                    className="text-muted d-block"
                                    style={{
                                      fontSize: "8px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    ISSUED:
                                  </span>
                                  <span
                                    className="fw-semibold small"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {issueDate || "YYYY-MM-DD"}
                                  </span>
                                </Col>
                                <Col xs={6}>
                                  <span
                                    className="text-muted d-block"
                                    style={{
                                      fontSize: "8px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    EXPIRY:
                                  </span>
                                  <span
                                    className="fw-semibold small text-danger"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {expiryDate || "YYYY-MM-DD"}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          {/* Card Footer */}
                          {/* <div className="mt-3 pt-1 border-top border-secondary border-opacity-25 text-center">
                            <small
                              className="text-muted"
                              style={{ fontSize: "9px" }}
                            >
                              DOB:{" "}
                              <span className="fw-bold text-dark">
                                {deteofBirth || "YYYY-MM-DD"}
                              </span>
                            </small>
                          </div> */}
                        </div>
                      </div>
                    </Col>

                    {/* Submit Button — disabled while loading to prevent double submit */}
                    <div className="d-grid mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="fw-semibold text-uppercase shadow-sm py-2"
                        style={{ fontSize: "1rem", letterSpacing: "0.5px" }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            {/* <Loader  className ="text-sm"/> */}
                            Processing Submission...
                          </>
                        ) : (
                          /// If loading is true  show the Loader and "Processing Submission..."
                          // If loading is false  show "Submit License"
                          " Submit License"
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default LicensePage;
