import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function studentLabel(entry) {
  const parts = [entry.grade, entry.board].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  if (entry.streak > 0) return `${entry.streak} day streak`;
  return "Student";
}

function Leaderboard() {
  const { data, error, loading, retry } = useApiQuery(api.getLeaderboard);
  const rankings = data?.rankings ?? [];
  const yourRank = data?.yourRank;
  const totalStudents = data?.totalStudents ?? 0;

  return (
    <AppLayout title="Arena Rankings 🏆" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Compete with students across India. Earn XP by completing lessons,
          daily challenges, and practice tests to climb the rankings.
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <Button size="sm" variant="outline-danger" onClick={retry}>Retry</Button>
        </Alert>
      )}

      {loading ? (
        <p>Loading rankings...</p>
      ) : rankings.length === 0 ? (
        <div className="page-intro">
          <p>Complete your first lesson to appear on the leaderboard!</p>
        </div>
      ) : (
        <>
          <p className="text-muted small mb-3">
            Global rankings · {totalStudents} student{totalStudents === 1 ? "" : "s"}
            {yourRank ? ` · Your rank: #${yourRank}` : ""}
          </p>
          {rankings.map((r) => (
            <div
              key={`${r.rank}-${r.id || r.name}`}
              className="ustaad-list-card"
              style={r.highlight ? { border: "2px solid #58cc02" } : {}}
            >
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold" style={{ fontSize: "1.2rem", width: 36 }}>
                  {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `#${r.rank}`}
                </span>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{r.name}</h6>
                  <small className="text-muted">
                    {r.title && `${r.title} · `}
                    {r.quests ?? 0} quests · Lvl {r.level ?? 1}
                    {studentLabel(r) !== "Student" ? ` · ${studentLabel(r)}` : ""}
                  </small>
                </div>
                <span className="ustaad-badge">{r.xp} XP</span>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="page-intro mt-4">
        <p>
          Want to rank higher? Complete daily challenges (+50 XP), finish lessons (+30 XP), and maintain your streak for bonus rewards.
        </p>
      </div>
    </AppLayout>
  );
}

export default Leaderboard;
