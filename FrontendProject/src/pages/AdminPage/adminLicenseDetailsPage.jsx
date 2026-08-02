import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Image,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetLicenseByIdQuery,
  useVerifyLicenseMutation,
} from "../../Slices/LicenseApiSlices";

function AdminLicenseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } =
    useGetLicenseByIdQuery(id);

  const [verifyLicense, { isLoading: verifying }] = useVerifyLicenseMutation();

  console.log("this is license verifyjgkjgk "  , verifyLicense)

  const [justVerified, setJustVerified] = useState(false);

  // Backend returns: { message, license: { ... } }
  const license = data?.license || data?.License || data;
  const isVerified = license?.verified || justVerified;
  console.log("this is license", license);
  console.log("this is verify",isVerified);

  const handleVerify = async () => {
    try {
       const res = await verifyLicense(id).unwrap();
      setJustVerified(true);
      toast.success( res.message || "License verified successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || "Failed to verify");
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError || !license || !license._id) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error?.data?.error || error?.data?.message || "License not found"}
        </Alert>
        <Button variant="outline-secondary"
              onClick={() => navigate("/admin/license")}
         >
           Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4 my-md-5">
      <Button
        variant="outline-secondary"
        size="sm"
        className="mb-3"
        onClick={() => navigate("/admin/license")}
      >
        Back to List
      </Button>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h4 className="mb-1">License Review</h4>
              {/* <small className="text-muted">User-Name: {license.user.name}</small> */}
            </div>
            <Badge
              bg={isVerified ? "success" : "warning"}
              className="fs-6 px-3 py-2"
            >
              {isVerified ? " Completed" : "Pending Review"}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {/* License Information */}
          <h6 className="text-uppercase text-muted mb-3 fw-semibold">
            License Information
          </h6>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <ListGroup variant="flush" className="border rounded">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Full Name</span>
                  <strong>{license.fullname || "-"}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">License Number</span>
                  <code>{license.licesneNumber || "-"}</code>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Category</span>
                  <Badge bg="info">{license.cotegory || "-"}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Phone-Number</span>
                  <strong className="text-capitalize">
                    {license.user.phoneNumber || "-"}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <ListGroup variant="flush" className="border rounded">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Issue Date</span>
                  <strong>
                    {license.issueDate
                      ? new Date(license.issueDate).toLocaleDateString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Expiry Date</span>
                  <strong>
                    {license.expiryDate
                      ? new Date(license.expiryDate).toLocaleDateString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Nagarikta Number</span>
                  <code>{license.nagariktaNumber || "-"}</code>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Submitted On</span>
                  <strong>
                    {license.createdAt
                      ? new Date(license.createdAt).toLocaleString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Linked Nagarikta (populated) */}
          {/* {license.nagarikta && typeof license.nagarikta === "object" && ( */}
          {license.nagarikta && (
            <>
              <h6 className="text-uppercase text-muted mb-3 fw-semibold">
                Linked Nagarikta
              </h6>
              <ListGroup horizontal="md" className="mb-4 flex-wrap">
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Full Name</small>
                  <strong>{license.nagarikta.fullName || "-"}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Nagarikta No.</small>
                  <code>{license.nagarikta.nagariktaNumber || "-"}</code>
                </ListGroup.Item>
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Issue District</small>
                  <strong className="text-capitalize">
                    {license.nagarikta.issueDistrict || "-"}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </>
          )}

         

          {/* License Image */}
          <h6 className="text-uppercase text-muted mb-3 fw-semibold">
            License Image
          </h6>
          <Row className="mb-4">
            <Col md={8} lg={6}>
              <Card className="border">
                <Card.Body className="text-center p-3">
                  {license.image ? (
                    <a
                      href={license.image}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={license.image}
                        alt="License"
                        fluid
                        rounded
                        style={{
                          maxHeight: 320,
                          objectFit: "contain",
                          cursor: "zoom-in",
                        }}
                      />
                    </a>
                  ) : (
                    <div className="text-muted py-5">No image uploaded</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Actions */}
          <div className="d-flex flex-wrap gap-2 justify-content-end border-top pt-4">
            <Button variant="outline-secondary" onClick={() => navigate("/admin/license")}>
              Cancel
            </Button>

            {!isVerified ? (
              <Button
                variant="success"
                size="lg"
                className="px-4"
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Verifying...
                  </>
                ) : (
                  " Verify License"
                )}
              </Button>
            ) : (
              <Button variant="success" size="lg" className="px-4" disabled>
                 Verified — Completed
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminLicenseDetailPage;
