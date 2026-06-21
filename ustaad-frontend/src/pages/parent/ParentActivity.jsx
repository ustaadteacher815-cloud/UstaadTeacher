import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentActivity() {
  const { data, loading } = useApiQuery(api.parentActivity);

  return (
    <ParentLayout title="Activity & Streaks">
      <div className="page-intro">
        <p>Track daily study habits, streaks, and recent activity for each linked child.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.children?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">Link a child to view activity.</p>
          <Link to="/parent/link" className="ustaad-link">Link child →</Link>
        </div>
      ) : (
        data.children.map((child) => (
          <Link key={child.id} to={`/parent/child/${child.id}`} className="parent-child-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1">{child.name}</h5>
                <p className="text-muted small mb-0">
                  Last active: {child.lastActiveDate || "Not yet"}
                </p>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: "1.5rem" }}>{child.streak} 🔥</div>
                <small className="text-muted">Day streak</small>
              </div>
            </div>
            <div className="d-flex gap-4 mt-3 flex-wrap">
              <div><small className="text-muted">Lessons</small><div className="fw-bold">{child.lessonsCompleted}</div></div>
              <div><small className="text-muted">Study time</small><div className="fw-bold">{child.timeSpent}</div></div>
              <div><small className="text-muted">Badges</small><div className="fw-bold">{child.badges}</div></div>
              {child.inactiveDays !== null && child.inactiveDays >= 2 && (
                <span className="admin-tag admin-tag-warning">Inactive {child.inactiveDays}d</span>
              )}
            </div>
          </Link>
        ))
      )}
    </ParentLayout>
  );
}

export default ParentActivity;
