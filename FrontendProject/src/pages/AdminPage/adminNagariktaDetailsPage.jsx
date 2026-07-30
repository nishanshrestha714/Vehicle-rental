import { useParams, useNavigate , Link } from "react-router";
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
  useGetNagariktaByIdQuery,
  useVerifyNagariktaMutation,
} from "../../Slices/NagariktaApiSlice";

function AdminNagariktaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } =
    useGetNagariktaByIdQuery(id);

  const [verifyNagarikta, { isLoading: verifying }] =
    useVerifyNagariktaMutation();

  const handleVerify = async () => {
    try {
       const res = await verifyNagarikta(id).unwrap();
      toast.success( res.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to verify");
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error?.data?.error || "Nagarikta record not found"}
        </Alert>
        <Button variant="outline-secondary"
        //  onClick={() => navigate(-1)}
            //    as={Link} to="/admin/nagarikta"
                   onClick={()=>navigate("/admin/nagarikta")}
               
            >
           Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4 my-md-5">
      {/* Back Button */}
      <Button
        variant="outline-secondary bg-primary text-black"
        size="sm"
        className="mb-3"
        onClick={()=>navigate("/admin/nagarikta")}

      >
         Back to List
      </Button>

      <Card className="shadow-sm border-0">
        {/* Header */}
        <Card.Header className="bg-white border-bottom py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h4 className="mb-1">Citizenship  </h4>
              <small className="text-muted">Name: {data.fullName}</small>
            </div>
            <Badge
              bg={data.verified ? "success" : "danger "}
              className="fs-6 px-3 py-2"
            >
              {data.verified ? "Verified" : "not-verified "}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Applicant Info */}
          <h6 className="text-uppercase text-muted mb-3 fw-semibold">
            Applicant Information
          </h6>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <ListGroup variant="flush" className="border rounded">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Full Name</span>
                  <strong>{data.fullName || "-"}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Citizenship No.</span>
                  <code>{data.nagariktaNumber || "-"}</code>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Date of Birth</span>
                  <strong>
                    {data.dateofBirth
                      ? new Date(data.dateofBirth).toLocaleDateString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Permanent Address</span>
                  <strong className="text-capitalize">
                    {data.permentAddress || "-"}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <ListGroup variant="flush" className="border rounded">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Issue District</span>
                  <strong className="text-capitalize">
                    {data.issueDistrict || "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Issue Date</span>
                  <strong>
                    {data.issueDate
                      ? new Date(data.issueDate).toLocaleDateString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Submitted On</span>
                  <strong>
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleString("en-NP")
                      : "-"}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Linked User */}
          {data.user && (
            <>
              <h6 className="text-uppercase text-muted mb-3 fw-semibold">
                Linked User Account
              </h6>
              <ListGroup horizontal="md" className="mb-4 flex-wrap">
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Name</small>
                  <strong>
                    {`${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || "-"}
                  </strong>
                </ListGroup.Item>
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Email</small>
                  <strong>{data.user.email || "-"}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="flex-fill">
                  <small className="text-muted d-block">Phone</small>
                  <strong>{data.user.phoneNumber || "-"}</strong>
                </ListGroup.Item>
              </ListGroup>
            </>
          )}

          {/* Images */}
          <h6 className="text-uppercase text-muted mb-3 fw-semibold">
            Document Images
          </h6>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Header className="bg-light py-2 fw-semibold">
                  Front Side
                </Card.Header>
                <Card.Body className="text-center p-3">
                  {data.frontImage ? (
                    <a
                      href={data.frontImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={data.frontImage}
                        alt="Front of Citizenship"
                        fluid
                        rounded
                        className="border"
                        style={{ maxHeight: 280, objectFit: "contain", cursor: "zoom-in" }}
                      />
                    </a>
                  ) : (
                    <div className="text-muted py-5">No front image</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 border">
                <Card.Header className="bg-light py-2 fw-semibold">
                  Back Side
                </Card.Header>
                <Card.Body className="text-center p-3">
                  {data.backImage ? (
                    <a
                      href={data.backImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={data.backImage}
                        alt="Back of Citizenship"
                        fluid
                        rounded
                        className="border"
                        style={{ maxHeight: 280, objectFit: "contain", cursor: "zoom-in" }}
                      />
                    </a>
                  ) : (
                    <div className="text-muted py-5">No back image</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action */}
          <div className="d-flex flex-wrap gap-2 justify-content-end border-top pt-4">
            <Button
              variant="outline-secondary"
              as={Link} to="/admin/nagarikta"
            >
              Cancel
            </Button>

            {!data.verified ? (
              <Button
                variant="success"
                size="lg"
                className="px-4"
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Verifying...
                  </>
                ) : (
                  "✓ Verify Nagarikta"
                )}
              </Button>
            ) : (
              <Alert variant="success" className="mb-0 py-2 px-3">
                This citizenship has already been verified.
              </Alert>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminNagariktaDetailPage; 