import { Link, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { useAuth } from "../../hooks/useAuth";
import { getReturnNav } from "../../utils/returnNav";

function Streak() {
  const { user } = useAuth();
  const location = useLocation();
  const { returnTo, returnLabel } = getReturnNav(location);
  const streak = user?.streak || 0;
  const badges = user?.badges || [];

  const streakBadges = [
    { days: 7, icon: "🔥", label: "7 Day Streak", key: "7-day", reward: "+50 bonus coins" },
    { days: 30, icon: "⭐", label: "30 Day Streak", key: "30-day", reward: "Exclusive badge + 200 coins" },
    { days: 100, icon: "💎", label: "100 Day Streak", key: "100-day", reward: "Premium trial + scholarship entry" },
  ];

  return (
    <AppLayout title="Streak System 🔥" backTo={returnTo} backLabel={returnLabel}>
      <div className="page-intro">
        <p>
          Learn every day to build your streak. Complete a daily challenge or finish any lesson to keep it alive.
          Missing a day resets your streak — so come back tomorrow!
        </p>
      </div>

      <div className="ustaad-card text-center mb-4" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontSize: "4rem" }}>🔥</div>
        <h2 className="fw-bold">{streak} Day Streak!</h2>
        <p className="text-muted mb-0">
          {streak === 0
            ? "Start your first lesson today to begin a streak."
            : streak < 7
              ? `${7 - streak} more day${7 - streak === 1 ? "" : "s"} to unlock the 7-day badge!`
              : "Amazing consistency — keep going!"}
        </p>
      </div>

      <h6 className="fw-bold mb-3">Streak Milestones</h6>
      {streakBadges.map((b) => {
        const earned = badges.includes(b.key);
        const daysLeft = Math.max(b.days - streak, 0);
        return (
          <div key={b.days} className={`ustaad-list-card ${earned ? "" : "opacity-75"}`}>
            <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: "2rem" }}>{b.icon}</span>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">{b.label}</h6>
                <small className="text-muted d-block">
                  {earned ? "Unlocked! " : `${daysLeft} more day${daysLeft === 1 ? "" : "s"} to go · `}
                  {b.reward}
                </small>
              </div>
              {earned && <span className="ustaad-badge">✅ Earned</span>}
            </div>
          </div>
        );
      })}

      <div className="page-intro mt-4">
        <p className="mb-2"><strong>Quick tips to keep your streak:</strong></p>
        <ul className="chapter-tips-list mb-0">
          <li>Complete the daily challenge each morning</li>
          <li>Finish at least one micro-lesson per day</li>
          <li>Set a reminder — even 10 minutes counts!</li>
        </ul>
      </div>

      <Button as={Link} to="/daily-challenge" className="ustaad-btn-primary w-100 mt-4">
        START TODAY&apos;S CHALLENGE
      </Button>
    </AppLayout>
  );
}

export default Streak;
