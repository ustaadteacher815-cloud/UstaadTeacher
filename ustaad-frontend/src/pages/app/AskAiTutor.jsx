import { useEffect, useRef, useState } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";

const WELCOME = {
  from: "ai",
  text: "Hi! I'm your Doubt Coach. Ask any CBSE Class 11/12 question and I'll break it down step-by-step.",
};

const QUICK_PROMPTS = [
  "Find the domain of f(x) = √(x-3) / (x-5).",
  "Explain derivative of sin(x)·cos(x) using first principles.",
  "Solve for complex roots: x² - 4x + 13 = 0.",
  "Show that |P({1, 2, 3})| = 8 for the power set.",
];

function AskAiTutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    api.getAiHistory()
      .then((history) => {
        if (history.length) {
          setMessages(history.map((m) => ({ from: m.role, text: m.text })));
        } else {
          setMessages([WELCOME]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (userMsg) => {
    if (!userMsg.trim() || sending) return;

    setError("");
    setFallbackNotice("");
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setSending(true);

    try {
      const data = await api.sendAiMessage(userMsg);
      setMessages(data.history.map((m) => ({ from: m.role, text: m.text })));
      if (data.source === "fallback") {
        setFallbackNotice(
          "Gemini was temporarily busy. A basic guide was shown — please send your question again."
        );
      }
    } catch (err) {
      setError(err.message);
      setMessages((m) => m.slice(0, -1));
      setInput(userMsg);
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.clearAiHistory();
      setMessages([WELCOME]);
      setFallbackNotice("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setInput("");
    await sendMessage(userMsg);
  };

  return (
    <AppLayout title="Doubt Coach 🧠" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro mb-3">
        <p>Instant step-by-step CBSE guidance powered by AI. Enter a formula, theorem, or problem below.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {fallbackNotice && <Alert variant="warning">{fallbackNotice}</Alert>}

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="ustaad-card h-100">
            <Form onSubmit={handleSend}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Your doubt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter formula, theorem, equation, or proof to break down..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending}
                />
              </Form.Group>
              <Button
                type="submit"
                className="ustaad-btn-primary"
                disabled={sending || !input.trim()}
              >
                {sending ? "Examining..." : "Examine step-by-step ✨"}
              </Button>
            </Form>

            <h6 className="fw-bold mt-4 mb-2">Quick math prompts</h6>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="ustaad-list-card w-100 text-start mb-2"
                disabled={sending}
                onClick={() => sendMessage(prompt)}
              >
                <small>{prompt}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="ustaad-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Solved steps board</h6>
              <Button variant="link" size="sm" className="text-muted p-0" onClick={handleClear}>
                Clear chat
              </Button>
            </div>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {loading ? (
                <p>Loading chat...</p>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-3 p-3 rounded ${msg.from === "ai" ? "bg-light" : ""}`}
                      style={msg.from === "user" ? { background: "#e8f9d0" } : undefined}
                    >
                      {msg.from === "ai" && <strong>🤖 Coach: </strong>}
                      {msg.from === "user" && <strong>You: </strong>}
                      <span style={{ whiteSpace: "pre-line" }}>{msg.text}</span>
                    </div>
                  ))}
                  {sending && (
                    <div className="mb-3 p-3 rounded bg-light">
                      <strong>🤖 Coach: </strong>
                      <Spinner animation="border" size="sm" className="ms-2" />
                      <span className="text-muted ms-2 small">Thinking...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AskAiTutor;
