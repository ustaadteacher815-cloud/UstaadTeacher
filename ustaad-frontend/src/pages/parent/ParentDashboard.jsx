import { Link } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentDashboard() {
  const { data, error, loading, retry } = useApiQuery(api.parentDashboard);

  if (loading) {
    return <ParentLayout title="Parent Dashboard"><p>Loading...</p></ParentLayout>;
  }

  if (error) {
    return (
      <ParentLayout title="Parent Dashboard">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout title="Parent Dashboard">
      <div className="page-intro">
        <p>
          Welcome{data.parentName ? `, ${data.parentName}` : ""}! Monitor your child&apos;s progress,
          streaks, and subject performance — all in one place.
        </p>
      </div>

      {data.children.length === 0 ? (
        <div className="ustaad-card text-center">
          <div style={{ fontSize: "3rem" }}>👨‍👩‍👧</div>
          <h4 className="fw-bold mb-2">No child linked yet</h4>
          <p className="text-muted mb-4">
            Link your child&apos;s Ustaad account using the phone number they signed up with.
          </p>
          <Button as={Link} to="/parent/link" className="ustaad-btn-primary">
            Link Your Child
          </Button>
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <div className="ustaad-stat-card">
                <div className="ustaad-stat-value">{data.linkedCount}</div>
                <div>Linked Children</div>
              </div>
            </Col>
          </Row>

          {data.children.map((child) => (
            <Link key={child.id} to={`/parent/child/${child.id}`} className="parent-child-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-1">{child.name}</h5>
                  <p className="text-muted small mb-2">{child.grade || "—"} · {child.board || "—"} · {child.phone}</p>
                  <span className={`admin-tag ${child.onboardingComplete ? "admin-tag-success" : "admin-tag-warning"}`}>
                    {child.onboardingComplete ? "Active learner" : "Onboarding"}
                  </span>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ color: "#1cb0f6", fontSize: "1.4rem" }}>{child.progress}%</div>
                  <small className="text-muted">Overall progress</small>
                </div>
              </div>
              <Row className="g-2 mt-3">
                <Col xs={3}><small className="text-muted">XP</small><div className="fw-bold">{child.xp}</div></Col>
                <Col xs={3}><small className="text-muted">Streak</small><div className="fw-bold">{child.streak} 🔥</div></Col>
                <Col xs={3}><small className="text-muted">Lessons</small><div className="fw-bold">{child.lessonsCompleted}</div></Col>
                <Col xs={3}><small className="text-muted">Time</small><div className="fw-bold">{child.timeSpent}</div></Col>
              </Row>
            </Link>
          ))}
        </>
      )}
    </ParentLayout>
  );
}

export default ParentDashboard;
