import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function OnboardingLayout({ children, step, totalSteps = 6 }) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="ustaad-page">
      <Container className="ustaad-page-centered">
        <div style={{ width: "100%", maxWidth: 480 }}>
          {step > 0 && (
            <>
              <div className="d-flex justify-content-between mb-2">
                <span className="ustaad-badge">Step {step} of {totalSteps}</span>
                <Link to="/" className="ustaad-link" style={{ fontSize: 14 }}>
                  Exit
                </Link>
              </div>
              <div className="ustaad-progress">
                <div className="ustaad-progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
          <div className="ustaad-card">{children}</div>
        </div>
      </Container>
    </div>
  );
}

export default OnboardingLayout;
