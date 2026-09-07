
import { useState } from "react"; 
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import CheckOutSteps from "../components/CheckoutSteps";
import { FaAddressCard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveNagarikta } from "../Slices/cartslice";
import { useNavigate } from "react-router";
import { useNagariktaApiMutation } from "../Slices/NagariktaApiSlice";
import { useUploadImageMutation } from "../Slices/UploadsapiSlice";
import { useGetMyNagariktaStatusQuery } from "../Slices/NagariktaApiSlice";
import { FcOk } from "react-icons/fc";
import { toast } from "react-toastify";


function NagariktaVerifyPage() {
  const Nagariktapage = useSelector((state) => state.cart?.Nagariktapage || {});
  const cart = useSelector((state) => state.cart);
  const [NagariktaApi, { isLoading: nagariktaLoading }] =
    useNagariktaApiMutation();
  const { data: statusData, isLoading: statusLoading } =
    useGetMyNagariktaStatusQuery();
  const [uploadImage, { isLoading: uploadLoading }] = useUploadImageMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("this is cart", cart.CartItems);

  const [citizenshipNo, setCitizenshipNo] = useState(
    Nagariktapage.citizenshipNo || "",
  );
  const [issueDistrict, setIssueDistrict] = useState(
    Nagariktapage.issueDistrict || "",
  );
  const [issueDate, setIssueDate] = useState(Nagariktapage.issueDate || "");
  const [DateOfBirth, setDateOfBirth] = useState(
    Nagariktapage.DateOfBirth || "",
  );
  const [fullName, setFullName] = useState(Nagariktapage.fullName || "");
  const [permentAddress, setpermentAddress] = useState(
    Nagariktapage.permentAddress || "",
  );
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

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

  // File handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "frontImg") setFrontImg(files[0]);
      if (name === "backImg") setBackImg(files[0]);
    }
  };

  // Submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !citizenshipNo ||
      !issueDistrict ||
      !issueDate ||
      !DateOfBirth ||
      !fullName ||
      !permentAddress ||
      !frontImg ||
      !backImg
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    // If this user already has a citizenship number on file, the entered
    // number must match it. A mismatch is rejected before any upload/save call.
    // if (
    //   statusData?.nagariktaNumber &&
    //   statusData.nagariktaNumber !== citizenshipNo
    // ) {
    //   toast.error("Invalid citizenship number");
    //   return;
    // }
    try {
      setLoading(true);
      // Upload Front Image
      const frontData = new FormData();
      frontData.append("image", frontImg);
      const frontUpload = await uploadImage(frontData).unwrap();
      // Upload Back Image
      const backData = new FormData();
      backData.append("image", backImg);
      const backUpload = await uploadImage(backData).unwrap();
      // Save Nagarikta in mongo db
      const nagariktaData = {
        nagariktaNumber: citizenshipNo, // must match backend regex e.g. "12-34-56-78901"
        fullName,
        dateofBirth: DateOfBirth,
        permentAddress,
        issueDate,
        issueDistrict,
        frontImage: frontUpload.image,
        backImage: backUpload.image,
      };
      const res = await NagariktaApi(nagariktaData).unwrap();
      console.log("this is nagarikta ", res);
      dispatch(
        saveNagarikta({
          citizenshipNo,
          issueDistrict,
          issueDate,
          DateOfBirth,
          fullName,
          permentAddress,
          _id: res._id || res.userNarikta?._id,
        }),
      );
      toast.success("Nagarikta saved successfully");
      setShowStatus(true);
      setTimeout(() => {
        navigate("/license");
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to save nagarikta",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckOutSteps step1 step2 step3 />

      <div className="gov-portal-wrapper">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col lg={9} md={12}>
              {/* Header */}
              <div className="portal-branding-header text-center mb-4">
                <h2 className="portal-title-text mt-2">
                  Citizenship Certificate Verification
                </h2>
              </div>

              <Card className="shadow-sm portal-card-container">
                <Card.Header className="bg-white py-3 border-bottom-0">
                  <h4 className="form-section-heading text-center text-dark">
                    <small className="text-muted fs-6">
                      Verify Your Citizenship Certificate
                    </small>
                  </h4>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                  <Form onSubmit={handleFormSubmit}>
                    <Row>
                      {/* Full Name */}
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="fullNameField">
                          <Form.Label className="fw-semibold">
                            Full Name{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name as printed on card"
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Citizenship Number */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="citizenshipNoField">
                          <Form.Label className="fw-semibold">
                             Citizenship Number{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={citizenshipNo}
                            onChange={(e) => setCitizenshipNo(e.target.value)}
                            placeholder="e.g. 12-34-56-78901"
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Date of Birth */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="dateOfBirthField">
                          <Form.Label className="fw-semibold">
                              Date of Birth{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={DateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Issue Date */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="issueDateField">
                          <Form.Label className="fw-semibold">
                              Issue Date {" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Permanent Address */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="permentAddressField">
                          <Form.Label className="fw-semibold">
                              Permanent Address{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={permentAddress}
                            onChange={(e) => setpermentAddress(e.target.value)}
                            placeholder="Your permanent address"
                            required
                          />
                        </Form.Group>
                      </Col>

                      {/* Issue District */}
                      <Col md={12} className="mb-4">
                        <Form.Group controlId="issueDistrictField">
                          <Form.Label className="fw-semibold">
                              Issue District{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={issueDistrict}
                            onChange={(e) => setIssueDistrict(e.target.value)}
                            required
                          >
                            <option value="">
                                Select District
                                  </option>
                            {districts.map((dist, idx) => (
                              <option key={idx} value={dist.toLowerCase()}>
                                {dist}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4 text-muted" />

                    {/* File Uploads */}
                    <h5 className="mb-3 text-secondary text-uppercase fs-6">
                      Document Attachments
                    </h5>

                    <Row>
                      {/* Front Image */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="frontImgField">
                          <Form.Label className="fw-semibold">
                            Front Side Image{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="frontImg"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />
                          <Form.Text className="text-muted">
                            Clear photo of the front side
                          </Form.Text>

                          {frontImg ? (
                            <div className="mt-2 text-center">
                              <img
                                src={URL.createObjectURL(frontImg)}
                                alt="Front Preview"
                                className="img-fluid rounded border border-primary mt-2"
                                style={{
                                  maxHeight: "200px",
                                  objectFit: "cover",
                                }}
                              /> 
                              <p className="text-success mt-1 mb-0 small">
                                   <FcOk/>
                               Front image: {frontImg.name}
                              </p>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-1"
                                onClick={() => setFrontImg(null)}
                              >
                                ✕ Remove
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center mt-2 bg-light rounded text-muted"
                              style={{ height: 150, border: "2px dashed #ccc" }}
                            >
                              <FaAddressCard className="text-primary fs-1" />
                              <span className="small">Front side preview</span>
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      {/* Back Image */}
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="backImgField">
                          <Form.Label className="fw-semibold">
                            Back Side Image{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="backImg"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />
                          <Form.Text className="text-muted">
                            Clear photo of the back side
                          </Form.Text>

                          {backImg ? (
                            <div className="mt-2 text-center">
                              <img
                                src={URL.createObjectURL(backImg)}
                                alt="Back Preview"
                                className="img-fluid rounded border border-primary mt-2"
                                style={{
                                  maxHeight: "200px",
                                  objectFit: "cover",
                                }}
                              />
                              <p className="text-success mt-1 mb-0 small">
                                <FcOk />
 Back image: {backImg.name}
                              </p>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-1"
                                onClick={() => setBackImg(null)}
                              >
                                ✕ Remove
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center mt-2 bg-light rounded text-muted"
                              style={{ height: 150, border: "2px dashed #ccc" }}
                            >
                              <FaAddressCard className="text-primary fs-1" />
                              <span className="small">Back side preview</span>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Live Preview */}
                    <Col xs={12}>
                      <div className="form-section">
                        <h5>
                          <FaAddressCard className="text-primary" /> Live
                          Preview
                        </h5>
                        <div className="preview-box">
                          <div className="d-flex gap-3 align-items-center">
                            <div>
                              <h5 style={{ color: "white" }}>
                                {fullName || "Your Full Name"}
                              </h5>
                              <p style={{ margin: "4px 0", opacity: 0.9 }}>
                                {citizenshipNo || "XX-XX-XX-XXXXX"}
                              </p>
                              <p style={{ margin: "4px 0", opacity: 0.9 }}>
                                {permentAddress || "Your Address"}
                              </p>
                              <p style={{ margin: "4px 0", opacity: 0.9 }}>
                                {issueDistrict || "Issue District"}
                              </p>
                              <p style={{ margin: "4px 0", opacity: 0.9 }}>
                                {issueDate || "Issue Date"}
                              </p>
                              <small>
                                Date of Birth: {DateOfBirth || "DD-MM-YYYY"}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Submit Button */}
                    <div className="d-grid mt-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="submit-verify-btn"
                        disabled={loading || nagariktaLoading || uploadLoading}
                      >
                        {loading || nagariktaLoading || uploadLoading
                          ? "Processing Verification..."
                          : "  Verify Now"}
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

export default NagariktaVerifyPage;