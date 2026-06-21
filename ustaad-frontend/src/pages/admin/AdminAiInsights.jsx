import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminAiInsights() {
  const { data, error, loading, retry } = useApiQuery(api.adminAiInsights);

  if (loading) {
    return <AdminLayout title="AI Tutor Logs"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="AI Tutor Logs">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="AI Tutor Logs">
      <div className="admin-stat-card mb-4" style={{ maxWidth: 280 }}>
        <div className="admin-stat-value">{data.activeChatUsers}</div>
        <div className="admin-stat-label">Students Using AI Tutor</div>
      </div>

      <div className="page-intro">
        <p>Recent AI tutor conversations across the platform (latest 40 messages).</p>
      </div>

      {data.recentMessages.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-0">No AI chat activity yet.</p>
        </div>
      ) : (
        data.recentMessages.map((msg, index) => (
          <div key={`${msg.phone}-${index}`} className="ustaad-list-card">
            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
              <strong>{msg.student}</strong>
              <span className={`admin-tag ${msg.role === "user" ? "admin-tag-info" : "admin-tag-success"}`}>
                {msg.role === "user" ? "Student" : "AI"}
              </span>
            </div>
            <p className="mb-1">{msg.text}</p>
            <small className="text-muted">
              {msg.grade || "—"} · {msg.phone}
            </small>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default AdminAiInsights;
