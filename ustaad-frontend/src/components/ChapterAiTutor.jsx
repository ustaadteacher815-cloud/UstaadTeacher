import { useState } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { api } from "../api/client";

function ChapterAiTutor({ chapterName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput("");
    setError("");
    setFallbackNotice("");
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setSending(true);

    try {
      const localHistory = messages.map((m) => ({
        role: m.from === "ai" ? "ai" : "user",
        text: m.text,
      }));

      const data = await api.sendAiMessage(userMsg, {
        chapterName,
        sessionOnly: true,
        localHistory,
      });

      setMessages((prev) => [...prev, { from: "ai", text: data.reply }]);
      if (data.source === "fallback") {
        setFallbackNotice("AI is busy — basic guide shown. Try again in a moment.");
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMsg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chapter-ai-tutor mt-4">
      <h6 className="fw-bold mb-2">🤖 AI Tutor</h6>
      <p className="text-muted small mb-3">
        Stuck on <strong>{chapterName}</strong>? Ask a doubt — get instant help for this chapter.
      </p>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
      {fallbackNotice && <Alert variant="warning" className="py-2 small">{fallbackNotice}</Alert>}

      {messages.length > 0 && (
        <div className="chapter-ai-messages mb-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chapter-ai-msg ${msg.from === "ai" ? "ai" : "user"}`}
            >
              {msg.from === "ai" && <strong className="small">Ustaad AI: </strong>}
              <span style={{ whiteSpace: "pre-line" }}>{msg.text}</span>
            </div>
          ))}
          {sending && (
            <div className="chapter-ai-msg ai">
              <strong className="small">Ustaad AI: </strong>
              <Spinner animation="border" size="sm" className="ms-1" />
              <span className="text-muted ms-2 small">Thinking...</span>
            </div>
          )}
        </div>
      )}

      <Form onSubmit={handleSend} className="d-flex gap-2">
        <Form.Control
          size="sm"
          placeholder={`Ask about ${chapterName}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <Button
          type="submit"
          className="ustaad-btn-primary"
          style={{ minWidth: 72 }}
          disabled={sending || !input.trim()}
        >
          {sending ? "..." : "Ask"}
        </Button>
      </Form>
    </div>
  );
}

export default ChapterAiTutor;
