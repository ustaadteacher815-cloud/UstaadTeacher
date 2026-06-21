import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import OnboardingLayout from "../../components/layouts/OnboardingLayout";

function Welcome() {
  return (
    <OnboardingLayout step={0}>
      <div className="text-center">
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎓</div>
        <h1 className="ustaad-title">Your Personal AI Teacher</h1>
        <p className="ustaad-subtitle">
          Learn smarter with AI-powered lessons, daily challenges, and a path
          built just for you.
        </p>
        <Button as={Link} to="/signup" className="ustaad-btn-primary w-100 mb-3">
          GET STARTED
        </Button>
        <Button as={Link} to="/login" className="ustaad-btn-secondary w-100">
          I ALREADY HAVE AN ACCOUNT
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default Welcome;
