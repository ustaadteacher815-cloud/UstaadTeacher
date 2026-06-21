import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import OnboardingLayout from "../../components/layouts/OnboardingLayout";
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

function CreateProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    grade: user?.grade || "",
    board: user?.board || "CBSE",
    subjects: user?.subjects || [],
    goals: user?.goals || [],
  });

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
    setLoading(true);
    try {
      await api.updateProfile(form);
      await refreshUser();
      navigate("/assessment");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout step={2}>
      <h1 className="ustaad-title">Create Your Profile</h1>
      <p className="ustaad-subtitle">Help us personalize your learning experience</p>
      {error && <Alert variant="danger">{error}</Alert>}

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
          {loading ? "SAVING..." : "CONTINUE"}
        </Button>
      </Form>
    </OnboardingLayout>
  );
}

export default CreateProfile;
