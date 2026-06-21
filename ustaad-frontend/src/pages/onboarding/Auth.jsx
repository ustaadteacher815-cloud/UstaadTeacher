import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import OnboardingLayout from "../../components/layouts/OnboardingLayout";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { getOnboardingPath } from "../../utils/onboarding";

function Auth({ mode = "signup" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();
  const [authMode, setAuthMode] = useState(mode);
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAfterAuth = async (token, user) => {
    await loginWithToken(token, user);
    const returnTo = location.state?.from;
    const onboardingPath = getOnboardingPath(user);

    if (onboardingPath) {
      navigate(onboardingPath);
    } else {
      navigate(returnTo || "/dashboard");
    }
  };

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
      const data = await api.verifyOtp(phone, otp, authMode);
      await handleAfterAuth(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setLoading(true);
    try {
      const data = await api.socialLogin(provider);
      await handleAfterAuth(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout step={1}>
      <div className="text-center mb-3">
        <div className="btn-group w-100 mb-4">
          <Button
            variant={authMode === "signup" ? "success" : "outline-secondary"}
            onClick={() => setAuthMode("signup")}
            style={{ fontWeight: 700 }}
          >
            Sign Up
          </Button>
          <Button
            variant={authMode === "login" ? "success" : "outline-secondary"}
            onClick={() => setAuthMode("login")}
            style={{ fontWeight: 700 }}
          >
            Log In
          </Button>
        </div>
        <h1 className="ustaad-title">
          {authMode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="ustaad-subtitle">
          {authMode === "signup"
            ? "Start your learning journey with Ustaad"
            : "Continue where you left off"}
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {devOtp && step === "otp" && (
        <Alert variant="success" className="text-center mb-3">
          <div className="fw-bold">Your OTP</div>
          <div style={{ fontSize: "1.75rem", letterSpacing: "0.35em" }}>{devOtp}</div>
          <small className="text-muted">Enter this code below to continue</small>
        </Alert>
      )}

      {step === "phone" ? (
        <Form onSubmit={handleSendOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="ustaad-btn-primary w-100" disabled={loading}>
            {loading ? "SENDING..." : "SEND OTP"}
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </Form.Group>
          <Button type="submit" className="ustaad-btn-primary w-100 mb-2" disabled={loading}>
            {loading ? "VERIFYING..." : "VERIFY & CONTINUE"}
          </Button>
          <Button variant="link" className="w-100" onClick={() => { setStep("phone"); setDevOtp(""); setOtp(""); }}>
            Change number
          </Button>
        </Form>
      )}

      <div className="text-center my-3 text-muted">or continue with</div>

      <Button
        className="ustaad-btn-outline w-100 mb-2"
        onClick={() => handleSocialLogin("google")}
        disabled={loading}
      >
        🔵 Continue with Google
      </Button>
      <Button
        className="ustaad-btn-outline w-100"
        onClick={() => handleSocialLogin("apple")}
        disabled={loading}
      >
        🍎 Continue with Apple
      </Button>

      <p className="text-center mt-4 mb-0" style={{ color: "#777" }}>
        {authMode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link to="/login" className="ustaad-link">Log in</Link>
          </>
        ) : (
          <>
            New to Ustaad?{" "}
            <Link to="/signup" className="ustaad-link">Sign up</Link>
          </>
        )}
      </p>
    </OnboardingLayout>
  );
}

export default Auth;
