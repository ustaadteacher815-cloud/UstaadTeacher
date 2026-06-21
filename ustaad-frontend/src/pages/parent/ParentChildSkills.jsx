import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentChildSkills() {
  const { studentId } = useParams();
  const fetcher = useCallback(() => api.parentChildSkills(studentId), [studentId]);
  const { data, error, loading, retry } = useApiQuery(fetcher);

  if (loading) {
    return <ParentLayout title="Skills & Careers"><p>Loading...</p></ParentLayout>;
  }

  if (error) {
    return (
      <ParentLayout title="Skills & Careers">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout title={`${data.studentName}'s Skills & Careers`}>
      <Link to={`/parent/child/${studentId}`} className="page-back-btn">← Back to Report</Link>

      <div className="page-intro mb-4">
        <p>Skill development tracks and career matches based on your child&apos;s subjects and progress.</p>
      </div>

      <h5 className="fw-bold mb-3">Skill Tracks</h5>
      {data.tracks.map((track) => (
        <div key={track.id} className="ustaad-list-card mb-3">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{track.icon}</span>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold mb-0">
                  {track.name}
                  {track.recommended && <span className="admin-tag admin-tag-success ms-2">Recommended</span>}
                </h6>
                <span className="fw-bold">{track.progress}%</span>
              </div>
              <p className="text-muted small mb-2">{track.description}</p>
              <div className="ustaad-progress mb-0">
                <div className="ustaad-progress-bar" style={{ width: `${track.progress}%` }} />
              </div>
              <small className="text-muted">{track.completedLessons}/{track.lessons} lessons completed</small>
            </div>
          </div>
        </div>
      ))}

      <h5 className="fw-bold mb-3 mt-4">Top Career Matches</h5>
      <Row className="g-3">
        {(data.topCareers?.length ? data.topCareers : []).map((career) => (
          <Col md={4} key={career.id}>
            <div className="ustaad-card h-100">
              <div style={{ fontSize: "2rem" }}>{career.icon}</div>
              <h6 className="fw-bold mt-2">{career.name}</h6>
              <p className="text-muted small mb-1">{career.stream}</p>
              <span className="admin-tag admin-tag-info">{career.matchScore}% match</span>
            </div>
          </Col>
        ))}
      </Row>
    </ParentLayout>
  );
}

export default ParentChildSkills;
