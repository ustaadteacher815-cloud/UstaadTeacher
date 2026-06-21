import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import HeroVisual from "./hero/HeroVisual";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center hero-row">
          <Col lg={6} className="text-center">
            <HeroVisual />
          </Col>

          <Col lg={6} className="text-center text-lg-start">
            <h1 className="hero-title">
              The fun, effective and
              <br />
              smartest way to
              <br />
              learn and grow!
            </h1>

            <Button
              as={Link}
              to="/welcome"
              className="hero-btn-primary text-decoration-none"
            >
              GET STARTED
            </Button>

            <Button
              as={Link}
              to="/login"
              className="hero-btn-secondary text-decoration-none"
            >
              I ALREADY HAVE AN ACCOUNT
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
