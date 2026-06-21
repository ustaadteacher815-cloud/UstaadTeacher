import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../../components/BrandLogo";

function ParentSignup() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.sendOtp(form.phone);
      if (data.devOtp) setDevOtp(data.devOtp);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.parentSignup(form.phone, otp, form.name);
      await loginWithToken(data.token, data.user);
      navigate("/parent/link");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ustaad-page ustaad-page-centered" style={{ background: "linear-gradient(135deg, #1cb0f6, #0d8ecf)" }}>
      <Container style={{ maxWidth: 440 }}>
        <div className="ustaad-card">
          <div className="text-center mb-4">
            <BrandLogo />
            <span className="ustaad-badge mt-2 d-inline-block" style={{ background: "#e3f5fd", color: "#1cb0f6" }}>
              Parent Portal
            </span>
            <h1 className="ustaad-title mt-3" style={{ fontSize: "1.6rem" }}>Create Parent Account</h1>
            <p className="ustaad-subtitle mb-0">Stay connected to your child&apos;s learning journey</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {devOtp && <Alert variant="info">Dev OTP: <strong>{devOtp}</strong></Alert>}

          {step === "details" ? (
            <Form onSubmit={handleSendOtp}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control type="text" placeholder="Parent name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Use a different number than your child" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </Form.Group>
              <Button type="submit" className="ustaad-btn-primary w-100" disabled={loading}>
                {loading ? "SENDING..." : "SEND OTP"}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
              </Form.Group>
              <Button type="submit" className="ustaad-btn-primary w-100 mb-2" disabled={loading}>
                {loading ? "CREATING..." : "CREATE ACCOUNT"}
              </Button>
              <Button variant="link" className="w-100" onClick={() => setStep("details")}>Back</Button>
            </Form>
          )}

          <p className="text-center mt-4 mb-0 small text-muted">
            Already registered? <Link to="/parent/login" className="ustaad-link">Sign in</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default ParentSignup;
