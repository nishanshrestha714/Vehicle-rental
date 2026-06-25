import { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

function VerificationPage() {
  const [formData, setFormData] = useState({
    citizenshipNumber: "",
    fullName: "",
    dateOfBirth: "",
    permanentAddress: "",
    licenseNumber: "",
  });

  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append(
      "citizenshipNumber",
      formData.citizenshipNumber
    );
    data.append("fullName", formData.fullName);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append(
      "permanentAddress",
      formData.permanentAddress
    );
    data.append("licenseNumber", formData.licenseNumber);

    data.append("citizenshipFront", citizenshipFront);
    data.append("citizenshipBack", citizenshipBack);
    data.append("licenseFront", licenseFront);
    data.append("licenseBack", licenseBack);

    console.log("Submitting Verification Data");

    // API Call Here
  };

  return (
    <Container className="py-5">
      <Card className="shadow p-4">
        <h2 className="mb-4 text-center">
          Identity Verification
        </h2>

        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Citizenship Number</Form.Label>
                <Form.Control
                  type="text"
                  name="citizenshipNumber"
                  placeholder="12-34-56-78901"
                  value={formData.citizenshipNumber}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>License Number</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Permanent Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={changeHandler}
              required
            />
          </Form.Group>

          <h4 className="mb-3">Citizenship Photos</h4>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Citizenship Front</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    setCitizenshipFront(e.target.files[0])
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Citizenship Back</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    setCitizenshipBack(e.target.files[0])
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mb-3 mt-4">Driving License Photos</h4>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>License Front</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    setLicenseFront(e.target.files[0])
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>License Back</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    setLicenseBack(e.target.files[0])
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
          >
            Submit Verification
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default VerificationPage;