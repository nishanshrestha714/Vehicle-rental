

// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Alert,
//   Spinner
// } from "react-bootstrap";
// import CheckOutSteps from "../components/CheckoutSteps";
// import { FaIdCard, FaFileUpload, FaCheckCircle, FaUser } from "react-icons/fa";
// import axios from "axios"; // Assuming you use axios for API requests
// import { useNavigate } from "react-router";

// const AddLicensePage = () => {
//   const navigate = useNavigate();
  
//   // Keeping exact state keys to match your backend model fields/typos
//   const [formData, setFormData] = useState({
//     licesneNumber: "",
//     fullname: "",
//     deteofBirth: "",
//     issueDate: "",
//     expiryDate: "",
//     cotegory: "",
//     image: "license.png", // fallback default
//   });

//   const [loading, setLoading] = useState(false);
//   const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       // If your backend expects a filename string placeholder instead of file stream upload:
//       setFormData((prev) => ({ ...prev, image: e.target.files[0].name }));
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setStatusMsg({ type: "", text: "" });
//     setLoading(true);

//     try {
//       // Replace with your actual backend configuration endpoint
//       const response = await axios.post("/api/license/addlicense", formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setStatusMsg({
//         type: "success",
//         text: response.data.message || "Your license was added successfully!",
//       });

//       // Clear form states or navigate on success
//       setTimeout(() => {
//         navigate("/next-step"); // Replace with your target success route
//       }, 2000);

//     } catch (error) {
//       const errorMsg = error.response?.data?.error || "Failed to save driving license. Try again.";
//       setStatusMsg({
//         type: "danger",
//         text: errorMsg,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Checkout Wizard Steps Wrapper */}
//       <Container className="py-4">
//         <Row className="justify-content-center">
//           <Col lg={9} md={12}>
//             {/* Activating step 4 for driving license process context */}
//             <CheckOutSteps step1 step2 step3 step4 />
//           </Col>
//         </Row>
//       </Container>

//       <div className="gov-portal-wrapper">
//         <Container className="mb-5">
//           <Row className="justify-content-center">
//             <Col lg={9} md={12}>
              
//               {/* Portal Identity Branding Header */}
//               <div className="text-center mb-4 p-3 bg-light rounded shadow-sm border-start border-4 border-primary">
//               
//                 <p className="text-muted text-uppercase fw-semibold small m-0 mt-1" style={{ letterSpacing: "1px" }}>
//                   Driving License Certificate Portal
//                 </p>
//               </div>

//               {/* Main Core Layout Wrapper */}
//               <Card className="shadow border-0 rounded-3 overflow-hidden">
//                 <Card.Header className="bg-dark text-white text-center py-3">
//                   <h5 className="m-0 fw-semibold text-uppercase" style={{ fontSize: "1.05rem", letterSpacing: "0.5px" }}>
//                    
//                   </h5>
//                   <small className="text-muted">Fill out your official verified driving license records</small>
//                 </Card.Header>

//                 <Card.Body className="p-4 p-md-5 bg-white">
//                   {statusMsg.text && (
//                     <Alert variant={statusMsg.type} className="mb-4 shadow-sm" dismissible onClose={() => setStatusMsg({ type: "", text: "" })}>
//                       {statusMsg.text}
//                     </Alert>
//                   )}

//                   <Form onSubmit={handleFormSubmit}>
//                     <Row>
//                       {/* Full Name */}
//                       <Col md={12} className="mb-3">
//                         <Form.Group controlId="fullnameField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                              (Full Name) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="fullname"
//                             value={formData.fullname}
//                             onChange={handleChange}
//                             placeholder="Enter your full name as printed on card"
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* License Number */}
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="licesneNumberField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                               (License Number) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="licesneNumber"
//                             value={formData.licesneNumber}
//                             onChange={handleChange}
//                             placeholder="e.g. 12-34-56789012"
//                             pattern="^\d{2}-\d{2}-\d{8}$"
//                             required
//                           />
//                           <Form.Text className="text-muted" style={{ fontSize: "11px" }}>
//                             Format rule must match: 00-00-00000000
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>

//                       {/* Category Selection Option List */}
//                       <Col md={6} className="mb-3">
//                         <Form.Group controlId="cotegoryField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                              (Category) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             name="cotegory"
//                             value={formData.cotegory}
//                             onChange={handleChange}
//                             required
//                           >
//                             <option value="">-- Select Category --</option>
//                             <option value="A">Category A - Motorcycle / Scooter</option>
//                             <option value="B">Category B - Car / Jeep / Van</option>
//                             <option value="C">Category C - Heavy Truck / Bus</option>
//                             <option value="D">Category D - Tractor</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       {/* Date of Birth */}
//                       <Col md={4} className="mb-3">
//                         <Form.Group controlId="deteofBirthField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                             (Date of birth) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="deteofBirth"
//                             value={formData.deteofBirth}
//                             onChange={handleChange}
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Issue Date */}
//                       <Col md={4} className="mb-3">
//                         <Form.Group controlId="issueDateField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                               (Issue Date) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="issueDate"
//                             value={formData.issueDate}
//                             onChange={handleChange}
//                             required
//                           />
//                         </Form.Group>
//                       </Col>

//                       {/* Expiry Date */}
//                       <Col md={4} className="mb-3">
//                         <Form.Group controlId="expiryDateField">
//                           <Form.Label className="fw-bold text-secondary small text-uppercase">
//                               (Expiry Date) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             name="expiryDate"
//                             value={formData.expiryDate}
//                             onChange={handleChange}
//                             required
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <hr className="my-4 border-2 opacity-25" />

//                     {/* Image Attachment Upload Box */}
//                     <h6 className="mb-3 text-primary text-uppercase fw-bold tracking-wider" style={{ fontSize: "0.85rem" }}>
//                       <FaFileUpload className="me-2" /> Digital Card Upload
//                     </h6>
//                     <Row className="mb-4 justify-content-center">
//                       <Col md={8}>
//                         <Form.Group controlId="licenseFileField" className="p-3 bg-light rounded border text-center">
//                           <Form.Label className="fw-semibold small d-block mb-2">License Card Front Copy</Form.Label>
//                           <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
                          
//                           {selectedFile ? (
//                             <div className="mt-3 position-relative">
//                               <img 
//                                 src={URL.createObjectURL(selectedFile)} 
//                                 alt="License Preview" 
//                                 className="img-thumbnail rounded" 
//                                 style={{ maxHeight: "180px", objectFit: "cover" }} 
//                               />
//                               <Button variant="outline-danger" size="sm" className="d-block mx-auto mt-2 py-1" onClick={() => setSelectedFile(null)}>
//                                 ✕ Remove Image
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="py-4 my-2 rounded bg-white border border-dashed" style={{ borderStyle: "dashed", color: "#aaa" }}>
//                               <FaIdCard className="text-muted opacity-50 fs-1 mb-2" />
//                               <p className="m-0 small" style={{ fontSize: "12px" }}>No Document Image Uploaded Yet</p>
//                             </div>
//                           )}
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     {/* Live Digital Card Preview Box */}
//                     <div className="mb-4">
//                       <h6 className="mb-3 text-dark text-uppercase fw-bold" style={{ fontSize: "0.85rem" }}>
//                         <FaCheckCircle className="text-success me-2" /> License Digital Card Preview
//                       </h6>
                      
//                       {/* Styled Dynamic Smart Driving License Card UI */}
//                       <div 
//                         className="p-4 text-dark rounded shadow mx-auto position-relative" 
//                         style={{
//                           maxWidth: "450px",
//                           background: "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
//                           borderTop: "6px solid #0d6efd",
//                           fontFamily: "sans-serif",
//                           minHeight: "240px"
//                         }}
//                       >
//                         {/* Header design elements */}
//                         <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3 border-secondary">
//                           <div>
//                             <h6 className="m-0 fw-bold text-primary" style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
//                               NEPAL DRIVING LICENSE
//                             </h6>
//                             <small className="text-muted fw-bold" style={{ fontSize: "10px" }}>SMART CARD PREVIEW</small>
//                           </div>
//                           <span className="badge bg-primary text-uppercase px-2 py-1" style={{ fontSize: "9px" }}>
//                             Cat: {formData.cotegory || "—"}
//                           </span>
//                         </div>

//                         {/* Layout Body Content Grid info split */}
//                         <Row className="g-0 align-items-center">
//                           {/* Placeholder Dummy Avatar / Image */}
//                           <Col xs={4} className="pe-3 text-center border-end border-secondary border-opacity-50">
//                             {selectedFile ? (
//                               <img 
//                                 src={URL.createObjectURL(selectedFile)} 
//                                 alt="User Avatar" 
//                                 className="img-fluid rounded" 
//                                 style={{ maxHeight: "100px", objectFit: "cover", border: "1px solid #6c757d" }} 
//                               />
//                             ) : (
//                               <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center mx-auto" style={{ width: "80px", height: "95px" }}>
//                                 <FaUser className="text-secondary fs-2" />
//                               </div>
//                             )}
//                           </Col>

//                           {/* Text variables column field rendering info rows */}
//                           <Col xs={8} className="ps-3 text-dark style-labels">
//                             <div className="mb-1">
//                               <span className="text-uppercase text-muted d-block" style={{ fontSize: "9px", fontWeight: "700" }}>Name:</span>
//                               <span className="fw-bold text-uppercase" style={{ fontSize: "0.85rem" }}>{formData.fullname || "YOUR FULL NAME"}</span>
//                             </div>
//                             <div className="mb-1">
//                               <span className="text-uppercase text-muted d-block" style={{ fontSize: "9px", fontWeight: "700" }}>License No:</span>
//                               <span className="fw-bold tracking-wider text-dark" style={{ fontSize: "0.8rem" }}>{formData.licesneNumber || "XX-XX-XXXXXXXX"}</span>
//                             </div>
                            
//                             <Row className="g-0 mt-2 pt-1 border-top border-secondary border-opacity-25">
//                               <Col xs={6}>
//                                 <span className="text-muted d-block" style={{ fontSize: "8px", fontWeight: "700" }}>ISSUED:</span>
//                                 <span className="fw-semibold small" style={{ fontSize: "11px" }}>{formData.issueDate || "YYYY-MM-DD"}</span>
//                               </Col>
//                               <Col xs={6}>
//                                 <span className="text-muted d-block" style={{ fontSize: "8px", fontWeight: "700" }}>EXPIRY:</span>
//                                 <span className="fw-semibold small text-danger" style={{ fontSize: "11px" }}>{formData.expiryDate || "YYYY-MM-DD"}</span>
//                               </Col>
//                             </Row>
//                           </Col>
//                         </Row>

//                         {/* Bottom alignment metadata information */}
//                         <div className="mt-3 pt-1 border-top border-secondary border-opacity-25 text-center">
//                           <small className="text-muted" style={{ fontSize: "9px" }}>
//                             DOB: <span className="fw-bold text-dark">{formData.deteofBirth || "YYYY-MM-DD"}</span>
//                           </small>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Submit Registration Options Form Button */}
//                     <div className="d-grid mt-4">
//                       <Button
//                         type="submit"
//                         variant="primary"
//                         size="lg"
//                         className="fw-semibold text-uppercase shadow-sm py-2"
//                         style={{ fontSize: "1rem", letterSpacing: "0.5px" }}
//                         disabled={loading}
//                       >
//                         {loading ? (
//                           <>
//                             <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
//                             Processing Submission...
//                           </>
//                         ) : (
//                           "  (Submit License)"
//                         )}
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card.Body>
//               </Card>

//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default AddLicensePage;