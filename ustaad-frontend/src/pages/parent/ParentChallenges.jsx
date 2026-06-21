import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentChallenges() {
  const { data, loading } = useApiQuery(api.parentChallenges);

  return (
    <ParentLayout title="Daily Challenges">
      <div className="page-intro">
        <p>Track how many daily challenges each child has completed.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.children?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">Link a child to view challenge progress.</p>
          <Link to="/parent/link" className="ustaad-link">Link child →</Link>
        </div>
      ) : (
        data.children.map((child) => (
          <div key={child.id} className="parent-child-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1">{child.name}</h5>
                <p className="text-muted small mb-0">{child.streak} day streak</p>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#1cb0f6" }}>
                  {child.completedCount}
                </div>
                <small className="text-muted">Challenges done</small>
              </div>
            </div>
            {child.completedChallenges.length > 0 && (
              <div className="mt-3">
                <small className="text-muted d-block mb-1">Recent challenges</small>
                <div className="d-flex flex-wrap gap-2">
                  {child.completedChallenges.slice(-5).map((c) => (
                    <span key={c} className="admin-tag">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </ParentLayout>
  );
}

export default ParentChallenges;
