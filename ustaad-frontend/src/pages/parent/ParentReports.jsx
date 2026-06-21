import { Link } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentReports() {
  const { data, error, loading, retry } = useApiQuery(api.parentReports);

  return (
    <ParentLayout title="Weekly Reports">
      <div className="page-intro">
        <p>Real weekly learning analytics for each linked child — progress, targets, streaks, and scores.</p>
      </div>

      {error && (
        <>
          <Alert variant="danger">{error}</Alert>
          <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
        </>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : data?.reports?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">Link a child to see weekly reports.</p>
          <Link to="/parent/link" className="ustaad-link">Link child →</Link>
        </div>
      ) : (
        data.reports.map((report) => (
          <div key={report.id} className="parent-child-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h5 className="fw-bold mb-1">{report.name} — Weekly Summary</h5>
                <p className="text-muted small mb-0">{report.gradeLabel}</p>
              </div>
              <span className="admin-tag admin-tag-info">
                {report.weeklyTargetsComplete}/{report.weeklyTargetsTotal} targets done
              </span>
            </div>

            <Row className="g-2">
              <Col xs={6} md={2}><small className="text-muted">Progress</small><div className="fw-bold">{report.progress}%</div></Col>
              <Col xs={6} md={2}><small className="text-muted">Lessons</small><div className="fw-bold">{report.lessonsDone}</div></Col>
              <Col xs={6} md={2}><small className="text-muted">Time</small><div className="fw-bold">{report.timeSpent}</div></Col>
              <Col xs={6} md={2}><small className="text-muted">Streak</small><div className="fw-bold">{report.streak} 🔥</div></Col>
              <Col xs={6} md={2}><small className="text-muted">XP</small><div className="fw-bold">{report.xp}</div></Col>
              <Col xs={6} md={2}><small className="text-muted">Avg Score</small><div className="fw-bold">{report.avgScore}%</div></Col>
            </Row>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Link to={`/parent/child/${report.id}`} className="ustaad-link">Full report →</Link>
              <Link to={`/parent/child/${report.id}/analytics`} className="ustaad-link">Analytics →</Link>
              <Link to={`/parent/child/${report.id}/targets`} className="ustaad-link">Targets →</Link>
            </div>
          </div>
        ))
      )}
    </ParentLayout>
  );
}

export default ParentReports;
