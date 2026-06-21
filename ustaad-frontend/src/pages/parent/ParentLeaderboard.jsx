import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentLeaderboard() {
  const { data, loading } = useApiQuery(api.parentLeaderboard);

  return (
    <ParentLayout title="Leaderboard">
      <div className="page-intro">
        <p>See how your children rank among all Ustaad learners by XP.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.children?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">Link a child to see their rank.</p>
          <Link to="/parent/link" className="ustaad-link">Link child →</Link>
        </div>
      ) : (
        <>
          <p className="text-muted small mb-3">
            Competing among {data.totalStudents} students on Ustaad
          </p>
          {data.children.map((child) => (
            <div key={child.id} className="parent-child-card">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-1">{child.name}</h5>
                  <p className="text-muted small mb-0">{child.xp} XP · {child.streak} day streak</p>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ fontSize: "1.6rem", color: "#ffc800" }}>
                    #{child.rank}
                  </div>
                  <small className="text-muted">Global rank</small>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </ParentLayout>
  );
}

export default ParentLeaderboard;
