import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Alert, Button, Nav, Tab } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";

function AdminUserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [targets, setTargets] = useState(null);
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [userData, analyticsData, targetsData, skillsData] = await Promise.all([
        api.adminGetUser(userId),
        api.adminGetUserAnalytics(userId),
        api.adminGetUserWeeklyTargets(userId),
        api.adminGetUserSkills(userId),
      ]);
      setUser(userData);
      setAnalytics(analyticsData);
      setTargets(targetsData);
      setSkills(skillsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const userDetailLayout = {
    backTo: "/admin/users",
    backLabel: "Back to Users",
  };

  if (loading) {
    return (
      <AdminLayout title="User Detail" {...userDetailLayout}>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout title="User Detail" {...userDetailLayout}>
        <Alert variant="danger">{error || "User not found"}</Alert>
        <Button className="ustaad-btn-primary" onClick={loadData}>Retry</Button>
      </AdminLayout>
    );
  }

  const roleLabel = user.role === "parent" ? "Parent" : "Student";

  return (
    <AdminLayout title={`${user.name || roleLabel} Detail`} {...userDetailLayout}>
      <Row className="g-3 mb-4">
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{user.xp ?? 0}</div><div>XP</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{user.streak ?? 0}</div><div>Streak</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">{analytics?.progress ?? 0}%</div><div>Progress</div></div></Col>
        <Col md={3}><div className="ustaad-stat-card"><div className="ustaad-stat-value">Lvl {analytics?.level ?? 1}</div><div>{analytics?.title || "Scholar"}</div></div></Col>
      </Row>

      <div className="ustaad-card mb-4">
        <h6 className="fw-bold mb-2">Account Info</h6>
        <p className="mb-1"><strong>Role:</strong> {roleLabel}</p>
        <p className="mb-1"><strong>Phone:</strong> {user.phone}</p>
        <p className="mb-1"><strong>Grade:</strong> {user.grade || "—"} · <strong>Board:</strong> {user.board || "—"}</p>
        <p className="mb-1"><strong>Lessons:</strong> {user.lessonsCompleted ?? 0} · <strong>Coins:</strong> {user.coins ?? 0}</p>
        <p className="mb-0">
          <strong>Onboarding:</strong>{" "}
          <span className={`admin-tag ${user.onboardingComplete ? "admin-tag-success" : "admin-tag-warning"}`}>
            {user.onboardingComplete ? "Complete" : "Pending"}
          </span>
        </p>
      </div>

      {user.role !== "parent" && (
        <Tab.Container defaultActiveKey="analytics">
          <Nav variant="pills" className="mb-3 gap-2">
            <Nav.Item><Nav.Link eventKey="analytics">Analytics</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="targets">Weekly Targets</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="skills">Skills & Careers</Nav.Link></Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="analytics">
              <div className="ustaad-card">
                <Row className="g-3 mb-3">
                  <Col md={4}><strong>Time spent:</strong> {analytics?.timeSpent}</Col>
                  <Col md={4}><strong>Lessons done:</strong> {analytics?.lessonsDone}</Col>
                  <Col md={4}><strong>Avg score:</strong> {analytics?.avgScore}%</Col>
                </Row>
                <h6 className="fw-bold mb-2">Subject Breakdown</h6>
                {(analytics?.subjectBreakdown || []).filter((s) => s.score > 0).map((subject) => (
                  <div key={subject.topic} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{subject.topic}</span>
                      <span>{subject.score}%</span>
                    </div>
                    <div className="ustaad-progress">
                      <div className="ustaad-progress-bar" style={{ width: `${subject.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="targets">
              {targets?.targets?.map((target) => (
                <div key={target.id} className="ustaad-list-card mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{target.icon} {target.label}</span>
                    <span className="fw-bold">{target.done}/{target.goal}</span>
                  </div>
                  <small className="text-muted">{target.hint}</small>
                </div>
              ))}
            </Tab.Pane>

            <Tab.Pane eventKey="skills">
              <h6 className="fw-bold mb-2">Skill Tracks</h6>
              {skills?.tracks?.map((track) => (
                <div key={track.id} className="ustaad-list-card mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{track.icon} {track.name}</span>
                    <span>{track.progress}%</span>
                  </div>
                </div>
              ))}
              <h6 className="fw-bold mb-2 mt-3">Career Matches</h6>
              <div className="d-flex flex-wrap gap-2">
                {skills?.topCareers?.map((career) => (
                  <span key={career.id} className="admin-tag admin-tag-info">
                    {career.icon} {career.name} · {career.matchScore}%
                  </span>
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}
    </AdminLayout>
  );
}

export default AdminUserDetail;
