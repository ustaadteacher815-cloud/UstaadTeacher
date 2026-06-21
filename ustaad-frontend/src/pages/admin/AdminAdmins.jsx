import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminAdmins() {
  const { data: admins = [], error, loading, retry } = useApiQuery(api.adminListAdmins);

  if (loading) {
    return <AdminLayout title="Admin Users"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Admin Users">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Users">
      <div className="admin-toolbar">
        <Button as={Link} to="/admin/signup" className="ustaad-btn-primary admin-btn-sm">
          + Invite New Admin
        </Button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table table mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td><strong>{admin.name || "Admin"}</strong></td>
                <td>{admin.phone}</td>
                <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`admin-tag ${admin.isActive !== false ? "admin-tag-success" : "admin-tag-danger"}`}>
                    {admin.isActive !== false ? "Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminAdmins;
