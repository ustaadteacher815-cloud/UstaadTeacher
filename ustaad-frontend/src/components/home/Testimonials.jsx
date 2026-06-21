import { Container, Row, Col } from "react-bootstrap";
import "./HomeSections.css";

const testimonials = [
  {
    quote:
      "The daily challenges made me study every day without feeling overwhelmed. I improved my math score by two grades in one term.",
    name: "Ayesha K.",
    meta: "Class 11 · Hyderabad",
  },
  {
    quote:
      "AI Tutor explains things the way my teacher does, but I can ask at midnight before a test. The physics chapters are especially clear.",
    name: "Hassan R.",
    meta: "Class 12 · Telangana",
  },
  {
    quote:
      "I love earning XP and seeing my name on the leaderboard. It turned revision from a chore into something I actually look forward to.",
    name: "Fatima S.",
    meta: "Class 11 · Maharashtra",
  },
];

function Testimonials() {
  return (
    <section className="home-section home-section-alt">
      <Container>
        <h2 className="home-section-title text-center">What students are saying</h2>
        <p className="home-section-lead text-center">
          Thousands of learners use Ustaad to build confidence before board exams.
        </p>

        <Row className="g-4">
          {testimonials.map((item) => (
            <Col md={4} key={item.name}>
              <div className="home-testimonial-card">
                <p className="home-testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
                <div className="home-testimonial-author">{item.name}</div>
                <div className="home-testimonial-meta">{item.meta}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Testimonials;
