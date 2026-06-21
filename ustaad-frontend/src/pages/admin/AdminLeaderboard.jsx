import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminLeaderboard() {
  const { data: rankings = [], error, loading, retry } = useApiQuery(api.adminLeaderboard);

  if (loading) {
    return <AdminLayout title="Leaderboard"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Leaderboard">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Leaderboard">
      <div className="page-intro">
        <p>Real student rankings by XP — no demo padding. Manage student XP from the Students page.</p>
      </div>

      {rankings.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-0">No onboarded students on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table table mb-0">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Board</th>
                <th>XP</th>
                <th>Coins</th>
                <th>Streak</th>
                <th>Lessons</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `#${r.rank}`}
                  </td>
                  <td>
                    <strong>{r.name}</strong>
                    <div className="small text-muted">{r.phone}</div>
                  </td>
                  <td>{r.grade || "—"}</td>
                  <td>{r.board || "—"}</td>
                  <td>{r.xp}</td>
                  <td>{r.coins}</td>
                  <td>{r.streak}</td>
                  <td>{r.lessonsCompleted}</td>
                  <td>
                    <span className={`admin-tag ${r.isActive ? "admin-tag-success" : "admin-tag-danger"}`}>
                      {r.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <Button as={Link} to="/admin/users" className="ustaad-btn-secondary admin-btn-sm">
          Manage Students
        </Button>
      </div>
    </AdminLayout>
  );
}

export default AdminLeaderboard;
