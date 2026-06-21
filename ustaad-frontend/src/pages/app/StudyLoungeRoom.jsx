import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function StudyLoungeRoom() {
  const { loungeId } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [lounge, setLounge] = useState(null);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadLounge = useCallback(async () => {
    try {
      const data = await api.getStudyLounge(loungeId);
      setLounge(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loungeId]);

  useEffect(() => {
    loadLounge();
    const timer = setInterval(loadLounge, 8000);
    return () => clearInterval(timer);
  }, [loadLounge]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const data = await api.postLoungeMessage(loungeId, input.trim());
      setInput("");
      setMessage(`+${data.xpEarned} XP for contributing!`);
      await refreshUser();
      await loadLounge();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Study Lounge" backTo="/community" backLabel="Back to Lounges">
        <p>Entering space...</p>
      </AppLayout>
    );
  }

  if (error && !lounge) {
    return (
      <AppLayout title="Study Lounge" backTo="/community" backLabel="Back to Lounges">
        <Alert variant="danger">{error}</Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`${lounge.icon} ${lounge.name}`} backTo="/community" backLabel="Back to Lounges">
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="ustaad-card mb-3">
            <span className="ustaad-badge mb-2 d-inline-block">{lounge.type}</span>
            <h5 className="fw-bold mb-1">{lounge.topic}</h5>
            <p className="text-muted small mb-2">{lounge.activity}</p>
            <span className="text-success small fw-semibold">● {lounge.members} online</span>
          </div>

          <div className="ustaad-card mb-3 lounge-chat-panel">
            <h6 className="fw-bold mb-3">Live discussion</h6>
            <div className="lounge-chat-messages">
              {lounge.messages?.length === 0 ? (
                <p className="text-muted small">No messages yet. Start the conversation!</p>
              ) : (
                lounge.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`lounge-chat-row ${msg.isYou ? "sent" : "received"}`}
                  >
                    <div className={`lounge-chat-bubble ${msg.isYou ? "sent" : "received"}`}>
                      <div className="lounge-chat-meta">
                        <strong>{msg.isYou ? "You" : msg.userName}</strong>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                      <p className="mb-0">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSend} className="d-flex gap-2">
            <Form.Control
              placeholder="Share a doubt, tip, or answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              maxLength={500}
            />
            <Button type="submit" className="ustaad-btn-primary" disabled={sending || !input.trim()}>
              Send
            </Button>
          </Form>
        </div>

        <div className="col-lg-4">
          <div className="ustaad-card mb-3">
            <h6 className="fw-bold mb-3">Active scholars</h6>
            {lounge.activeScholars?.length === 0 ? (
              <p className="text-muted small mb-0">You are among the first here!</p>
            ) : (
              lounge.activeScholars.map((member) => (
                <div key={member.id} className="d-flex justify-content-between small mb-2">
                  <span>{member.name}</span>
                  <span className="text-muted">{member.xp} XP</span>
                </div>
              ))
            )}
          </div>

          <div className="ustaad-card mb-3 border-success">
            <h6 className="fw-bold text-success mb-2">Cooperative challenge</h6>
            <p className="small mb-3">{lounge.challenge}</p>
            <Button as={Link} to="/daily-challenge" className="ustaad-btn-primary btn-sm w-100 mb-2">
              Daily Challenge
            </Button>
            <Button as={Link} to="/learning-path" className="ustaad-btn-outline btn-sm w-100">
              Chapter Quests
            </Button>
          </div>

          <Button variant="outline-secondary" className="w-100" onClick={() => navigate("/community")}>
            Leave lounge
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudyLoungeRoom;
