import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { useAuth } from "../../hooks/useAuth";

function AdminSettings() {
  const { user } = useAuth();

  return (
    <AdminLayout title="Settings">
      <Row className="g-4">
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Your Admin Profile</h5>
            <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
            <p className="mb-1"><strong>Phone:</strong> {user?.phone}</p>
            <p className="mb-0"><strong>Role:</strong> {user?.role}</p>
          </div>
        </Col>
        <Col lg={6}>
          <div className="ustaad-card">
            <h5 className="fw-bold mb-3">Platform</h5>
            <p className="text-muted small mb-2">
              API URL: {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
            </p>
            <p className="text-muted small mb-3">
              Admin signup requires <code>ADMIN_SIGNUP_KEY</code> in backend environment.
            </p>
            <Button as={Link} to="/admin/signup" className="ustaad-btn-primary admin-btn-sm me-2">
              Create Admin
            </Button>
            <Button as={Link} to="/" className="ustaad-btn-secondary admin-btn-sm">
              View Website
            </Button>
          </div>
        </Col>
      </Row>

      <div className="ustaad-card mt-4">
        <h5 className="fw-bold mb-3">Quick Links</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/admin/questions" className="ustaad-btn-outline admin-btn-sm">Question Bank</Button>
          <Button as={Link} to="/admin/users" className="ustaad-btn-outline admin-btn-sm">Students</Button>
          <Button as={Link} to="/admin/analytics" className="ustaad-btn-outline admin-btn-sm">Analytics</Button>
          <Button as={Link} to="/admin/login" className="ustaad-btn-outline admin-btn-sm">Switch Account</Button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
