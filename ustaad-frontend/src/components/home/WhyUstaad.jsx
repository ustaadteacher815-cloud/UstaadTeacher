import { Container, Row, Col } from "react-bootstrap";
import "./HomeSections.css";

const reasons = [
  {
    icon: "🎯",
    title: "Personalized learning paths",
    desc: "Your plan adapts based on assessment results and weekly progress — no one-size-fits-all syllabus dump.",
  },
  {
    icon: "🧠",
    title: "AI tutor on demand",
    desc: "Stuck on a formula or concept? Ask Ustaad anytime for step-by-step explanations in plain language.",
  },
  {
    icon: "🏆",
    title: "Gamified motivation",
    desc: "Daily challenges, XP, streaks, and leaderboards keep studying feel rewarding instead of boring.",
  },
  {
    icon: "🚀",
    title: "Career-ready skills",
    desc: "Explore careers, scholarships, and roadmaps so every chapter connects to your future goals.",
  },
];

function WhyUstaad() {
  return (
    <section className="home-section home-section-muted">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={5}>
            <h2 className="home-section-title">Why students choose Ustaad</h2>
            <p className="text-muted mb-0">
              Ustaad combines smart technology with a fun, Duolingo-style experience — made specifically for Pakistani Class 11 and 12 students preparing for board exams and competitive tests.
            </p>
          </Col>
          <Col lg={7}>
            {reasons.map((item) => (
              <div className="home-why-item" key={item.title}>
                <div className="home-why-icon">{item.icon}</div>
                <div>
                  <div className="home-why-title">{item.title}</div>
                  <p className="home-why-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WhyUstaad;
