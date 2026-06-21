import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

function ParentSettings() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.parentUpdateProfile(name);
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ParentLayout title="Settings">
      <div className="page-intro">
        <p>Manage your parent account details.</p>
      </div>

      <div className="ustaad-card" style={{ maxWidth: 480 }}>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={user?.phone || ""} disabled />
            <Form.Text className="text-muted">Phone number cannot be changed here.</Form.Text>
          </Form.Group>
          <Button type="submit" className="ustaad-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </div>
    </ParentLayout>
  );
}

export default ParentSettings;
