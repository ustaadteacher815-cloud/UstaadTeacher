import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function SkillDevelopment() {
  const { data: tracks, error, loading, retry } = useApiQuery(api.getSkills);

  if (loading) {
    return (
      <AppLayout title="Skill Development 💡" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading skill tracks...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Skill Development 💡" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  const recommended = tracks.filter((track) => track.recommended);

  return (
    <AppLayout title="Skill Development 💡" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Go beyond textbooks with career-ready skills. Progress is based on your learning activity,
          subject mastery, and completed skill lessons.
        </p>
      </div>

      {recommended.length > 0 && (
        <div className="ustaad-card mb-4 border-success">
          <h6 className="fw-bold text-success mb-1">⭐ Recommended for your career path</h6>
          <p className="mb-0 small">
            {recommended.map((track) => track.name).join(", ")} — aligned with your top career matches
          </p>
        </div>
      )}

      <h6 className="fw-bold mb-3">{tracks.length} skill tracks</h6>

      {tracks.map((track) => (
        <div key={track.id} className="ustaad-list-card">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{track.icon}</span>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <h6 className="fw-bold mb-0">{track.name}</h6>
                {track.recommended && (
                  <span className="ustaad-badge text-success" style={{ fontSize: "0.7rem" }}>
                    Recommended
                  </span>
                )}
              </div>
              <small className="text-muted d-block mb-2">{track.description}</small>
              <small className="text-muted">
                {track.completedLessons}/{track.lessons} lessons
              </small>
              <div className="ustaad-progress mt-2 mb-0">
                <div className="ustaad-progress-bar" style={{ width: `${track.progress}%` }} />
              </div>
            </div>
            <span className="ustaad-badge">{track.progress}%</span>
          </div>
        </div>
      ))}

      <div className="page-intro mt-2">
        <p>
          Tip: Tracks linked to your career roadmap are listed first. Complete lessons on the Learning Path
          to grow subject-linked skills, or finish 100% of a track to unlock a certificate.
        </p>
      </div>
    </AppLayout>
  );
}

export default SkillDevelopment;
