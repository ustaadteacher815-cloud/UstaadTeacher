import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";

function ParentChildReport() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.parentChildReport(studentId)
      .then((data) => { if (!cancelled) setChild(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [studentId]);

  const handleUnlink = async () => {
    if (!window.confirm("Unlink this child from your account?")) return;
    try {
      await api.parentUnlinkChild(studentId);
      navigate("/parent");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <ParentLayout title="Child Report"><p>Loading...</p></ParentLayout>;
  }

  if (error || !child) {
    return (
      <ParentLayout title="Child Report">
        <Alert variant="danger">{error || "Child not found"}</Alert>
        <Button as={Link} to="/parent" className="ustaad-btn-primary">Back</Button>
      </ParentLayout>
    );
  }

  const subjects = child.subjects?.length
    ? child.subjects
    : [
        { id: "mathematics", name: "Mathematics", icon: "📐", progress: child.subjectProgress?.mathematics || 0 },
        { id: "physics", name: "Physics", icon: "⚛️", progress: child.subjectProgress?.physics || 0 },
        { id: "chemistry", name: "Chemistry", icon: "🧪", progress: child.subjectProgress?.chemistry || 0 },
      ];

  return (
    <ParentLayout title={`${child.name}'s Report`}>
      <Link to="/parent" className="page-back-btn">← Back to Dashboard</Link>

      <div className="parent-child-links">
        <Link to={`/parent/child/${studentId}/analytics`}>📊 Analytics</Link>
        <Link to={`/parent/child/${studentId}/targets`}>🎯 Weekly Targets</Link>
        <Link to={`/parent/child/${studentId}/skills`}>💡 Skills & Careers</Link>
        <Link to={`/parent/child/${studentId}/community`}>👥 Study Lounges</Link>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{child.progress}%</div>
            <div>Progress</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{child.streak}</div>
            <div>Day Streak 🔥</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">Lvl {child.level || 1}</div>
            <div>{child.title || "Scholar"}</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="ustaad-stat-card">
            <div className="ustaad-stat-value">{child.lessonsCompleted}</div>
            <div>Lessons Done</div>
          </div>
        </Col>
      </Row>

      <div className="ustaad-card mb-4">
        <h5 className="fw-bold mb-3">Subject Progress</h5>
        {subjects.map((subject) => (
          <div key={subject.id} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>{subject.icon} {subject.name}</span>
              <span className="fw-bold">{subject.progress || 0}%</span>
            </div>
            <div className="ustaad-progress">
              <div className="ustaad-progress-bar" style={{ width: `${subject.progress || 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <div className="ustaad-card">
            <h6 className="fw-bold text-success mb-2">💪 Strengths</h6>
            {(child.strengths?.length ? child.strengths : ["Still assessing"]).map((s) => (
              <div key={s} className="ustaad-option selected">{s}</div>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <div className="ustaad-card">
            <h6 className="fw-bold text-danger mb-2">📈 Needs Focus</h6>
            {(child.weaknesses?.length ? child.weaknesses : ["Still assessing"]).map((s) => (
              <div key={s} className="ustaad-option">{s}</div>
            ))}
          </div>
        </Col>
      </Row>

      {child.personalPlan?.length > 0 && (
        <div className="ustaad-card mb-4">
          <h6 className="fw-bold mb-2">Personal Learning Plan</h6>
          {child.personalPlan.map((item) => (
            <div key={item} className="ustaad-option">{item}</div>
          ))}
        </div>
      )}

      <div className="ustaad-card mb-4">
        <h6 className="fw-bold mb-2">Profile</h6>
        <p className="mb-1"><strong>Grade:</strong> {child.gradeLabel || child.grade || "—"}</p>
        <p className="mb-1"><strong>Board:</strong> {child.board || "—"}</p>
        <p className="mb-1"><strong>XP:</strong> {child.xp} · <strong>Coins:</strong> {child.coins}</p>
        <p className="mb-1"><strong>Study Lounges:</strong> {child.joinedLounges ?? 0} joined</p>
        <p className="mb-1"><strong>AI Tutor messages:</strong> {child.aiMessages ?? 0}</p>
        {child.assessment?.total > 0 && (
          <p className="mb-1">
            <strong>Assessment:</strong> {child.assessment.score}/{child.assessment.total} (
            {Math.round((child.assessment.score / child.assessment.total) * 100)}%)
          </p>
        )}
        <p className="mb-1"><strong>Completed chapters:</strong> {child.completedLessons?.length || 0}</p>
        <p className="mb-0"><strong>Last active:</strong> {child.lastActiveDate || "—"}</p>
      </div>

      <Button variant="outline-danger" onClick={handleUnlink}>Unlink Child</Button>
    </ParentLayout>
  );
}

export default ParentChildReport;
