import { Container, Row, Col } from "react-bootstrap";
import "./HomeSections.css";

const steps = [
  {
    title: "Sign up in minutes",
    desc: "Create your profile with OTP or social login. Tell us your class, board, and learning goals.",
  },
  {
    title: "Take a quick assessment",
    desc: "We identify your strengths and weak spots so your study plan starts in the right place.",
  },
  {
    title: "Follow your personal plan",
    desc: "Daily lessons, practice tests, and challenges are tailored to what you need most.",
  },
  {
    title: "Track progress & earn rewards",
    desc: "Climb the leaderboard, unlock badges, and explore careers as you master each chapter.",
  },
];

function HowItWorks() {
  return (
    <section className="home-section home-section-muted">
      <Container>
        <h2 className="home-section-title text-center">How Ustaad works</h2>
        <p className="home-section-lead text-center">
          From first login to board exam readiness — a clear path designed for Class 11 and 12 students.
        </p>

        <Row className="g-4">
          {steps.map((step, index) => (
            <Col md={6} lg={3} key={step.title}>
              <div className="home-step-card">
                <div className="home-step-num">{index + 1}</div>
                <h3 className="h5 fw-bold mb-2">{step.title}</h3>
                <p className="text-muted mb-0 small">{step.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default HowItWorks;
