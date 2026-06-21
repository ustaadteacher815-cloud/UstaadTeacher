import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import OnboardingLayout from "../../components/layouts/OnboardingLayout";
import SelectableOption from "../../components/SelectableOption";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

function Assessment() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAssessment()
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = async () => {
    const updated = [
      ...answers,
      { questionId: questions[current]._id, selected },
    ];
    setAnswers(updated);

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      return;
    }

    try {
      const data = await api.submitAssessment(updated);
      await refreshUser();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <OnboardingLayout step={3}>
        <p className="text-center">Loading assessment...</p>
      </OnboardingLayout>
    );
  }

  if (result) {
    return (
      <OnboardingLayout step={3}>
        <div className="text-center">
          <div style={{ fontSize: "3rem" }}>📋</div>
          <h1 className="ustaad-title">Assessment Complete!</h1>
          <p className="ustaad-subtitle">
            You scored {result.score}/{result.total}. We&apos;ve identified your
            strengths and areas to improve.
          </p>
          <div className="row mb-4">
            <div className="col-6">
              <div className="ustaad-stat-card">
                <div className="ustaad-stat-value">💪</div>
                <div>Strength: {result.strengths[0]}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="ustaad-stat-card">
                <div className="ustaad-stat-value">📈</div>
                <div>Improve: {result.weaknesses[0]}</div>
              </div>
            </div>
          </div>
          <Button
            className="ustaad-btn-primary w-100"
            onClick={() => navigate("/personal-plan")}
          >
            SEE MY PLAN
          </Button>
        </div>
      </OnboardingLayout>
    );
  }

  if (!questions.length) {
    return (
      <OnboardingLayout step={3}>
        <Alert variant="warning">No assessment questions found. Run backend seed.</Alert>
      </OnboardingLayout>
    );
  }

  const q = questions[current];

  return (
    <OnboardingLayout step={3}>
      {error && <Alert variant="danger">{error}</Alert>}
      <span className="ustaad-badge mb-3 d-inline-block">
        Question {current + 1} of {questions.length}
      </span>
      <h1 className="ustaad-title" style={{ fontSize: "1.4rem" }}>{q.question}</h1>
      <p className="ustaad-subtitle">Evaluate your knowledge level</p>

      {q.options.map((opt, i) => (
        <SelectableOption
          key={opt}
          selected={selected === i}
          onSelect={() => setSelected(i)}
        >
          {opt}
        </SelectableOption>
      ))}

      <Button
        className="ustaad-btn-primary w-100 mt-3"
        disabled={selected === null}
        onClick={handleNext}
      >
        {current < questions.length - 1 ? "NEXT" : "FINISH"}
      </Button>
    </OnboardingLayout>
  );
}

export default Assessment;
