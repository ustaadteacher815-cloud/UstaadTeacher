import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentChildTargets() {
  const { studentId } = useParams();
  const fetcher = useCallback(() => api.parentChildWeeklyTargets(studentId), [studentId]);
  const { data, error, loading, retry } = useApiQuery(fetcher);

  if (loading) {
    return <ParentLayout title="Weekly Targets"><p>Loading...</p></ParentLayout>;
  }

  if (error) {
    return (
      <ParentLayout title="Weekly Targets">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout title={`${data.studentName}'s Weekly Targets`}>
      <Link to={`/parent/child/${studentId}`} className="page-back-btn">← Back to Report</Link>

      <div className="page-intro mb-4">
        <p>{data.weekLabel} — track chapter quests, daily challenges, XP milestones, and streak goals.</p>
      </div>

      {data.targets.map((target) => (
        <div key={target.id} className="ustaad-list-card mb-3">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{target.icon}</span>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold mb-0">{target.label}</h6>
                <span className="ustaad-badge">{target.done}/{target.goal}</span>
              </div>
              <p className="text-muted small mb-2">{target.hint}</p>
              <div className="ustaad-progress mb-0">
                <div
                  className="ustaad-progress-bar"
                  style={{ width: `${Math.min(Math.round((target.done / target.goal) * 100), 100)}%` }}
                />
              </div>
            </div>
            {target.complete && <span className="text-success fw-bold">✓</span>}
          </div>
        </div>
      ))}
    </ParentLayout>
  );
}

export default ParentChildTargets;
