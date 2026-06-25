import { useState } from "react"; // this is store in satate
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

  //  FIXED: was " " (space) — causes nagariktaNumber validation to fail immediately
  //  State variables
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
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
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

  // add in status check
  {
    /*  showStatus true  */
  }
  {
    showStatus && statusData && (
      <Col xs={12} className="mb-3">
        <Alert variant={statusData.isVerified ? "success" : "warning"}>
          <div className="d-flex align-items-center gap-2">
            {statusData.isVerified ? (
              <>
                <span style={{ fontSize: "24px" }}>
                  <VscCopilotSuccess className="text-success" />
                </span>
                <div>
                  <strong>(Verified)</strong>
                  <br />
                  <small>
                    Verified at:{" "}
                    {new Date(statusData.verifiedAt).toLocaleDateString()}
                  </small>
                </div>
              </>
            ) : (
              <>
                <span style={{ fontSize: "24px" }}>⏳</span>
                <div>
                  <strong> (Pending)</strong>
                  <br />
                  <small>Admin only review</small>
                </div>
              </>
            )}
          </div>
        </Alert>
      </Col>
    );
  }

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
      setStatusMsg({ type: "danger", text: "Please fill all required fields" });
      return;
    }

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
      console.log( "this is nagarikta ", res);

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


      setStatusMsg({ type: "success", text: "Nagarikta saved successfully" });
      setShowStatus(true);
      setTimeout(() => {
        navigate("/license");
      }, 3000);
    } catch (err) {
      console.log(err);
      setStatusMsg({
        type: "danger",
        text:
          err?.data?.error || err?.data?.message || "Failed to save nagarikta",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckOutSteps step1 step2 step3 />

      <div className="gov-portal-wrapper">
        <div className="gov-top-bar text-white d-flex justify-content-between align-items-center">
          <h4>This is Nagarikta Verify Page</h4>
        </div>

        <Container className="my-5">
          <Row className="justify-content-center">
            <Col lg={9} md={12}>
              {/* Header */}
              <div className="portal-branding-header text-center mb-4">
                <h2 className="portal-title-text mt-2">
                  नेपाली नागरिकता प्रमाणीकरण
                </h2>
                <p className="text-muted sub-title">
                  Citizenship Certificate Verification
                </p>
              </div>

              <Card className="shadow-sm portal-card-container">
                <Card.Header className="bg-white py-3 border-bottom-0">
                  <h4 className="form-section-heading text-center text-dark">
                    नागरिकता प्रमाण पत्र प्रमाणित गर्नुहोस् <br />
                    <small className="text-muted fs-6">
                      Verify Your Citizenship Certificate
                    </small>
                  </h4>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                  {statusMsg.text && (
                    <Alert variant={statusMsg.type} className="mb-4">
                      {statusMsg.text}
                    </Alert>
                  )}
                  // this is add form status check
                  <Form onSubmit={handleFormSubmit}>
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
                            नागरिकता नम्बर (Citizenship Number){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          {/* ✅ FIXED: type="number" → type="text"
                              type="number" removes dashes from "12-34-56-78901"
                              which causes nagariktaNumber regex validation to FAIL on backend */}
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
                      {/* ✅ FIXED: controlId was "DateOfBirth" — DUPLICATE with permentAddress below
                          Duplicate controlId breaks label-input linking in HTML */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="dateOfBirthField">
                          <Form.Label className="fw-semibold">
                            जन्म मिति (Date of Birth){" "}
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
                            जारी मिति (Issue Date){" "}
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
                      {/* ✅ FIXED: controlId was "DateOfBirth" — DUPLICATE, now fixed to "permentAddressField" */}
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="permentAddressField">
                          <Form.Label className="fw-semibold">
                            स्थायी ठेगाना (Permanent Address){" "}
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
                            जारी जिल्ला (Issue District){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            value={issueDistrict}
                            onChange={(e) => setIssueDistrict(e.target.value)}
                            required
                          >
                            <option value="">
                              -- जिल्ला छान्नुहोस् (Select District) --
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

                          {/* Front Image Preview */}
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
                                ✅ Front image: {frontImg.name}
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
                            // Placeholder
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

                          {/* Back Image Preview */}
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
                                ✅ Back image: {backImg.name}
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
                            // Placeholder
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
                          : "प्रमाणित गर्नुहोस् (Verify Now)"}
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

// import React, {  useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Alert,
// } from "react-bootstrap";
// import CheckOutSteps from "../components/CheckoutSteps";
// import { FaAddressCard } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { saveNagarikta } from "../Slices/cartslice";
// import { useNavigate } from "react-router";
// import { useNagariktaApiMutation } from "../Slices/NagariktaApiSlice";
// import { useUploadImageMutation } from "../Slices/UploadsapiSlice";

// function NagariktaVerifyPage  () {
//   // state or cart slice ma stroe vako data reload garda ni browser bata  remove  hudain
//   // and useSelector used for redux store data  is show for project
// const Nagariktapage = useSelector((state) => state.cart?.Nagariktapage || {});
//   const cart = useSelector((state) => state.cart);
//   const [NagariktaApi , {isLoading: nagariktaLoading  }] = useNagariktaApiMutation();
//   const [uploadImage , {isLoading: uploadLoading }] = useUploadImageMutation();

//     const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // useEffect(()=>{
//   //   if(!Nagariktapage.citizenshipNo){
//   //     navigate("/nagarikta")
//   //   }
//   // },[Nagariktapage])

//   console.log("this is cart", cart.CartItems);
//   //  Individual states
//   const [citizenshipNo, setCitizenshipNo] = useState(
//     Nagariktapage.citizenshipNo || " ",
//   );
//   const [issueDistrict, setIssueDistrict] = useState(
//     Nagariktapage.issueDistrict || "",
//   );
//   const [issueDate, setIssueDate] = useState(Nagariktapage.issueDate || "");
//   const [DateOfBirth, setDateOfBirth] = useState(
//     Nagariktapage.DateOfBirth || "",
//   );
//   const [fullName, setFullName] = useState(Nagariktapage.fullName || "");
//   const [permentAddress, setpermentAddress] = useState(
//     Nagariktapage.permentAddress || "",
//   );
//   const [frontImg, setFrontImg] = useState(null);
//   const [backImg, setBackImg] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

//   const districts = [
//     "Achham",
//     "Arghakhanchi",
//     "Baglung",
//     "Baitadi",
//     "Bajhang",
//     "Bajura",
//     "Banke",
//     "Bara",
//     "Bardiya",
//     "Bhaktapur",
//     "Bhojpur",
//     "Chitwan",
//     "Dadeldhura",
//     "Dailekh",
//     "Dang",
//     "Darchula",
//     "Dhading",
//     "Dhankuta",
//     "Dhanusa",
//     "Dolakha",
//     "Dolpa",
//     "Doti",
//     "Gorkha",
//     "Gulmi",
//     "Humla",
//     "Ilam",
//     "Jajarkot",
//     "Jhapa",
//     "Jumla",
//     "Kailali",
//     "Kalikot",
//     "Kanchanpur",
//     "Kapilvastu",
//     "Kaski",
//     "Kathmandu",
//     "Kavrepalanchok",
//     "Khotang",
//     "Lalitpur",
//     "Lamjung",
//     "Mahottari",
//     "Makwanpur",
//     "Manang",
//     "Morang",
//     "Mugu",
//     "Mustang",
//     "Myagdi",
//     "Nawalpur",
//     "Nuwakot",
//     "Okhaldhunga",
//     "Palpa",
//     "Panchthar",
//     "Parbat",
//     "Parsa",
//     "Pyuthan",
//     "Ramechhap",
//     "Rasuwa",
//     "Rautahat",
//     "Rolpa",
//     "Rukum East",
//     "Rukum West",
//     "Rupandehi",
//     "Salyan",
//     "Sankhuwasabha",
//     "Saptari",
//     "Sarlahi",
//     "Sindhuli",
//     "Sindhupalchok",
//     "Siraha",
//     "Solukhumbu",
//     "Sunsari",
//     "Surkhet",
//     "Syangja",
//     "Tanahun",
//     "Taplejung",
//     "Terhathum",
//     "Udayapur",
//   ];

//   //  File handler
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       if (name === "frontImg") setFrontImg(files[0]);
//       if (name === "backImg") setBackImg(files[0]);
//     }
//   };

//   //  Submit handler
//   // const handleFormSubmit = async (e) => {
//   //   e.preventDefault();
//   //   dispatch(
//   //     saveNagarikta({
//   //       citizenshipNo,
//   //       issueDistrict,
//   //       issueDate,
//   //       DateOfBirth,
//   //       fullName,
//   //       permentAddress,
//   //     }),
//   //   );
//   //   setLoading(true);
//   //   setStatusMsg({ type: "", text: "" });
//   //   navigate("/license")

//   //   // Validation
//   //   if (!citizenshipNo || !issueDistrict || !issueDate) {
//   //     setStatusMsg({
//   //       type: "danger",
//   //       text: "Please fill all mandatory fields.",
//   //     });
//   //     setLoading(false);
//   //     return;
//   //   }

// const handleFormSubmit = async (e) => {
//   e.preventDefault();

//   if (
//     !citizenshipNo ||
//     !issueDistrict ||
//     !issueDate ||
//     !DateOfBirth ||
//     !fullName ||
//     !permentAddress ||
//     !frontImg ||
//     !backImg
//   ) {
//     setStatusMsg({
//       type: "danger",
//       text: "Please fill all required fields",
//     });
//     return;
//   }

//   try {
//     setLoading(true);

//     // Redux save
//     dispatch(
//       saveNagarikta({
//         citizenshipNo,
//         issueDistrict,
//         issueDate,
//         DateOfBirth,
//         fullName,
//         permentAddress,
//       })
//     );

//     // Upload Front Image
//     const frontData = new FormData();
//     frontData.append("image", frontImg);

//     const frontUpload = await uploadImage(frontData).unwrap();

//     // Upload Back Image
//     const backData = new FormData();
//     backData.append("image", backImg);

//     const backUpload = await uploadImage(backData).unwrap();

//     // Save Nagarikta
//     const nagariktaData = {
//       nagariktaNumber: citizenshipNo,
//       fullName,
//       dateofBirth: DateOfBirth,
//       permentAddress,
//       issueDate,
//       issueDistrict,
//       frontImage: frontUpload.image,
//       backImage: backUpload.image,
//     };

//     const res = await NagariktaApi(nagariktaData).unwrap();

//     console.log(res);

//     setStatusMsg({
//       type: "success",
//       text: "Nagarikta saved successfully",
//     });

//     navigate("/license");
//   } catch (err) {
//     console.log(err);

//     setStatusMsg({
//       type: "danger",
//       text:
//         err?.data?.error ||
//         err?.data?.message ||
//         "Failed to save nagarikta",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

//     // try {
//     //   const dataPayload = new FormData();
//     //   dataPayload.append("nagariktaNumber", citizenshipNo);
//     //   dataPayload.append("issueDate", issueDate);
//     //   dataPayload.append("issueDistrict", issueDistrict);
//     //   dataPayload.append("fullName", fullName);
//     //   if (frontImg) dataPayload.append("frontImage", frontImg);
//     //   if (backImg) dataPayload.append("backImage", backImg);

//     // const response = await fetch("/api/nagarikta/verify", {
//     //   method: "POST",
//     //   body: dataPayload,
//     // });

//     // const result = await response.json();

//     //     if (response.ok) {
//     //       setStatusMsg({
//     //         type: "success",
//     //         text: "Citizenship details submitted successfully for verification!",
//     //       });
//     //     } else {
//     //       setStatusMsg({
//     //         type: "danger",
//     //         text: result.message || "Verification submission failed.",
//     //       });
//     //     }
//     //   } catch (err) {
//     //     console.error("Submission error:", err);
//     //     setStatusMsg({
//     //       type: "danger",
//     //       text: "Network issue. Could not connect to verification server.",
//     //     });
//     //   } finally {
//     //     setLoading(false);
//     //   }
//   // };

//   return (
//     <>
//       <CheckOutSteps step1 step2 step3 />

//       <div className="gov-portal-wrapper">
//         {/* Top Ministry Banner */}
//         <div className="gov-top-bar text-white d-flex justify-content-between align-items-center">
//           <h4> this is nagarikta verify page </h4>
//         </div>

//         <Container className="my-5">
//           <Row className="justify-content-center">
//             <Col lg={9} md={12}>
//               {/* Header */}
//               <div className="portal-branding-header text-center mb-4">
//                 <h2 className="portal-title-text mt-2">
//                   नेपाली नागरिकता प्रमाणीकरण
//                 </h2>
//                 <p className="text-muted sub-title">
//                   Citizenship Certificate Verification
//                 </p>
//               </div>

//               <Card className="shadow-sm portal-card-container">
//                 <Card.Header className="bg-white py-3 border-bottom-0">
//                   <h4 className="form-section-heading text-center text-dark">
//                     नागरिकता प्रमाण पत्र प्रमाणित गर्नुहोस् <br />
//                     <small className="text-muted fs-6">
//                       Verify Your Citizenship Certificate
//                     </small>
//                   </h4>
//                 </Card.Header>

//                 <Card.Body className="px-4 pb-4">
//                   {statusMsg.text && (
//                     <Alert variant={statusMsg.type} className="mb-4">
//                       {statusMsg.text}
//                     </Alert>
//                   )}

//                   <Form onSubmit={handleFormSubmit}>
//                     <Row>
//                       {/* Full Name */}
//                       <Col md={12} className="mb-3">
//                         <Form.Group controlId="fullNameField">
//                           <Form.Label className="fw-semibold">
//                             पूरा नाम (Full Name){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={fullName}
//                             onChange={(e) => setFullName(e.target.value)}
//                             placeholder="Enter your full name as printed on card"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Citizenship Number */}
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="citizenshipNoField">
//                           <Form.Label className="fw-semibold">
//                             नागरिकता नम्बर (Citizenship Number){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             value={citizenshipNo}
//                             onChange={(e) => setCitizenshipNo(e.target.value)}
//                             placeholder="e.g. 12-34-56-78901"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="DateOfBirth">
//                           <Form.Label className="fw-semibold">
//                             जन्म मिति (Date of birth){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={DateOfBirth}
//                             onChange={(e) => setDateOfBirth(e.target.value)}
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Issue Date */}
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="issueDateField">
//                           <Form.Label className="fw-semibold">
//                             जारी मिति (Issue Date){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={issueDate}
//                             onChange={(e) => setIssueDate(e.target.value)}
//                             required
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="DateOfBirth">
//                           <Form.Label className="fw-semibold">
//                             स्थायी ठेगाना (Permanent Address){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={permentAddress}
//                             onChange={(e) => setpermentAddress(e.target.value)}
//                             placeholder="your permentAddress please "
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Issue District */}
//                       <Col md={12} className="mb-4">
//                         <Form.Group controlId="issueDistrictField">
//                           <Form.Label className="fw-semibold">
//                             जारी जिल्ला (Issue District){" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             value={issueDistrict}
//                             onChange={(e) => setIssueDistrict(e.target.value)}
//                             required
//                           >
//                             <option value="">
//                               -- जिल्ला छान्नुहोस् (Select District) --
//                             </option>
//                             {districts.map((dist, idx) => (
//                               // React requires a unique key for items rendered in a list.
//                               <option key={idx} value={dist.toLowerCase()}>
//                                 {/* The value sent when the option is selected is converted to lowercase. */}
//                                 {dist}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <hr className="my-4 text-muted" />

//                     {/* File Uploads */}
//                     <h5 className="mb-3 text-secondary text-uppercase fs-6">
//                       Document Attachments
//                     </h5>
//                     <Row>
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="frontImgField">
//                           <Form.Label className="fw-semibold">
//                             Front Side Image{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="file"
//                             name="frontImg"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             required
//                           />
//                           <Form.Text className="text-muted">
//                             Clear photo of the front side
//                           </Form.Text>

//                           {/*  Front Image Preview */}
//                           {frontImg && (
//                             <div className="mt-2 text-center">
//                               <img
//                                 src={URL.createObjectURL(frontImg)}
//                                 alt="Front Preview"
//                                 style={{
//                                   width: "100%",
//                                   maxHeight: "200px",
//                                   objectFit: "cover",
//                                   borderRadius: "8px",
//                                   border: "2px solid #0d6efd",
//                                   marginTop: "8px",
//                                 }}
//                               />
//                               <p
//                                 className="text-success mt-1 mb-0"
//                                 style={{ fontSize: "13px" }}
//                               >
//                                 Front image selected: {frontImg.name}
//                               </p>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 className="mt-1"
//                                 onClick={() => setFrontImg(null)}
//                               >
//                                 ✕ Remove
//                               </Button>
//                             </div>
//                           )}

//                           {/*  Placeholder when no image */}
//                           {!frontImg && (
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "150px",
//                                 border: "2px dashed #ccc",
//                                 borderRadius: "8px",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 marginTop: "8px",
//                                 backgroundColor: "#f8f9fa",
//                                 color: "#aaa",
//                               }}
//                             >
//                               <span style={{ fontSize: "40px" }}>
//                                 <FaAddressCard className="text-primary" />
//                               </span>
//                               <span style={{ fontSize: "13px" }}>
//                                 Front side preview
//                               </span>
//                             </div>
//                           )}
//                         </Form.Group>
//                       </Col>

//                       <Col md={6} className="mb-4">
//                         <Form.Group controlId="backImgField">
//                           <Form.Label className="fw-semibold">
//                             Back Side Image{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="file"
//                             name="backImg"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             required
//                           />
//                           <Form.Text className="text-muted">
//                             Clear photo of the back side
//                           </Form.Text>

//                           {/* ✅ Back Image Preview */}
//                           {backImg && (
//                             <div className="mt-2 text-center">
//                               <img
//                                 src={URL.createObjectURL(backImg)}
//                                 alt="Back Preview"
//                                 style={{
//                                   width: "100%",
//                                   maxHeight: "200px",
//                                   objectFit: "cover",
//                                   borderRadius: "8px",
//                                   border: "2px solid #0d6efd",
//                                   marginTop: "8px",
//                                 }}
//                               />
//                               <p
//                                 className="text-success mt-1 mb-0"
//                                 style={{ fontSize: "13px" }}
//                               >
//                                 ✅ Back image selected: {backImg.name}
//                               </p>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 className="mt-1"
//                                 onClick={() => setBackImg(null)}
//                               >
//                                 ✕ Remove
//                               </Button>
//                             </div>
//                           )}

//                           {/* Placeholder when no image */}
//                           {!backImg && (
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "150px",
//                                 border: "2px dashed #ccc",
//                                 borderRadius: "8px",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 marginTop: "8px",
//                                 backgroundColor: "#f8f9fa",
//                                 color: "#aaa",
//                               }}
//                             >
//                               <span style={{ fontSize: "40px" }}>
//                                 <FaAddressCard className="text-primary" />
//                               </span>
//                               <span style={{ fontSize: "13px" }}>
//                                 Back side preview
//                               </span>
//                             </div>
//                           )}
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Col xs={12}>
//                       <div className="form-section">
//                         <h5>
//                           <FaAddressCard className="text-primary" />
//                           Live Preview
//                         </h5>
//                         <div className="preview-box">
//                           <div className="d-flex gap-3 align-items-center">
//                             <div>
//                               <h5 style={{ color: "white" }}>
//                                 {fullName || "Your Full Name"}
//                               </h5>
//                               <p style={{ margin: "4px 0", opacity: 0.9 }}>
//                                 {citizenshipNo || "XX-XX-XX-XXXXX"}
//                               </p>
//                               <p style={{ margin: "4px 0", opacity: 0.9 }}>
//                                 {permentAddress || "you address "}
//                               </p>
//                               <p style={{ margin: "4px 0", opacity: 0.9 }}>
//                                 {issueDistrict || "you issueDistrict "}
//                               </p>
//                               <p style={{ margin: "4px 0", opacity: 0.9 }}>
//                                 {issueDate || "you issueDate "}
//                               </p>
//                               <small>
//                                 Date of Birth: {DateOfBirth || "DD-MM-YYYY"}
//                               </small>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </Col>

//                     {/* Submit Button */}
//                     <div className="d-grid mt-3">
//                       <Button
//                         type="submit"
//                         variant="primary"
//                         size="lg"
//                         className="submit-verify-btn"
//                         disabled={loading}
//                       >
//                         {loading
//                           ? "Processing Verification..."
//                           : "प्रमाणित गर्नुहोस् (Verify Now)"}
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card.Body>
//               </Card>

//               {/* Footer */}
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default NagariktaVerifyPage;
