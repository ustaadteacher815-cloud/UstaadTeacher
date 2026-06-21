import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { getGradeLabel } from "../../data/learningContent";
import { getReturnNav } from "../../utils/returnNav";

function LearningPath() {
  const { user } = useAuth();
  const location = useLocation();
  const { returnTo, returnLabel, navState } = getReturnNav(location);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const gradeLabel = getGradeLabel(user?.grade);

  useEffect(() => {
    api.getSubjects()
      .then(setSubjects)
      .catch((err) => setError(err.message));
  }, [user?.grade]);

  return (
    <AppLayout
      title="Chapter Quests 🎯"
      backTo={returnTo}
      backLabel={returnLabel}
    >
      <div className="ustaad-card mb-4">
        <p className="text-muted mb-2" style={{ lineHeight: 1.7 }}>
          Step 1 — Pick a subject. Then choose a chapter and answer related questions to earn XP.
        </p>
        <p className="text-muted small mb-0">
          Showing <strong>{gradeLabel}</strong> CBSE syllabus
          {!user?.grade && " (update your grade in profile if this is wrong)"}.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {subjects.length === 0 && !error ? (
        <Alert variant="info">
          No subjects found for your grade. Please complete your profile and select Class 11 or Class 12.
        </Alert>
      ) : (
        <Row className="g-3">
          {subjects.map((s) => (
            <Col md={6} lg={4} key={s.id}>
              <Link
                to={`/chapter/${s.id}`}
                state={navState}
                className="ustaad-feature-card grid-card h-100"
              >
                <div className="ustaad-feature-icon">{s.icon}</div>
                <h5 className="fw-bold">{s.name}</h5>
                <p className="text-muted small mb-1">
                  {s.grade && s.board
                    ? `${s.chapters} ${s.board} ${s.grade} chapters`
                    : `${s.chapters} chapters`}
                </p>
                <div className="ustaad-progress mt-2">
                  <div className="ustaad-progress-bar" style={{ width: `${s.progress}%` }} />
                </div>
                <small className="text-muted">{s.progress}% complete</small>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </AppLayout>
  );
}

export default LearningPath;
