import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import BrandLogo from "./BrandLogo";
import "./Navbar.css";

function AppNavbar() {
  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom py-3"
    >
      <Container>

        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand-link"
          style={{
            color: "#58CC02",
            fontWeight: "800",
            fontSize: "2.2rem",
            letterSpacing: "0.5px",
            textDecoration: "none",
          }}
        >
          <BrandLogo />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/ai-tutor" className="mx-2">
              AI Tutor
            </Nav.Link>

            <Nav.Link as={Link} to="/rewards" className="mx-2">
              Rewards
            </Nav.Link>

            <Nav.Link as={Link} to="/career-explorer" className="mx-2">
              Career Explorer
            </Nav.Link>

            <Button
              as={Link}
              to="/login"
              className="ms-3 px-4 text-decoration-none"
              style={{
                backgroundColor: "#58CC02",
                borderColor: "#58CC02",
                borderRadius: "12px",
                fontWeight: "700",
                boxShadow: "0 4px 0 #46A302",
              }}
            >
              Login
            </Button>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default AppNavbar;