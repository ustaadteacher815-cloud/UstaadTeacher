import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";

function CareerRoadmap() {
  const { careerId } = useParams();
  const [career, setCareer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCareer = () => {
    setLoading(true);
    setError("");
    api
      .getCareer(careerId)
      .then(setCareer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCareer();
  }, [careerId]);

  if (loading) {
    return (
      <AppLayout title="Career Roadmap" backTo="/career-explorer" backLabel="Back to Career Explorer">
        <p>Loading roadmap...</p>
      </AppLayout>
    );
  }

  if (error || !career) {
    return (
      <AppLayout title="Career Roadmap" backTo="/career-explorer" backLabel="Back to Career Explorer">
        <Alert variant="danger">{error || "Career not found"}</Alert>
        <Button className="ustaad-btn-primary" onClick={loadCareer}>Retry</Button>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`${career.icon} ${career.name} Roadmap`}
      backTo="/career-explorer"
      backLabel="Back to Career Explorer"
    >
      <div className="ustaad-card mb-3">
        <p className="text-muted mb-2">{career.description}</p>
        <span className="ustaad-badge me-2">{career.matchScore}% match for you</span>
        <span className="ustaad-badge">{career.stream} stream</span>
      </div>

      <div className="ustaad-card mb-3">
        <h6 className="fw-bold">Required Skills</h6>
        {career.skills.map((skill) => (
          <span key={skill} className="ustaad-badge me-2 mb-2 d-inline-block">{skill}</span>
        ))}
      </div>

      {career.subjectProgress?.length > 0 && (
        <div className="ustaad-card mb-3">
          <h6 className="fw-bold mb-3">Your Subject Alignment</h6>
          {career.subjectProgress.map((subject) => (
            <div key={subject.subjectId} className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>{subject.name}</span>
                <span className="fw-bold">{subject.progress}%</span>
              </div>
              <div className="ustaad-progress">
                <div className="ustaad-progress-bar" style={{ width: `${subject.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value" style={{ fontSize: "1.2rem" }}>{career.salary}</div>
            <div>Salary Range</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value" style={{ fontSize: "1.2rem" }}>{career.demand}</div>
            <div>Future Demand</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value" style={{ fontSize: "1.2rem" }}>{career.matchScore}%</div>
            <div>Your Match</div>
          </div>
        </Col>
      </Row>

      <div className="ustaad-card">
        <h6 className="fw-bold">Learning Path</h6>
        {career.path.map((step, index) => (
          <div key={step} className="ustaad-option">
            {index + 1}. {step}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default CareerRoadmap;
