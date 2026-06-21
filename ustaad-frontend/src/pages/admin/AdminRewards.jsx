import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminRewards() {
  const { data, error, loading, retry } = useApiQuery(api.adminRewardsOverview);

  if (loading) {
    return <AdminLayout title="Rewards"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Rewards">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Rewards">
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalRedemptions}</div>
          <div className="admin-stat-label">Total Redemptions</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalCoinsInCirculation}</div>
          <div className="admin-stat-label">Coins in Circulation</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.rewards.length}</div>
          <div className="admin-stat-label">Reward Items</div>
        </div>
      </div>

      {data.rewards.map((reward) => (
        <div key={reward.id} className="ustaad-list-card">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span style={{ fontSize: "2rem" }}>{reward.icon}</span>
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{reward.name}</h6>
              <small className="text-muted">{reward.cost} coins · {reward.redemptions} redeemed</small>
            </div>
            <span className="admin-tag admin-tag-warning">{reward.redemptions} redemptions</span>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}

export default AdminRewards;
