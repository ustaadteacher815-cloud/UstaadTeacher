import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../../components/BrandLogo";

function ParentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.sendOtp(phone);
      if (data.devOtp) setDevOtp(data.devOtp);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.verifyOtp(phone, otp, "login");
      if (data.user?.role !== "parent") {
        setError("This is not a parent account. Create one or use student login.");
        return;
      }
      await loginWithToken(data.token, data.user);
      navigate(location.state?.from || "/parent");
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
            <h1 className="ustaad-title mt-3" style={{ fontSize: "1.6rem" }}>Parent Sign In</h1>
            <p className="ustaad-subtitle mb-0">Track your child&apos;s learning progress</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {devOtp && <Alert variant="info">Dev OTP: <strong>{devOtp}</strong></Alert>}

          {step === "phone" ? (
            <Form onSubmit={handleSendOtp}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </Form.Group>
              <Button type="submit" className="ustaad-btn-primary w-100" disabled={loading}>
                {loading ? "SENDING..." : "SEND OTP"}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleVerifyOtp}>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
              </Form.Group>
              <Button type="submit" className="ustaad-btn-primary w-100 mb-2" disabled={loading}>
                {loading ? "VERIFYING..." : "SIGN IN"}
              </Button>
              <Button variant="link" className="w-100" onClick={() => setStep("phone")}>Change number</Button>
            </Form>
          )}

          <p className="text-center mt-4 mb-0 small text-muted">
            <Link to="/parent/signup" className="ustaad-link">Create parent account</Link>
            {" · "}
            <Link to="/login" className="ustaad-link">Student login</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default ParentLogin;
