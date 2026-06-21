import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import {
  subjectInfo,
  getFallbackChaptersForGrade,
  getSubjectIdsForGrade,
  getGradeLabel,
  isCbseSyllabusSubject,
} from "../../data/learningContent";
import { getReturnNav } from "../../utils/returnNav";

function SelectChapter() {
  const { subject } = useParams();
  const location = useLocation();
  const { navState } = getReturnNav(location);
  const { user } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [loadedSubject, setLoadedSubject] = useState(null);
  const [error, setError] = useState("");
  const loading = loadedSubject !== subject;
  const gradeLabel = getGradeLabel(user?.grade);
  const completed = new Set(user?.completedLessons || []);

  const info = subjectInfo[subject] || {
    name: subject,
    icon: "📚",
    description: "Pick a chapter quest below. You will go straight to related practice questions for that chapter.",
    tips: ["Complete quests to earn +150 XP", "Answer all questions to finish the chapter", "Ask Doubt Coach if you get stuck"],
  };

  useEffect(() => {
    let cancelled = false;
    const allowed = getSubjectIdsForGrade(user?.grade);

    if (!allowed.includes(subject)) {
      setChapters([]);
      setError(`This subject is not part of the ${gradeLabel} syllabus. Go back to Chapter Quests.`);
      setLoadedSubject(subject);
      return undefined;
    }

    api.getChapters(subject)
      .then((data) => {
        if (!cancelled) {
          setChapters(
            data?.length ? data : getFallbackChaptersForGrade(user?.grade, subject)
          );
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setChapters(getFallbackChaptersForGrade(user?.grade, subject));
          setError(err.message || "Could not load chapters.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadedSubject(subject);
      });

    return () => {
      cancelled = true;
    };
  }, [subject, user?.grade, gradeLabel]);

  return (
    <AppLayout
      title={
        isCbseSyllabusSubject(subject)
          ? `${info.name} — ${gradeLabel} Chapters`
          : `${info.name} — Select Chapter`
      }
      backTo="/learning-path"
      backLabel="Back to Chapter Quests"
      backState={navState}
    >
      <div className="ustaad-card mb-3">
        <p className="text-muted small mb-0">
          Step 2 — Choose a chapter. Step 3 opens practice questions for that chapter.
        </p>
      </div>

      <div className="ustaad-card">
        <div className="chapter-intro-card">
          <h5 className="fw-bold mb-2">{info.icon} {info.name} Quests</h5>
          <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>{info.description}</p>
        </div>

        {error && <Alert variant="warning">{error}</Alert>}

        <h5 className="fw-bold mb-3">
          {loading ? "Loading chapters..." : `${chapters.length} chapter quests`}
        </h5>

        {loading ? (
          <p className="text-muted">Please wait while we load your chapters...</p>
        ) : chapters.length === 0 ? (
          <p className="text-muted">
            No chapters found for this subject. Return to Chapter Quests and pick a subject for {gradeLabel}.
          </p>
        ) : (
          chapters.map((ch) => {
            const done = completed.has(ch.id);
            return (
              <Link
                key={ch.id}
                to={`/practice/${ch.id}`}
                state={{ subject, chapterName: ch.name, ...navState }}
                className="ustaad-list-card"
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <h5 className="fw-bold mb-1">
                      🎯 {ch.chapterNo ? `Ch. ${ch.chapterNo} · ` : ""}{ch.name}
                    </h5>
                    <small className="text-muted">
                      {gradeLabel} syllabus · +150 XP quest · Related practice questions
                    </small>
                  </div>
                  <span className={`ustaad-badge ${done ? "text-success" : ""}`}>
                    {done ? "Completed ✓" : "Engage Quest →"}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}

export default SelectChapter;
