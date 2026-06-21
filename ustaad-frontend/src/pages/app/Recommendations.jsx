import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function Recommendations() {
  const { data: recommendations = [], error, loading, retry } = useApiQuery(api.getRecommendations);

  return (
    <AppLayout title="AI Learning Recommendations ✨" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Personalized suggestions based on your assessment scores, practice tests, and learning goals.
          Tap any recommendation to start studying that topic.
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <Button size="sm" variant="outline-danger" onClick={retry}>Retry</Button>
        </Alert>
      )}

      {loading ? (
        <p>Loading recommendations...</p>
      ) : (
        recommendations.map((r) => (
          <Link key={r.topic} to="/learning-path" className="ustaad-list-card d-block">
            <span className="ustaad-badge mb-2 d-inline-block">{r.type}</span>
            <h6 className="fw-bold mb-1">{r.topic}</h6>
            <small className="text-muted">{r.reason}</small>
          </Link>
        ))
      )}
    </AppLayout>
  );
}

export default Recommendations;
