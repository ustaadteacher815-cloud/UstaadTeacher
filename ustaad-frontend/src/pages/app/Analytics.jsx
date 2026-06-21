import { Row, Col, Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function Analytics() {
  const { data, error, loading, retry } = useApiQuery(api.getAnalytics);

  if (loading) {
    return (
      <AppLayout title="Weekly Analytics 📊" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Weekly Analytics 📊" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  const strengths = data.strengths || [];
  const weaknesses = data.weaknesses || [];
  const breakdown = data.subjectBreakdown || [];

  return (
    <AppLayout title="Weekly Analytics 📊" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Your learning report based on real activity — lessons completed, subject progress,
          assessment score, and time spent on Ustaad.
        </p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.progress}%</div>
            <div>Progress</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.timeSpent}</div>
            <div>Time Spent</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.lessonsDone}</div>
            <div>Lessons Done</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.avgScore}%</div>
            <div>Avg Score</div>
          </div>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">🔥 {data.streak ?? 0}</div>
            <div>Day Streak</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.xp ?? 0}</div>
            <div>Total XP</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{data.challengesDone ?? 0}</div>
            <div>Challenges Done</div>
          </div>
        </Col>
      </Row>

      {breakdown.length > 0 && (
        <div className="ustaad-card mb-3">
          <h6 className="fw-bold mb-3">📚 Subject Progress</h6>
          {breakdown.map((s) => (
            <div key={s.topic} className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>{s.topic}</span>
                <span className="fw-bold">{s.score}%</span>
              </div>
              <div className="ustaad-progress">
                <div className="ustaad-progress-bar" style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ustaad-card mb-3">
        <h6 className="fw-bold text-success">💪 Strength Areas</h6>
        {strengths.length === 0 ? (
          <p className="text-muted small mb-0">
            Complete lessons and practice tests to build your strength areas.
          </p>
        ) : (
          strengths.map((s) => (
            <div key={s.topic} className="ustaad-option selected">
              {s.topic} — {s.score}%
            </div>
          ))
        )}
      </div>

      <div className="ustaad-card">
        <h6 className="fw-bold text-danger">📈 Areas to Improve</h6>
        {weaknesses.length === 0 ? (
          <p className="text-muted small mb-0">
            Great job! No weak areas detected yet — keep learning to get personalized tips.
          </p>
        ) : (
          weaknesses.map((s) => (
            <div key={s.topic} className="ustaad-option">
              {s.topic} — {s.score}%
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}

export default Analytics;
