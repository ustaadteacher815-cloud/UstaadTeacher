import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentRewards() {
  const { data, loading } = useApiQuery(api.parentRewards);

  return (
    <ParentLayout title="Rewards & Badges">
      <div className="page-intro">
        <p>Coins earned, badges unlocked, and rewards redeemed by each child.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.children?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">Link a child to view rewards.</p>
          <Link to="/parent/link" className="ustaad-link">Link child →</Link>
        </div>
      ) : (
        data.children.map((child) => (
          <div key={child.id} className="ustaad-card mb-3">
            <h5 className="fw-bold mb-3">{child.name}</h5>
            <div className="d-flex gap-4 mb-3 flex-wrap">
              <div>
                <small className="text-muted">Coins</small>
                <div className="fw-bold" style={{ fontSize: "1.3rem" }}>🪙 {child.coins}</div>
              </div>
              <div>
                <small className="text-muted">Badges</small>
                <div className="fw-bold">{child.badges.length}</div>
              </div>
              <div>
                <small className="text-muted">Redeemed</small>
                <div className="fw-bold">{child.redeemedRewards.length}</div>
              </div>
            </div>
            {child.badges.length > 0 && (
              <div className="mb-2">
                <small className="text-muted d-block mb-1">Badges earned</small>
                <div className="d-flex flex-wrap gap-2">
                  {child.badges.map((badge) => (
                    <span key={badge} className="admin-tag admin-tag-success">{badge}</span>
                  ))}
                </div>
              </div>
            )}
            {child.redeemedRewards.length > 0 && (
              <div>
                <small className="text-muted d-block mb-1">Redeemed rewards</small>
                <div className="d-flex flex-wrap gap-2">
                  {child.redeemedRewards.map((reward) => (
                    <span key={reward} className="admin-tag">{reward}</span>
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

export default ParentRewards;
