import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <>
      <Navbar />
      <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
        <h1 className="display-4 fw-bold mb-3">404</h1>
        <p className="text-muted mb-4">This page does not exist or may have moved.</p>
        <Button as={Link} to="/" className="ustaad-btn-primary text-decoration-none">
          Back to Home
        </Button>
      </Container>
    </>
  );
}

export default NotFound;
