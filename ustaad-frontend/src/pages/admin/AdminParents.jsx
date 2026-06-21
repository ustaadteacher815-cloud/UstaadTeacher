import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminParents() {
  const { data, error, loading, retry } = useApiQuery(api.adminGetParents);

  if (loading) {
    return <AdminLayout title="Parent Accounts"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Parent Accounts">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Parent Accounts">
      <div className="page-intro mb-4">
        <p>All parent accounts and their linked children — monitor family connections across the platform.</p>
      </div>

      <div className="admin-stat-card mb-4" style={{ maxWidth: 280 }}>
        <div className="admin-stat-value">{data.length}</div>
        <div className="admin-stat-label">Total Parent Accounts</div>
      </div>

      {data.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-0">No parent accounts yet.</p>
        </div>
      ) : (
        data.map((parent) => (
          <div key={parent.id} className="ustaad-list-card mb-3">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <div>
                <h6 className="fw-bold mb-1">{parent.name}</h6>
                <small className="text-muted">{parent.phone}</small>
              </div>
              <span className="admin-tag admin-tag-info">{parent.linkedCount} linked</span>
            </div>

            {parent.children.length === 0 ? (
              <p className="text-muted small mb-0">No children linked yet.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {parent.children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/admin/users/${child.id}`}
                    className="admin-tag admin-tag-success text-decoration-none"
                  >
                    {child.name} · Cl {child.grade || "?"} · {child.xp} XP
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default AdminParents;
