import { Link } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";
import { useAuth } from "../../hooks/useAuth";

function CareerExplorer() {
  const { user } = useAuth();
  const { data: careers, error, loading, retry } = useApiQuery(api.getCareers);

  if (loading) {
    return (
      <AppLayout title="Career Explorer 🎯" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading careers...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Career Explorer 🎯" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  const topMatch = careers?.[0];

  return (
    <AppLayout title="Career Explorer 🎯" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro mb-4">
        <p className="mb-2">
          Careers ranked by how well they match your subjects, progress, and assessment results.
        </p>
        {user?.subjects?.length > 0 && (
          <p className="text-muted small mb-0">
            Based on your interests: {user.subjects.join(", ")}
            {user.grade ? ` · Class ${user.grade}` : ""}
          </p>
        )}
      </div>

      {topMatch?.recommended && (
        <div className="ustaad-card mb-4 border-success">
          <h6 className="fw-bold text-success mb-1">⭐ Best match for you</h6>
          <p className="mb-0">
            {topMatch.icon} <strong>{topMatch.name}</strong> — {topMatch.matchScore}% match
          </p>
        </div>
      )}

      <Row className="g-3">
        {careers.map((career) => (
          <Col md={4} key={career.id}>
            <Link to={`/career/${career.id}`} className="ustaad-feature-card grid-card h-100 text-center text-decoration-none">
              <div className="ustaad-feature-icon">{career.icon}</div>
              <h6 className="fw-bold mb-1">{career.name}</h6>
              <span className="ustaad-badge mb-2 d-inline-block">{career.matchScore}% match</span>
              {career.recommended && (
                <div className="small text-success fw-semibold">Recommended</div>
              )}
              <p className="text-muted small mb-0 mt-2">{career.description}</p>
            </Link>
          </Col>
        ))}
      </Row>
    </AppLayout>
  );
}

export default CareerExplorer;
