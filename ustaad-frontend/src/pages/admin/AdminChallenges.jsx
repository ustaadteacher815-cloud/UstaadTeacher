import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminChallenges() {
  const { data, error, loading, retry } = useApiQuery(api.adminChallenges);

  if (loading) {
    return <AdminLayout title="Daily Challenges"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Daily Challenges">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Daily Challenges">
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.dailyQuestions.length}</div>
          <div className="admin-stat-label">Daily Questions in Bank</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.completionsToday}</div>
          <div className="admin-stat-label">Completions Today</div>
        </div>
      </div>

      <div className="page-intro">
        <p>
          Daily challenges rotate from questions marked as type <strong>daily</strong>.
          Add or edit them in the Question Bank.
        </p>
      </div>

      {data.dailyQuestions.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">No daily challenge questions found.</p>
          <Button as={Link} to="/admin/questions" className="ustaad-btn-primary admin-btn-sm">
            Add Daily Question
          </Button>
        </div>
      ) : (
        data.dailyQuestions.map((q) => (
          <div key={q._id} className="ustaad-list-card">
            <span className="admin-tag admin-tag-success mb-2 d-inline-block">Daily</span>
            <h6 className="fw-bold mb-1">{q.question}</h6>
            <p className="small text-muted mb-0">
              {q.options.map((opt, i) => (
                <span key={opt} className={i === q.answer ? "text-success fw-bold" : ""}>
                  {String.fromCharCode(65 + i)}. {opt}{i < q.options.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default AdminChallenges;
