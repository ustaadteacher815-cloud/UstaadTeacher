import { Link } from "react-router-dom";
import { Alert, Button, Row, Col } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminStreakOverview() {
  const { data, error, loading, retry } = useApiQuery(api.adminStreakOverview);

  if (loading) {
    return <AdminLayout title="Streak Overview"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Streak Overview">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  const dist = data.distribution;

  return (
    <AdminLayout title="Streak Overview">
      <div className="page-intro mb-4">
        <p>Study streak stats across all students — matches the streak system on the student app.</p>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.avgStreak}</div>
          <div className="admin-stat-label">Average Streak (days)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{dist.weekPlus + dist.monthPlus}</div>
          <div className="admin-stat-label">7+ Day Streaks</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{dist.monthPlus}</div>
          <div className="admin-stat-label">30+ Day Streaks</div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <div className="ustaad-card h-100">
            <h5 className="fw-bold mb-3">Streak Distribution</h5>
            <div className="d-flex justify-content-between mb-2"><span>No streak (0 days)</span><span className="fw-bold">{dist.inactive}</span></div>
            <div className="d-flex justify-content-between mb-2"><span>Building (1–6 days)</span><span className="fw-bold">{dist.building}</span></div>
            <div className="d-flex justify-content-between mb-2"><span>Strong (7–29 days)</span><span className="fw-bold">{dist.weekPlus}</span></div>
            <div className="d-flex justify-content-between"><span>Elite (30+ days)</span><span className="fw-bold">{dist.monthPlus}</span></div>
          </div>
        </Col>
        <Col md={6}>
          <div className="ustaad-card h-100">
            <h5 className="fw-bold mb-3">Top Streaks 🔥</h5>
            {data.topStreaks.length === 0 ? (
              <p className="text-muted mb-0">No streak data yet.</p>
            ) : (
              data.topStreaks.map((student, index) => (
                <div key={student.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <div>
                    <strong>#{index + 1} {student.name}</strong>
                    <div className="small text-muted">Class {student.grade || "—"}</div>
                  </div>
                  <Link to={`/admin/users/${student.id}`} className="admin-tag admin-tag-success text-decoration-none">
                    {student.streak} days →
                  </Link>
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </AdminLayout>
  );
}

export default AdminStreakOverview;
