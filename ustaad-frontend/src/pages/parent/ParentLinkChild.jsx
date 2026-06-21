import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

function ParentLinkChild() {
  const { refreshUser } = useAuth();
  const [studentPhone, setStudentPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLink = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await api.parentLinkChild(studentPhone);
      await refreshUser();
      setMessage(`${data.child.name} linked successfully!`);
      setStudentPhone("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentLayout title="Link Your Child">
      <div className="page-intro">
        <p>
          Enter the phone number your child used to sign up on Ustaad.
          You&apos;ll instantly see their progress on your dashboard.
        </p>
      </div>

      <div className="ustaad-card" style={{ maxWidth: 520 }}>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLink}>
          <Form.Group className="mb-3">
            <Form.Label>Child&apos;s Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Student signup phone"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="ustaad-btn-primary w-100 mb-2" disabled={loading}>
            {loading ? "LINKING..." : "LINK CHILD"}
          </Button>
        </Form>

        <Button as={Link} to="/parent" className="ustaad-btn-secondary w-100">
          Back to Dashboard
        </Button>
      </div>

      <div className="ustaad-card mt-4">
        <h6 className="fw-bold mb-2">How it works</h6>
        <ul className="chapter-tips-list mb-0">
          <li>Your child must have a Ustaad student account first</li>
          <li>Use the same phone number they registered with</li>
          <li>You can link multiple children from different accounts</li>
          <li>Unlink anytime from the child&apos;s report page</li>
        </ul>
      </div>
    </ParentLayout>
  );
}

export default ParentLinkChild;
