import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(() => {});
  }, [user]);

  const name = stats?.name || user?.name || "Student";

  return (
    <AppLayout title={`Welcome back, ${name}! 👋`}>
      <div className="ustaad-card mb-4" style={{ background: "linear-gradient(135deg, #58cc02, #46a302)", color: "white" }}>
        <h4 className="fw-bold">🔔 Today&apos;s Challenge is Ready!</h4>
        <p className="mb-3">Complete your daily quiz and earn XP + coins</p>
        <Button as={Link} to="/daily-challenge" variant="light" className="fw-bold">
          START CHALLENGE
        </Button>
      </div>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{stats?.xp ?? user?.xp ?? 0}</div>
            <div>XP Points</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{stats?.coins ?? user?.coins ?? 0}</div>
            <div>Coins</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">🔥 {stats?.streak ?? user?.streak ?? 0}</div>
            <div>Day Streak</div>
          </div>
        </Col>
      </Row>

      <h5 className="fw-bold mb-3">Continue Learning</h5>
      <Row className="g-3 mb-4">
        {[
          { to: "/learning-path", icon: "📚", title: "Learning Path", desc: "Class 11 & 12 — Math, Physics, Chemistry, Biology" },
          { to: "/ai-tutor", icon: "🤖", title: "AI Tutor", desc: "Ask questions anytime" },
          { to: "/recommendations", icon: "✨", title: "AI Recommendations", desc: "Topics to revise & master" },
        ].map((item) => (
          <Col md={4} key={item.to}>
            <Link to={item.to} className="ustaad-feature-card grid-card h-100">
              <div className="ustaad-feature-icon">{item.icon}</div>
              <h6 className="fw-bold">{item.title}</h6>
              <p className="text-muted mb-0 small">{item.desc}</p>
            </Link>
          </Col>
        ))}
      </Row>

      <h5 className="fw-bold mb-3">Explore More</h5>
      <Row className="g-3">
        {[
          { to: "/leaderboard", icon: "🏆", title: "Leaderboard" },
          { to: "/community", icon: "👥", title: "Community" },
          { to: "/analytics", icon: "📊", title: "Weekly Analytics" },
          { to: "/career-explorer", icon: "🎯", title: "Career Explorer" },
          { to: "/rewards", icon: "🎁", title: "Rewards" },
          { to: "/become-ustaad", icon: "🌟", title: "Become an Ustaad" },
        ].map((item) => (
          <Col md={4} key={item.to}>
            <Link to={item.to} className="ustaad-feature-card grid-card h-100 text-center">
              <div className="ustaad-feature-icon">{item.icon}</div>
              <h6 className="fw-bold mb-0">{item.title}</h6>
            </Link>
          </Col>
        ))}
      </Row>
    </AppLayout>
  );
}

export default Dashboard;
