import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminWeeklyTargets() {
  const { data, error, loading, retry } = useApiQuery(api.adminWeeklyTargetsOverview);

  if (loading) {
    return <AdminLayout title="Weekly Targets"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Weekly Targets">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Weekly Targets">
      <div className="page-intro mb-4">
        <p>
          Platform-wide weekly target completion — same targets students see on their Weekly Targets page.
        </p>
      </div>

      <div className="admin-stat-card mb-4" style={{ maxWidth: 280 }}>
        <div className="admin-stat-value">{data.studentCount}</div>
        <div className="admin-stat-label">Active Students Tracked</div>
      </div>

      {data.targets.map((target) => (
        <div key={target.id} className="ustaad-list-card mb-3">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{target.icon}</span>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold mb-0">{target.label}</h6>
                <span className="admin-tag admin-tag-info">
                  {target.studentsCompleted}/{data.studentCount} students
                </span>
              </div>
              <p className="text-muted small mb-2">Goal: {target.goal} · {target.completionRate}% completion rate</p>
              <div className="ustaad-progress mb-0">
                <div
                  className="ustaad-progress-bar"
                  style={{ width: `${target.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button as={Link} to="/admin/users" className="ustaad-btn-outline admin-btn-sm mt-2">
        View student details →
      </Button>
    </AdminLayout>
  );
}

export default AdminWeeklyTargets;
