import { Link } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminDashboard() {
  const { data, error, loading, retry } = useApiQuery(api.adminStats);

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <p>Loading stats...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Admin Dashboard">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "Total Students", value: data.totalStudents },
    { label: "Onboarded", value: data.onboardedStudents },
    { label: "Active Today", value: data.activeToday },
    { label: "Total Questions", value: data.totalQuestions },
    { label: "Total XP Earned", value: data.totalXp },
    { label: "Total Coins", value: data.totalCoins },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="page-intro">
        <p>
          Platform overview — monitor student signups, question bank, and engagement metrics.
        </p>
      </div>

      <div className="admin-stat-grid">
        {stats.map((item) => (
          <div key={item.label} className="admin-stat-card">
            <div className="admin-stat-value">{item.value}</div>
            <div className="admin-stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Question Bank</h5>
            <p className="mb-2">
              <span className="admin-tag admin-tag-info me-2">Assessment</span>
              {data.questionTypes.assessment}
            </p>
            <p className="mb-2">
              <span className="admin-tag admin-tag-success me-2">Daily</span>
              {data.questionTypes.daily}
            </p>
            <p className="mb-3">
              <span className="admin-tag admin-tag-warning me-2">Practice</span>
              {data.questionTypes.practice}
            </p>
            <Button as={Link} to="/admin/questions" className="ustaad-btn-primary admin-btn-sm">
              Manage Questions
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Recent Signups</h5>
            {data.recentSignups.length === 0 ? (
              <p className="text-muted mb-0">No students yet.</p>
            ) : (
              data.recentSignups.map((student) => (
                <div key={student._id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <div>
                    <strong>{student.name || "Unnamed"}</strong>
                    <div className="small text-muted">{student.phone} · {student.grade || "—"}</div>
                  </div>
                  <span className={`admin-tag ${student.onboardingComplete ? "admin-tag-success" : "admin-tag-warning"}`}>
                    {student.onboardingComplete ? "Active" : "Onboarding"}
                  </span>
                </div>
              ))
            )}
            <Button as={Link} to="/admin/users" className="ustaad-btn-secondary admin-btn-sm mt-2">
              View All Students
            </Button>
          </div>
        </Col>
      </Row>

      <div className="ustaad-card mt-4">
        <h5 className="fw-bold mb-3">Quick Access</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/admin/theory-lab" className="ustaad-btn-outline admin-btn-sm">📖 Theory Lab</Button>
          <Button as={Link} to="/admin/board-faq" className="ustaad-btn-outline admin-btn-sm">📋 Board FAQ</Button>
          <Button as={Link} to="/admin/weekly-targets" className="ustaad-btn-outline admin-btn-sm">🎯 Weekly Targets</Button>
          <Button as={Link} to="/admin/streak" className="ustaad-btn-outline admin-btn-sm">🔥 Streaks</Button>
          <Button as={Link} to="/admin/analytics" className="ustaad-btn-outline admin-btn-sm">📈 Analytics</Button>
          <Button as={Link} to="/admin/community" className="ustaad-btn-outline admin-btn-sm">👥 Study Lounges</Button>
          <Button as={Link} to="/admin/ai-insights" className="ustaad-btn-outline admin-btn-sm">🧠 AI Logs</Button>
          <Button as={Link} to="/admin/parents" className="ustaad-btn-outline admin-btn-sm">👨‍👩‍👧 Parents</Button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
