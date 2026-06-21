import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "./HomeSections.css";

function HomeCTA() {
  return (
    <section className="home-cta-section text-center">
      <Container>
        <h2 className="home-cta-title">Ready to start learning?</h2>
        <p className="home-cta-lead">
          Join Ustaad today — free to start, with a personal plan waiting for you in under five minutes.
        </p>
        <Button as={Link} to="/welcome" className="home-cta-btn text-decoration-none">
          Create free account
        </Button>
      </Container>
    </section>
  );
}

export default HomeCTA;
