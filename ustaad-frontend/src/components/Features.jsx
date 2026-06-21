import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Features.css";

function Features() {
  const features = [
    {
      title: "AI Tutor",
      desc: "Get instant explanations for math, physics, and chemistry — step by step, anytime you need help.",
      to: "/ai-tutor",
    },
    {
      title: "Daily Challenge",
      desc: "Complete a quick quiz each day to build streaks, earn XP, and stay exam-ready without burnout.",
      to: "/daily-challenge",
    },
    {
      title: "Career Explorer",
      desc: "Discover careers linked to your subjects and see which skills matter for engineering, medicine, and more.",
      to: "/career-explorer",
    },
    {
      title: "Rewards",
      desc: "Collect coins and badges as you finish lessons, then redeem them for perks and milestones.",
      to: "/rewards",
    },
    {
      title: "Leaderboard",
      desc: "See how you rank among classmates and students nationwide — friendly competition that pushes you forward.",
      to: "/leaderboard",
    },
    {
      title: "Scholarships",
      desc: "Browse scholarship opportunities and tips to fund your next step after Class 12.",
      to: "/scholarships",
    },
  ];

  return (
    <section className="py-5">
      <Container>

        <h2 className="text-center mb-3 fw-bold">
          Learn. Practice. Achieve.
        </h2>
        <p className="text-center text-muted mb-5 mx-auto" style={{ maxWidth: "560px" }}>
          Everything you need to master your syllabus — from smart lessons to rewards that keep you coming back.
        </p>

        <Row>

          {features.map((item) => (
            <Col md={4} key={item.title} className="mb-4">

              <Link to={item.to} className="feature-card-link">
                <Card className="h-100 shadow-sm feature-card">
                  <Card.Body>

                    <Card.Title>
                      {item.title}
                    </Card.Title>

                    <Card.Text>
                      {item.desc}
                    </Card.Text>

                  </Card.Body>
                </Card>
              </Link>

            </Col>
          ))}

        </Row>

      </Container>
    </section>
  );
}

export default Features;