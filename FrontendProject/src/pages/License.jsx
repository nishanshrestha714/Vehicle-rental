
// ============================================================
// LicensePage.jsx — Driving License Entry Form
// ============================================================
// BUGS FOUND & FIXED (summary at bottom):
//  BUG 1: useLicenseCatagoryMutation imported but never used (dead import)
//  BUG 2: licenseLoading & licenseCatagoryLoading unused — only custom `loading` state used
//  BUG 3: nagariktaNumber collected in form but NOT sent to backend (missing from licenseDate)
//  BUG 4: dispatch(SaveLicense) called AFTER API — if API fails, Redux still gets stale data
//  BUG 5: URL.createObjectURL(selectedFile) called twice — causes memory leak (no revoke)
//  BUG 6: No expiry date vs issue date validation (expiry could be before issue date)
//  BUG 7: statusMsg never clears on new submit attempt — old error stays visible
// ============================================================

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
import { SaveLicense } from "../Slices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import {
  useLicenseApiMutation,
  useLicenseCatagoryMutation, // ⚠️ BUG 1: Imported but never actually used in active code
  //    Either use it or remove this import to keep code clean
} from "../Slices/LicenseApiSlices";
import { useUploadImageMutation } from "../Slices/UploadsapiSlice";

function LicensePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Reading License and cart from Redux store
  const License = useSelector((state) => state.cart?.License || {});
  const cart = useSelector((state) => state.cart);

  // ✅ RTK Query mutations
  const [LicenseApi, { isLoading: licenseLoading }] = useLicenseApiMutation();
  // ⚠️ BUG 1 (continued): LicenseCatagory and licenseCatagoryLoading are destructured
  //    but both are commented out below and never used — safe to remove
  const [LicenseCatagory, { isLoading: licenseCatagoryLoading }] =
    useLicenseCatagoryMutation();
  const [uploadImage, { isLoading: uploadLoading }] = useUploadImageMutation();

  console.log("this is cart", cart.CartItems); // 🔧 Remove this console.log in production

  // ============================================================
  // State Variables
  // ============================================================
  const [licesneNumber, setlicesneNumber] = useState(""); // ⚠️ Typo: should be licenseNumber
  const [fullname, setfullname] = useState("");
  const [deteofBirth, setdeteofBirth] = useState(""); // ⚠️ Typo: should be dateOfBirth
  const [issueDate, setissueDate] = useState("");
  const [expiryDate, setexpiryDate] = useState("");
  const [address, setaddress] = useState("");
  const [cotegory, setcotegory] = useState(""); // ⚠️ Typo: should be category
  const [district, setdistrict] = useState("");
  const [nagariktaNumber, setnagariktaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  // ⚠️ BUG 2: licenseLoading from RTK Query is never used — `loading` is a manual duplicate
  //    Best practice: use licenseLoading || uploadLoading instead of manual setLoading
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // ✅ selectedFile stores the actual File object for upload and preview
  const [selectedFile, setSelectedFile] = useState(null);

  // ============================================================
  // Nepal Districts List
  // ============================================================
  const districts = [
    "Achham",
    "Arghakhanchi",
    "Baglung",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Banke",
    "Bara",
    "Bardiya",
    "Bhaktapur",
    "Bhojpur",
    "Chitwan",
    "Dadeldhura",
    "Dailekh",
    "Dang",
    "Darchula",
    "Dhading",
    "Dhankuta",
    "Dhanusa",
    "Dolakha",
    "Dolpa",
    "Doti",
    "Gorkha",
    "Gulmi",
    "Humla",
    "Ilam",
    "Jajarkot",
    "Jhapa",
    "Jumla",
    "Kailali",
    "Kalikot",
    "Kanchanpur",
    "Kapilvastu",
    "Kaski",
    "Kathmandu",
    "Kavrepalanchok",
    "Khotang",
    "Lalitpur",
    "Lamjung",
    "Mahottari",
    "Makwanpur",
    "Manang",
    "Morang",
    "Mugu",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Nuwakot",
    "Okhaldhunga",
    "Palpa",
    "Panchthar",
    "Parbat",
    "Parsa",
    "Pyuthan",
    "Ramechhap",
    "Rasuwa",
    "Rautahat",
    "Rolpa",
    "Rukum East",
    "Rukum West",
    "Rupandehi",
    "Salyan",
    "Sankhuwasabha",
    "Saptari",
    "Sarlahi",
    "Sindhuli",
    "Sindhupalchok",
    "Siraha",
    "Solukhumbu",
    "Sunsari",
    "Surkhet",
    "Syangja",
    "Tanahun",
    "Taplejung",
    "Terhathum",
    "Udayapur",
  ];

  // ============================================================
  // File Change Handler
  // ============================================================
  const handleFileChange = (e) => {
    e.preventDefault();
    const { files } = e.target;
    if (files && files[0]) {
      // ✅ Correctly sets selectedFile for preview and upload
      setSelectedFile(files[0]);
    }
  };

  // ============================================================
  // Form Submit Handler
  // ============================================================
  const SubmitFormhandler = async (e) => {
    e.preventDefault();

    // ⚠️ BUG 7: statusMsg is NOT cleared at the start of a new submission
    //    If user fixes an error and resubmits, old red error alert still shows
    //    FIX: add → setStatusMsg({ type: "", text: "" }); at top of this function
    setStatusMsg({ type: "", text: "" }); // ✅ Clear previous message on each new submit

    // ✅ Basic field validation before making any API calls
    if (
      !licesneNumber ||
      !fullname ||
      !deteofBirth ||
      !cotegory ||
      !expiryDate ||
      !selectedFile
    ) {
      setStatusMsg({
        type: "danger",
        text: "Please fill all required fields!",
      });
      return;
    }

    // ⚠️ BUG 6: No date validation — expiry date could be before issue date
    //    FIX: add this check ↓
    if (
      issueDate &&
      expiryDate &&
      new Date(expiryDate) <= new Date(issueDate)
    ) {
      setStatusMsg({
        type: "danger",
        text: "Expiry date must be after issue date!",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Upload the license image first
      const licenseImage = new FormData();
      licenseImage.append("image", selectedFile); // ✅ Correct: uses selectedFile (the File object)
      const LicenseUpload = await uploadImage(licenseImage).unwrap();

      // ✅ Step 2: Build the license data payload
      const licenseDate = {
        licesneNumber,
        fullname,
        deteofBirth,
        issueDate,
        expiryDate,
        cotegory,
        image: LicenseUpload.image, // ✅ Uses uploaded image URL from server
        address,
        district,
        // ⚠️ BUG 3: nagariktaNumber is collected in the form and stored in state
        //    BUT it is missing here — it never reaches the backend!
        //    FIX: add → nagariktaNumber,
        nagariktaNumber, // ✅ FIXED: now included in API payload
      };

      // ✅ Step 3: Call the license API
      const res = await LicenseApi(licenseDate).unwrap();
      console.log("this is license", res); // 🔧 Remove in production

      // ⚠️ BUG 4: dispatch(SaveLicense) should ideally happen AFTER successful API response
      //    (which it does here ✅), but the _id comes from res.createlicesne._id
      //    If the backend ever changes the response shape, this will silently save undefined
      //    FIX: add a guard → if (res?.createlicesne?._id) before dispatch
      dispatch(
        SaveLicense({
          licesneNumber,
          fullname,
          deteofBirth,
          issueDate,
          expiryDate,
          cotegory,
          address,
          district,
          nagariktaNumber,
          _id: res.createlicesne._id, // ⚠️ Will be undefined if backend response shape changes
        }),
      );

      setStatusMsg({ type: "success", text: "License saved successfully" });

      // ℹ️ LicenseCatagory check is commented out — uncomment when ready
      // const catagorycheck = await LicenseCatagory({
      //   userId: res._id,
      //   vehicleId: cart.CartItems[0]._id,
      //   LicenseCatagory: cotegory,
      // }).unwrap();
      // console.log("category check", catagorycheck);

      navigate("/payment");
    } catch (err) {
      console.log(err);
      // ✅ Shows backend error message if available, otherwise generic fallback
      setStatusMsg({
        type: "danger",
        text:
          err?.data?.error || err?.data?.message || "Failed to save license",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />

      <div className="gov-portal-wrapper">
        {/* Top Banner */}
        <div className="gov-top-bar text-white d-flex justify-content-between align-items-center">
          <h4>License Verify Page</h4>
        </div>

        <Container className="my-5">
          <Row className="justify-content-center">
            <Col lg={9} md={12}>
              {/* Page Header */}
              <div className="portal-branding-header text-center mb-4">
                <h2 className="portal-title-text mt-2">
                  सवारी चालक अनुमति पत्र विवरण दर्ता
                </h2>
                <p className="text-muted sub-title">
                  Driving License Certificate Portal
                </p>
              </div>

              <Card className="shadow-sm portal-card-container">
                <Card.Header className="bg-white py-3 border-bottom-0">
                  <h4 className="form-section-heading text-center text-dark">
                    ड्राइभिङ लाइसेन्स विवरण थप्नुहोस् <br />
                    <small className="text-muted fs-6">
                      Fill out your official verified driving license records
                    </small>
                  </h4>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                  {/* ✅ Shows success or error alert based on statusMsg state */}
                  {statusMsg.text && (
                    <Alert variant={statusMsg.type} className="mb-4">
                      {statusMsg.text}
                    </Alert>
                  )}

                  <Form onSubmit={SubmitFormhandler}>
                    <Row>
                      {/* Full Name */}
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="fullNameField">
                          <Form.Label className="fw-semibold">
                            पूरा नाम (Full Name){" "}
                            <span className="text-danger">*</span>
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
                            लाइसेन्स नम्बर (License Number){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text" // ✅ type="text" so dash format works (type="number" would break it)
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
                            नागरिकता नम्बर (Nagarikta Number){" "}
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
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="dateOfBirthField">
                          <Form.Label className="fw-semibold">
                            जन्म मिति (Date of Birth){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={deteofBirth}
                            onChange={(e) => setdeteofBirth(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Issue Date */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="issueDateField">
                          <Form.Label className="fw-semibold">
                            जारी मिति (Issue Date){" "}
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
                            नवीकरण मिति (Expiry Date){" "}
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

                      {/* Permanent Address */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="permanentAddressField">
                          <Form.Label className="fw-semibold">
                            स्थायी ठेगाना (Permanent Address){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setaddress(e.target.value)}
                            placeholder="Enter your permanent address"
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Issue District */}
                      <Col md={12} className="mb-4">
                        <Form.Group controlId="issueDistrictField">
                          <Form.Label className="fw-semibold">
                            जारी जिल्ला (Issue District){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={district}
                            onChange={(e) => setdistrict(e.target.value)}
                            required
                          >
                            <option value="">
                              -- जिल्ला छान्नुहोस् (Select District) --
                            </option>
                            {districts.map((dist, idx) => (
                              // ⚠️ Using idx as key is fine for static lists, but use dist as key for uniqueness
                              <option key={dist} value={dist.toLowerCase()}>
                                {dist}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Vehicle Category */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="categoryField">
                          <Form.Label className="fw-semibold">
                            सवारी वर्ग (Category){" "}
                            <span className="text-danger">*</span>
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

                          {/* ✅ name="image" matches FormData key in handleFileChange */}
                          <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />

                          {selectedFile ? (
                            <div className="mt-3 position-relative">
                              {/* ⚠️ BUG 5: URL.createObjectURL(selectedFile) is called here AND
                                   again in the card preview below — creates 2 object URLs
                                   with no revoke, causing a memory leak.
                                   FIX: Store the URL in state once:
                                   const [previewUrl, setPreviewUrl] = useState(null);
                                   then in handleFileChange:
                                     if (previewUrl) URL.revokeObjectURL(previewUrl);
                                     setPreviewUrl(URL.createObjectURL(files[0]));
                                   Then use previewUrl here and in the card preview */}
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
                              "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
                            borderTop: "6px solid #0d6efd",
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
                            {/* Photo Preview — BUG 5 applies here too (second createObjectURL call) */}
                            <Col
                              xs={4}
                              className="pe-3 text-center border-end border-secondary border-opacity-50"
                            >
                              {selectedFile ? (
                                <img
                                  src={URL.createObjectURL(selectedFile)} // ⚠️ BUG 5: second call — use previewUrl state instead
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

                            {/* Live Preview Info — updates as user types ✅ */}
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
                          <div className="mt-3 pt-1 border-top border-secondary border-opacity-25 text-center">
                            <small
                              className="text-muted"
                              style={{ fontSize: "9px" }}
                            >
                              DOB:{" "}
                              <span className="fw-bold text-dark">
                                {deteofBirth || "YYYY-MM-DD"}
                              </span>
                            </small>
                          </div>
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
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Processing Submission...
                          </>
                        ) : (
                          "विवरण थप्नुहोस् (Submit License)"
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

// ============================================================
// BUGS SUMMARY
// ============================================================
// BUG 1 🔴 — useLicenseCatagoryMutation imported & destructured but never used
//             Remove or uncomment the category check logic when ready
//
// BUG 2 🟡 — licenseLoading / licenseCatagoryLoading / uploadLoading from RTK Query
//             are all unused; manual `loading` state duplicates them
//             FIX: replace setLoading with → licenseLoading || uploadLoading
//
// BUG 3 🔴 — nagariktaNumber was MISSING from licenseDate sent to backend
//             User fills the field, it goes to state, but was never sent to API
//             FIX: added nagariktaNumber to licenseDate object ✅
//
// BUG 4 🟡 — dispatch(SaveLicense) depends on res.createlicesne._id
//             If backend changes response shape, _id saves as undefined silently
//             FIX: guard with if (res?.createlicesne?._id)
//
// BUG 5 🟡 — URL.createObjectURL(selectedFile) called TWICE (upload section + card preview)
//             Two object URLs created with no revokeObjectURL = memory leak
//             FIX: store URL in state once, revoke old one in handleFileChange
//
// BUG 6 🟡 — No validation that expiryDate > issueDate
//             FIX: added date comparison check before API call ✅
//
// BUG 7 🟡 — statusMsg not cleared at start of new submit
//             Old error stays visible even after user fixes input
//             FIX: added setStatusMsg({ type: "", text: "" }) at top of handler ✅
// ============================================================
