import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import SelectableOption from "../../components/SelectableOption";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { getReturnNav } from "../../utils/returnNav";

function DailyChallenge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { returnTo, returnLabel } = getReturnNav(location);
  const { refreshUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDailyChallenge()
      .then((data) => {
        setChallenge(data);
        if (data.completed) setResult({ alreadyDone: true });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    try {
      const data = await api.completeChallenge(challenge._id, selected);
      await refreshUser();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Daily Challenge ⚡" backTo={returnTo} backLabel={returnLabel}>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  if (result) {
    return (
      <AppLayout title="Challenge Complete! 🎉" backTo={returnTo} backLabel={returnLabel}>
        <div className="ustaad-card text-center" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: "3rem" }}>⚡</div>
          <h3 className="fw-bold">
            {result.alreadyDone
              ? "Already completed today!"
              : `+${result.xpEarned} XP & +${result.coinsEarned} Coins`}
          </h3>
          <p className="text-muted">
            {result.alreadyDone
              ? "You already earned today's challenge rewards. Come back tomorrow for a new quiz!"
              : result.correct === false
                ? "Good try! Review the explanation and come back tomorrow."
                : "Great job! Keep your streak going."}
          </p>
          <Button className="ustaad-btn-primary w-100 mb-2" onClick={() => navigate("/streak")}>
            VIEW STREAK
          </Button>
          <Button className="ustaad-btn-secondary w-100" onClick={() => navigate("/learning-path")}>
            CONTINUE LEARNING
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Daily Challenge ⚡" backTo={returnTo} backLabel={returnLabel}>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="ustaad-card" style={{ maxWidth: 600 }}>
        <span className="ustaad-badge mb-3 d-inline-block">Quiz / Puzzle / Scenario</span>
        <h4 className="fw-bold mb-3">{challenge?.title}</h4>
        <p className="mb-4">{challenge?.question}</p>
        {challenge?.options?.map((opt, i) => (
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
          onClick={handleSubmit}
        >
          SUBMIT ANSWER
        </Button>
      </div>
    </AppLayout>
  );
}

export default DailyChallenge;
