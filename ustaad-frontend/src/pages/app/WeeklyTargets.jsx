import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function WeeklyTargets() {
  const { data, error, loading, retry } = useApiQuery(api.getWeeklyTargets);

  if (loading) {
    return (
      <AppLayout title="Weekly Targets 🎯" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading targets...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Weekly Targets 🎯" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Weekly Targets 🎯" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro mb-4">
        <p>{data.weekLabel} — track your quests, challenges, XP, and streak goals.</p>
      </div>

      {data.targets.map((target) => (
        <div key={target.id} className="ustaad-list-card mb-3">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{target.icon}</span>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold mb-0">{target.label}</h6>
                <span className="ustaad-badge">
                  {target.done}/{target.goal}
                </span>
              </div>
              <p className="text-muted small mb-2">{target.hint}</p>
              <div className="ustaad-progress mb-0">
                <div
                  className="ustaad-progress-bar"
                  style={{ width: `${Math.round((target.done / target.goal) * 100)}%` }}
                />
              </div>
            </div>
            {target.complete && <span className="text-success fw-bold">✓</span>}
          </div>
        </div>
      ))}

      <div className="d-flex flex-wrap gap-2 mt-4">
        <Button
          as={Link}
          to="/learning-path"
          state={{ returnTo: "/weekly-targets", returnLabel: "Back to Weekly Targets" }}
          className="ustaad-btn-primary"
        >
          Start Chapter Quest
        </Button>
        <Button
          as={Link}
          to="/daily-challenge"
          state={{ returnTo: "/weekly-targets", returnLabel: "Back to Weekly Targets" }}
          className="ustaad-btn-outline"
        >
          Daily Challenge
        </Button>
        <Button
          as={Link}
          to="/streak"
          state={{ returnTo: "/weekly-targets", returnLabel: "Back to Weekly Targets" }}
          className="ustaad-btn-outline"
        >
          View Streak
        </Button>
      </div>
    </AppLayout>
  );
}

export default WeeklyTargets;
