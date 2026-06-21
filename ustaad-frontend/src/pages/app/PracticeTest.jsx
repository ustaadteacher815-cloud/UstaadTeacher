import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import SelectableOption from "../../components/SelectableOption";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { formatChapterName, getSubjectForChapter } from "../../data/learningContent";

import { getReturnNav } from "../../utils/returnNav";

function PracticeTest() {
  const { chapterId } = useParams();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { returnTo, returnLabel, navState } = getReturnNav(location, {
    to: "/learning-path",
    label: "Back to Chapter Quests",
  });
  const [meta, setMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [hasDoubt, setHasDoubt] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const subjectId = location.state?.subject || meta?.subjectId || getSubjectForChapter(chapterId);
  const chapterName = location.state?.chapterName || meta?.chapterName || formatChapterName(chapterId);
  const backToChapters = `/chapter/${subjectId}`;

  useEffect(() => {
    setLoading(true);
    api.getPractice(chapterId)
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
          setMeta(null);
        } else {
          setQuestions(data.questions || []);
          setMeta(data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [chapterId]);

  const submitTest = async (finalAnswers, doubt) => {
    try {
      const data = await api.submitPractice(chapterId, finalAnswers, doubt);
      await refreshUser();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (hasDoubt === true) {
    return (
      <AppLayout
        title="Doubt Coach"
        backTo={`/practice/${chapterId}`}
        backLabel="Back to Quest"
      >
        <div className="ustaad-card text-center" style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: "3rem" }}>🧠</div>
          <p>Need help with {chapterName}? Your Doubt Coach can explain step-by-step.</p>
          <Button as={Link} to="/ai-tutor" className="ustaad-btn-primary w-100 mb-2">
            ASK DOUBT COACH
          </Button>
          <Button className="ustaad-btn-secondary w-100" onClick={() => setHasDoubt(false)}>
            CONTINUE QUEST
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (result) {
    return (
      <AppLayout
        title="Quest Complete"
        backTo={location.state?.returnTo || backToChapters}
        backLabel={location.state?.returnTo ? returnLabel : "Back to Chapters"}
        backState={location.state?.returnTo ? undefined : navState}
      >
        <div className="ustaad-card text-center" style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: "3rem" }}>✅</div>
          <h4 className="fw-bold">Quest cleared!</h4>
          <p className="text-muted">
            {chapterName}: {result.correct}/{result.total} correct
            {result.xpEarned > 0 && ` · +${result.xpEarned} XP earned`}
          </p>
          <Button as={Link} to={backToChapters} state={navState} className="ustaad-btn-primary w-100 mb-2">
            PICK ANOTHER CHAPTER
          </Button>
          {location.state?.returnTo ? (
            <Button as={Link} to={returnTo} className="ustaad-btn-primary w-100 mb-2">
              {returnLabel.toUpperCase()}
            </Button>
          ) : (
            <Button as={Link} to="/learning-path" state={navState} className="ustaad-btn-outline w-100">
              BACK TO SUBJECTS
            </Button>
          )}
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout title="Chapter Quest" backTo={backToChapters} backLabel="Back to Chapters">
        <p>Loading questions...</p>
      </AppLayout>
    );
  }

  if (!questions.length) {
    return (
      <AppLayout title="Chapter Quest" backTo={backToChapters} backLabel="Back to Chapters">
        <Alert variant="warning">No questions found for this chapter yet.</Alert>
        <Button as={Link} to={backToChapters} className="ustaad-btn-primary">
          Choose another chapter
        </Button>
      </AppLayout>
    );
  }

  const q = questions[current];

  return (
    <AppLayout
      title={`Chapter Quest — ${chapterName}`}
      backTo={backToChapters}
      backLabel="Back to Chapters"
    >
      <div className="page-intro mb-3">
        <p className="mb-0 small">
          Step 3 — Answer related questions for <strong>{chapterName}</strong>
          {meta?.subjectName ? ` (${meta.subjectName})` : ""}.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      <div className="ustaad-card" style={{ maxWidth: 640 }}>
        <span className="ustaad-badge mb-2 d-inline-block">+150 XP Quest</span>
        <span className="ustaad-badge mb-3 ms-2 d-inline-block">
          Question {current + 1}/{questions.length}
        </span>
        <h5 className="fw-bold mb-4">{q.question}</h5>
        {q.options.map((opt, i) => (
          <SelectableOption
            key={opt}
            selected={selected === i}
            onSelect={() => setSelected(i)}
          >
            {opt}
          </SelectableOption>
        ))}

        <div className="mt-4 mb-3">
          <p className="fw-bold mb-2">Do you have a doubt?</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" className="flex-fill" onClick={() => setHasDoubt(true)}>
              YES
            </Button>
            <Button variant="outline-success" className="flex-fill" onClick={() => setHasDoubt(false)}>
              NO
            </Button>
          </div>
        </div>

        <Button
          className="ustaad-btn-primary w-100"
          disabled={selected === null || hasDoubt === null}
          onClick={() => {
            const updated = [
              ...answers,
              { questionId: q._id, selected },
            ];
            setAnswers(updated);
            if (current < questions.length - 1) {
              setCurrent((c) => c + 1);
              setSelected(null);
              setHasDoubt(null);
            } else {
              submitTest(updated, hasDoubt === true);
            }
          }}
        >
          {current < questions.length - 1 ? "NEXT" : "SUBMIT QUEST"}
        </Button>
      </div>
    </AppLayout>
  );
}

export default PracticeTest;
