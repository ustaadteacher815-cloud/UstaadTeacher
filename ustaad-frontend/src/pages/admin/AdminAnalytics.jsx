import { Row, Col, Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminAnalytics() {
  const { data, error, loading, retry } = useApiQuery(api.adminAnalytics);

  if (loading) {
    return <AdminLayout title="Platform Analytics"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Platform Analytics">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Platform Analytics">
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalLessonsCompleted}</div>
          <div className="admin-stat-label">Lessons Completed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{Math.round(data.totalTimeSpentMinutes / 60)}h</div>
          <div className="admin-stat-label">Total Study Time</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.avgStreak}</div>
          <div className="admin-stat-label">Avg Streak (days)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.challengesCompletedToday}</div>
          <div className="admin-stat-label">Challenges Today</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.onboardingPending}</div>
          <div className="admin-stat-label">Pending Onboarding</div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Students by Grade</h5>
            {data.gradeBreakdown.length === 0 ? (
              <p className="text-muted mb-0">No grade data yet.</p>
            ) : (
              data.gradeBreakdown.map((item) => (
                <div key={item.label} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span>{item.label}</span>
                  <span className="admin-tag admin-tag-info">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </Col>
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Students by Board</h5>
            {data.boardBreakdown.length === 0 ? (
              <p className="text-muted mb-0">No board data yet.</p>
            ) : (
              data.boardBreakdown.map((item) => (
                <div key={item.label} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span>{item.label}</span>
                  <span className="admin-tag admin-tag-success">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </AdminLayout>
  );
}

export default AdminAnalytics;
