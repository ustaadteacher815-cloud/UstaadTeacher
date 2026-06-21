import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentChildAnalytics() {
  const { studentId } = useParams();
  const fetcher = useCallback(() => api.parentChildAnalytics(studentId), [studentId]);
  const { data, error, loading, retry } = useApiQuery(fetcher);

  if (loading) {
    return <ParentLayout title="Child Analytics"><p>Loading...</p></ParentLayout>;
  }

  if (error) {
    return (
      <ParentLayout title="Child Analytics">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </ParentLayout>
    );
  }

  const breakdown = data.subjectBreakdown || [];

  return (
    <ParentLayout title={`${data.studentName}'s Analytics`}>
      <Link to={`/parent/child/${studentId}`} className="page-back-btn">← Back to Report</Link>

      <div className="page-intro mb-4">
        <p>Weekly learning report — lessons, subject progress, assessment score, and study time.</p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{data.progress}%</div><div>Progress</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{data.timeSpent}</div><div>Time Spent</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{data.lessonsDone}</div><div>Lessons Done</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{data.avgScore}%</div><div>Avg Score</div></div></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={4}><div className="ustaad-stat-card"><div className="ustaad-stat-value">🔥 {data.streak}</div><div>Day Streak</div></div></Col>
        <Col md={4}><div className="ustaad-stat-card"><div className="ustaad-stat-value">Lvl {data.level}</div><div>{data.title}</div></div></Col>
        <Col md={4}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{data.xp}</div><div>Total XP</div></div></Col>
      </Row>

      <div className="ustaad-card mb-4">
        <h5 className="fw-bold mb-3">Subject Breakdown</h5>
        {breakdown.filter((s) => s.score > 0).length === 0 ? (
          <p className="text-muted mb-0">No subject activity yet.</p>
        ) : (
          breakdown.filter((s) => s.score > 0).map((subject) => (
            <div key={subject.topic} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{subject.topic}</span>
                <span className="fw-bold">{subject.score}%</span>
              </div>
              <div className="ustaad-progress">
                <div className="ustaad-progress-bar" style={{ width: `${subject.score}%` }} />
              </div>
            </div>
          ))
        )}
      </div>

      <Row className="g-4">
        <Col md={6}>
          <div className="ustaad-card">
            <h6 className="fw-bold text-success mb-2">Strengths</h6>
            {(data.strengths?.length ? data.strengths : [{ topic: "Still assessing", score: 0 }]).map((s) => (
              <div key={s.topic} className="ustaad-option selected">{s.topic}{s.score ? ` · ${s.score}%` : ""}</div>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <div className="ustaad-card">
            <h6 className="fw-bold text-danger mb-2">Needs Focus</h6>
            {(data.weaknesses?.length ? data.weaknesses : [{ topic: "Still assessing", score: 0 }]).map((s) => (
              <div key={s.topic} className="ustaad-option">{s.topic}{s.score ? ` · ${s.score}%` : ""}</div>
            ))}
          </div>
        </Col>
      </Row>
    </ParentLayout>
  );
}

export default ParentChildAnalytics;
