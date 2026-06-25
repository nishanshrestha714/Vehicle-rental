import { Container, Button } from "react-bootstrap";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
      }}
    >
      <Container className="text-center text-white">
        <h1
          style={{
            fontSize: "8rem",
            fontWeight: "900",
          }}
        >
          404
        </h1>

        <h2 className="fw-bold mb-3">
          Page Not Found
        </h2>

        <p
          className="text-light mx-auto"
          style={{ maxWidth: "500px" }}
        >
          Sorry, the page you are looking for
          doesn't exist or has been moved.
        </p>

        <Link to="/">
          <Button
            variant="warning"
            size="lg"
            className="mt-3"
          >
            Back To Home
          </Button>
        </Link>
      </Container>
    </div>
  );
}

export default NotFoundPage;