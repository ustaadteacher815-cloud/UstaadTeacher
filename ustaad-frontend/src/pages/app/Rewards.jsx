import { useCallback, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function Rewards() {
  const { data, error, loading, retry } = useApiQuery(api.getRewards);
  const [message, setMessage] = useState("");

  const reload = useCallback(() => {
    retry();
  }, [retry]);

  const handleRedeem = async (rewardId) => {
    try {
      const res = await api.redeemReward(rewardId);
      setMessage(res.message);
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const rewards = data?.rewards || [];
  const coins = data?.coins || 0;

  return (
    <AppLayout title="Reward Redemption 🎁" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Earn coins by completing lessons, daily challenges, and maintaining your streak. Redeem them for
          food coupons, vouchers, premium access, and scholarship entries.
        </p>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <Button size="sm" variant="outline-danger" onClick={retry}>Retry</Button>
        </Alert>
      )}

      {loading ? (
        <p>Loading rewards...</p>
      ) : (
        <>
          <div className="ustaad-card mb-4 text-center">
            <h4 className="fw-bold">Your Coins: {coins} 🪙</h4>
            <p className="text-muted mb-0">
              Daily challenge = +10 coins · Lesson complete = +5 coins · 7-day streak = +50 bonus
            </p>
          </div>

          <h6 className="fw-bold mb-3">Available rewards</h6>

          {rewards.map((r) => (
            <div key={r.id} className="ustaad-list-card">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span style={{ fontSize: "2rem" }}>{r.icon}</span>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{r.name}</h6>
                  <small className="text-muted">
                    {r.cost} coins
                    {!r.canRedeem && !r.redeemed && ` · Need ${r.cost - coins} more coins`}
                  </small>
                </div>
                <button
                  className="ustaad-btn-primary btn"
                  style={{ height: 40, fontSize: 14 }}
                  disabled={!r.canRedeem || r.redeemed}
                  onClick={() => handleRedeem(r.id)}
                >
                  {r.redeemed ? "REDEEMED ✓" : "REDEEM"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="page-intro mt-2">
        <p>More rewards are added every month. Keep learning to unlock premium prizes and scholarship tokens!</p>
      </div>
    </AppLayout>
  );
}

export default Rewards;
