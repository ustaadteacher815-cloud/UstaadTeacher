import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function TheoryLab() {
  const { data, error, loading, retry } = useApiQuery(api.getTheoryLab);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);

  if (loading) {
    return (
      <AppLayout title="Theory Lab 📖" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading syllabus...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Theory Lab 📖" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  const subjects = data?.subjects || [];
  const selectedSubject = subjects.find((s) => s.id === activeSubject) || subjects[0];
  const selectedChapter =
    selectedSubject?.chapters.find((c) => c.id === activeChapter) ||
    selectedSubject?.chapters[0];

  return (
    <AppLayout title="Theory Lab 📖" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro mb-4">
        <p>
          Interactive syllabus lessons for <strong>{data.gradeLabel}</strong>. Pick a chapter to watch
          theory videos, open formula notes, and practice with AI support.
        </p>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            type="button"
            className={`ustaad-btn-outline btn ${selectedSubject?.id === subject.id ? "active" : ""}`}
            onClick={() => {
              setActiveSubject(subject.id);
              setActiveChapter(null);
            }}
          >
            {subject.icon} {subject.name}
          </button>
        ))}
      </div>

      {selectedSubject && (
        <>
          <h6 className="fw-bold mb-3">{selectedSubject.name} chapters</h6>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {selectedSubject.chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                className={`ustaad-btn-outline btn btn-sm ${selectedChapter?.id === chapter.id ? "active" : ""}`}
                onClick={() => setActiveChapter(chapter.id)}
              >
                {chapter.chapterNo}. {chapter.name}
              </button>
            ))}
          </div>

          {selectedChapter && (
            <div className="ustaad-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Ch {selectedChapter.chapterNo}: {selectedChapter.name}
                  </h5>
                  <small className="text-muted">
                    {selectedChapter.lessons} micro-lessons · {data.gradeLabel} syllabus
                  </small>
                </div>
                {selectedChapter.completed && (
                  <span className="ustaad-badge">Completed ✓</span>
                )}
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to={`/lesson/${selectedChapter.id}`} className="ustaad-btn-primary">
                  Open Theory Lesson
                </Button>
                <Button as={Link} to={`/practice/${selectedChapter.id}`} className="ustaad-btn-outline">
                  Chapter Quest
                </Button>
                <Button as={Link} to={`/real-world/${selectedChapter.id}`} className="ustaad-btn-outline">
                  Real-World Apps
                </Button>
                <Button as={Link} to="/board-faq" className="ustaad-btn-outline">
                  Solved Board FAQ
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}

export default TheoryLab;
