import { Container, Row, Col } from "react-bootstrap";
import "./HomeSections.css";

const stats = [
  { value: "500+", label: "Micro-lessons", detail: "Bite-sized chapters for Class 11 & 12" },
  { value: "3", label: "Core subjects", detail: "Math, Physics & Chemistry" },
  { value: "24/7", label: "AI Tutor", detail: "Instant help on any topic" },
  { value: "XP", label: "Rewards & streaks", detail: "Stay motivated every day" },
];

function HomeStats() {
  return (
    <section className="home-section home-section-alt">
      <Container>
        <Row className="g-4">
          {stats.map((item) => (
            <Col sm={6} lg={3} key={item.label}>
              <div className="ustaad-stat-card">
                <div className="ustaad-stat-value">{item.value}</div>
                <div className="fw-bold text-dark mb-1">{item.label}</div>
                <div className="small text-muted">{item.detail}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default HomeStats;
