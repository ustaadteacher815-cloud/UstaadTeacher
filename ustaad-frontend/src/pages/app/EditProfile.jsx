import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import SelectableOption from "../../components/SelectableOption";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
const goals = [
  "Score higher in board exams",
  "Prepare for competitive exams",
  "Build strong fundamentals",
  "Explore career options",
];

function EditProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    grade: "",
    board: "CBSE",
    subjects: [],
    goals: [],
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      grade: user.grade || "",
      board: user.board || "CBSE",
      subjects: user.subjects || [],
      goals: user.goals || [],
    });
  }, [user]);

  const toggleItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.updateProfile(form);
      await refreshUser();
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Edit Profile" backTo="/dashboard" backLabel="Back to Home">
      <div className="ustaad-card" style={{ maxWidth: 560 }}>
        <p className="text-muted mb-4">
          Update your name, class, board, subjects, and learning goals.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Grade</Form.Label>
            <Form.Select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              required
            >
              <option value="">Select grade</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Board</Form.Label>
            <Form.Select
              value={form.board}
              onChange={(e) => setForm({ ...form, board: e.target.value })}
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </Form.Select>
          </Form.Group>

          <Form.Label>Preferred Subjects</Form.Label>
          <div className="mb-3">
            {subjects.map((s) => (
              <SelectableOption
                key={s}
                selected={form.subjects.includes(s)}
                onSelect={() => toggleItem("subjects", s)}
              >
                {s}
              </SelectableOption>
            ))}
          </div>

          <Form.Label>Learning Goals</Form.Label>
          <div className="mb-4">
            {goals.map((g) => (
              <SelectableOption
                key={g}
                selected={form.goals.includes(g)}
                onSelect={() => toggleItem("goals", g)}
              >
                {g}
              </SelectableOption>
            ))}
          </div>

          <Button type="submit" className="ustaad-btn-primary w-100" disabled={loading}>
            {loading ? "SAVING..." : "SAVE PROFILE"}
          </Button>
        </Form>
      </div>
    </AppLayout>
  );
}

export default EditProfile;
