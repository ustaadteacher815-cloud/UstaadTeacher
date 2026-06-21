import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";

const emptyForm = {
  type: "assessment",
  subject: "general",
  chapterId: "",
  question: "",
  options: ["", "", "", ""],
  answer: 0,
  explanation: "",
};

function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api.adminGetQuestions(filter ? { type: filter } : {})
      .then((result) => {
        if (!cancelled) setQuestions(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, refreshKey]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditingId(q._id);
    setForm({
      type: q.type,
      subject: q.subject || "general",
      chapterId: q.chapterId || "",
      question: q.question,
      options: [...q.options],
      answer: q.answer,
      explanation: q.explanation || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        options: form.options.filter((o) => o.trim()),
        answer: Number(form.answer),
      };
      if (editingId) {
        await api.adminUpdateQuestion(editingId, payload);
        setMessage("Question updated.");
      } else {
        await api.adminCreateQuestion(payload);
        setMessage("Question created.");
      }
      setModalOpen(false);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.adminDeleteQuestion(id);
      setMessage("Question deleted.");
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateOption = (index, value) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  return (
    <AdminLayout title="Question Bank">
      <div className="admin-toolbar">
        <Form.Select
          value={filter}
          onChange={(e) => { setLoading(true); setFilter(e.target.value); }}
          style={{ maxWidth: 180 }}
        >
          <option value="">All types</option>
          <option value="assessment">Assessment</option>
          <option value="daily">Daily</option>
          <option value="practice">Practice</option>
        </Form.Select>
        <Button className="ustaad-btn-primary admin-btn-sm" onClick={openCreate}>
          + Add Question
        </Button>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-3">No questions found. Add your first question or run the seed script.</p>
          <Button className="ustaad-btn-primary admin-btn-sm" onClick={openCreate}>Add Question</Button>
        </div>
      ) : (
        questions.map((q) => (
          <div key={q._id} className="ustaad-list-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div className="flex-grow-1">
                <span className={`admin-tag admin-tag-${q.type === "daily" ? "success" : q.type === "practice" ? "warning" : "info"} me-2`}>
                  {q.type}
                </span>
                {q.chapterId && (
                  <span className="admin-tag admin-tag-info me-2">{q.chapterId}</span>
                )}
                <h6 className="fw-bold mt-2 mb-1">{q.question}</h6>
                <div className="small text-muted">
                  {q.options.map((opt, i) => (
                    <span key={opt} className={i === q.answer ? "text-success fw-bold" : ""}>
                      {String.fromCharCode(65 + i)}. {opt}{i < q.options.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => openEdit(q)}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(q._id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Question" : "Add Question"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-2 mb-2">
            <div className="col-md-4">
              <Form.Label>Type</Form.Label>
              <Form.Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="assessment">Assessment</option>
                <option value="daily">Daily</option>
                <option value="practice">Practice</option>
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Form.Label>Subject</Form.Label>
              <Form.Control value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="col-md-4">
              <Form.Label>Chapter ID</Form.Label>
              <Form.Control
                value={form.chapterId}
                placeholder="e.g. trigonometry"
                onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
              />
            </div>
          </div>
          <Form.Group className="mb-2">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </Form.Group>
          <Form.Label>Options</Form.Label>
          {form.options.map((opt, i) => (
            <Form.Group key={i} className="mb-2">
              <div className="d-flex gap-2 align-items-center">
                <Form.Check
                  type="radio"
                  name="answer"
                  checked={form.answer === i}
                  onChange={() => setForm({ ...form, answer: i })}
                  label={`Option ${String.fromCharCode(65 + i)}`}
                />
                <Form.Control
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
              </div>
            </Form.Group>
          ))}
          <Form.Group>
            <Form.Label>Explanation (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button className="ustaad-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminQuestions;
