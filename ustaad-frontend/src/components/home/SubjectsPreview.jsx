import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { subjectInfo, getChapterPreview } from "../../data/learningContent";
import "./HomeSections.css";

const subjects = [
  "mathematics",
  "physics",
  "chemistry",
  "biology",
  "mathematics-12",
  "physics-12",
  "biology-12",
];

function SubjectsPreview() {
  return (
    <section className="home-section home-section-alt">
      <Container>
        <h2 className="home-section-title text-center">Built for your syllabus</h2>
        <p className="home-section-lead text-center">
          Structured chapters with micro-lessons, real-world examples, and practice tests — everything you need for boards and beyond.
        </p>

        <Row className="g-4">
          {subjects.map((key) => {
            const subject = subjectInfo[key];
            const chapterList = getChapterPreview(key);

            return (
              <Col md={6} lg={4} key={key}>
                <Link to="/welcome" className="home-subject-card">
                  <div className="home-subject-icon">{subject.icon}</div>
                  <h3 className="h5 fw-bold mb-2">
                    {subject.name}
                    {key.includes("-12") ? " (Class 12)" : " (Class 11)"}
                  </h3>
                  <p className="text-muted small mb-0">{subject.description}</p>
                  <p className="home-subject-chapters mb-0">{chapterList}</p>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}

export default SubjectsPreview;
