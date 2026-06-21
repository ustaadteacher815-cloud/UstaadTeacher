import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";

const emptyForm = {
  question: "",
  options: ["", "", "", ""],
  answer: 0,
  explanation: "",
  paperYear: new Date().getFullYear().toString(),
};

function AdminBoardFaq() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [syllabus, setSyllabus] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const selectedGrade = searchParams.get("grade") || "11";
  const selectedSubjectId = searchParams.get("subject") || "";
  const selectedChapterId = searchParams.get("chapter") || "";

  useEffect(() => {
    let cancelled = false;
    setLoadingSyllabus(true);
    api.adminTheoryLabOverview()
      .then((data) => { if (!cancelled) setSyllabus(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoadingSyllabus(false); });
    return () => { cancelled = true; };
  }, []);

  const gradeData = useMemo(
    () => syllabus?.grades?.find((g) => g.grade === selectedGrade),
    [syllabus, selectedGrade]
  );

  const subjectData = useMemo(
    () => gradeData?.subjects?.find((s) => s.id === selectedSubjectId),
    [gradeData, selectedSubjectId]
  );

  const chapterData = useMemo(
    () => subjectData?.chapters?.find((c) => c.id === selectedChapterId),
    [subjectData, selectedChapterId]
  );

  const loadQuestions = useCallback(async () => {
    if (!selectedChapterId) {
      setQuestions([]);
      return;
    }
    setLoadingQuestions(true);
    setError("");
    try {
      const result = await api.adminGetQuestions({
        type: "board-faq",
        chapterId: selectedChapterId,
      });
      setQuestions(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  }, [selectedChapterId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);

    if (key === "grade") {
      next.delete("subject");
      next.delete("chapter");
    }
    if (key === "subject") {
      next.delete("chapter");
    }

    setSearchParams(next);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditingId(q._id);
    setForm({
      question: q.question,
      options: [...q.options, "", "", ""].slice(0, 4),
      answer: q.answer,
      explanation: q.explanation || "",
      paperYear: q.paperYear || new Date().getFullYear().toString(),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedChapterId || !selectedSubjectId) return;
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        type: "board-faq",
        subject: selectedSubjectId,
        chapterId: selectedChapterId,
        question: form.question.trim(),
        options: form.options.filter((o) => o.trim()),
        answer: Number(form.answer),
        explanation: form.explanation.trim(),
        paperYear: form.paperYear.trim() || new Date().getFullYear().toString(),
      };

      if (!payload.question || payload.options.length < 2) {
        throw new Error("Question and at least 2 options are required.");
      }
      if (!payload.explanation) {
        throw new Error("Step-by-step solution is required for Board FAQ.");
      }

      if (editingId) {
        await api.adminUpdateQuestion(editingId, payload);
        setMessage("Board FAQ updated — students will see it in Board FAQ.");
      } else {
        await api.adminCreateQuestion(payload);
        setMessage("Board FAQ added — students will see it in Board FAQ.");
      }
      setModalOpen(false);
      loadQuestions();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board FAQ paper?")) return;
    try {
      await api.adminDeleteQuestion(id);
      setMessage("Board FAQ deleted.");
      loadQuestions();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateOption = (index, value) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  if (loadingSyllabus) {
    return (
      <AdminLayout title="Board FAQ">
        <p>Loading syllabus...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Board FAQ">
      <div className="page-intro mb-4">
        <p>
          Add solved board exam papers chapter-wise. Students see these in{" "}
          <strong>Board FAQ</strong> with step-by-step solutions, filtered by their grade and subject.
        </p>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="ustaad-card mb-4">
        <h5 className="fw-bold mb-3">1. Select Subject & Chapter</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <Form.Label>Class</Form.Label>
            <Form.Select
              value={selectedGrade}
              onChange={(e) => updateParam("grade", e.target.value)}
            >
              {(syllabus?.grades || []).map((g) => (
                <option key={g.grade} value={g.grade}>{g.gradeLabel}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Subject</Form.Label>
            <Form.Select
              value={selectedSubjectId}
              onChange={(e) => updateParam("subject", e.target.value)}
            >
              <option value="">Choose subject...</option>
              {(gradeData?.subjects || []).map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-5">
            <Form.Label>Chapter</Form.Label>
            <Form.Select
              value={selectedChapterId}
              onChange={(e) => updateParam("chapter", e.target.value)}
              disabled={!selectedSubjectId}
            >
              <option value="">Choose chapter...</option>
              {(subjectData?.chapters || []).map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.chapterNo}: {ch.name}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </div>

      {!selectedChapterId ? (
        <div className="ustaad-card text-center">
          <div style={{ fontSize: "2.5rem" }}>📋</div>
          <p className="text-muted mb-0 mt-2">Select a subject and chapter to manage board FAQ papers.</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="fw-bold mb-1">
                {subjectData?.icon} {subjectData?.name} · Ch {chapterData?.chapterNo}: {chapterData?.name}
              </h5>
              <small className="text-muted">
                {questions.length} paper{questions.length === 1 ? "" : "s"} added by admin
              </small>
            </div>
            <Button className="ustaad-btn-primary admin-btn-sm" onClick={openCreate}>
              + Add Board Paper
            </Button>
          </div>

          {loadingQuestions ? (
            <p>Loading papers...</p>
          ) : questions.length === 0 ? (
            <div className="ustaad-card text-center">
              <p className="text-muted mb-3">
                No admin board papers for this chapter yet. Built-in archive papers may still appear for students.
              </p>
              <Button className="ustaad-btn-primary admin-btn-sm" onClick={openCreate}>
                Add First Board Paper
              </Button>
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q._id} className="ustaad-list-card mb-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div className="flex-grow-1">
                    <span className="admin-tag admin-tag-info me-2">Paper {index + 1}</span>
                    <span className="admin-tag admin-tag-success">CBSE {q.paperYear || "2024"}</span>
                    <h6 className="fw-bold mt-2 mb-1">{q.question}</h6>
                    <div className="small text-muted mb-1">
                      {q.options.map((opt, i) => (
                        <span key={opt} className={i === q.answer ? "text-success fw-bold" : ""}>
                          {String.fromCharCode(65 + i)}. {opt}{i < q.options.length - 1 ? " · " : ""}
                        </span>
                      ))}
                    </div>
                    {q.explanation && (
                      <small className="text-muted d-block">Solution: {q.explanation}</small>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => openEdit(q)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(q._id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Board Paper" : "Add Board Paper"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chapterData && (
            <Alert variant="light" className="small mb-3">
              This paper will appear in student <strong>Board FAQ</strong> under{" "}
              <strong>{subjectData?.name} → Ch {chapterData.chapterNo}: {chapterData.name}</strong>
            </Alert>
          )}
          <Form.Group className="mb-2">
            <Form.Label>Board exam year</Form.Label>
            <Form.Control
              value={form.paperYear}
              onChange={(e) => setForm({ ...form, paperYear: e.target.value })}
              placeholder="e.g. 2024"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </Form.Group>
          <Form.Label>Options (select correct answer)</Form.Label>
          {form.options.map((opt, i) => (
            <Form.Group key={i} className="mb-2">
              <div className="d-flex gap-2 align-items-center">
                <Form.Check
                  type="radio"
                  name="answer"
                  checked={form.answer === i}
                  onChange={() => setForm({ ...form, answer: i })}
                  label={String.fromCharCode(65 + i)}
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
            <Form.Label>Step-by-step solution (one step per line)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              placeholder={"Step 1: Identify the formula.\nStep 2: Substitute values.\nStep 3: Simplify to get the answer."}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button className="ustaad-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Board Paper"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminBoardFaq;
