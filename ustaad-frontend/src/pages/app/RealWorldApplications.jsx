import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { formatChapterName } from "../../data/learningContent";

function RealWorldApplications() {
  const { chapterId } = useParams();
  const chapterName = formatChapterName(chapterId);

  return (
    <AppLayout
      title="Real World Applications"
      backTo={`/lesson/${chapterId}`}
      backLabel="Back to Lesson"
    >
      <div className="ustaad-card" style={{ maxWidth: 700 }}>
        <h4 className="fw-bold text-capitalize mb-2">{chapterName} in the Real World</h4>
        <p className="text-muted mb-4">
          Understanding where this topic is used helps you remember it better and connects learning to future careers.
        </p>

        <div className="ustaad-option">
          <strong>Why Learn This?</strong>
          <p className="mb-0 mt-1 text-muted small">
            Essential for engineering, architecture, and physics problem-solving.
          </p>
        </div>
        <div className="ustaad-option">
          <strong>Where Is It Used?</strong>
          <p className="mb-0 mt-1 text-muted small">
            GPS navigation, bridge construction, satellite orbits, game development.
          </p>
        </div>
        <div className="ustaad-option">
          <strong>Which Careers Use It?</strong>
          <p className="mb-0 mt-1 text-muted small">
            Engineer, Architect, Pilot, Data Scientist, Game Developer.
          </p>
        </div>

        <Button as={Link} to={`/practice/${chapterId}`} className="ustaad-btn-primary w-100 mt-3">
          START PRACTICE TEST
        </Button>
      </div>
    </AppLayout>
  );
}

export default RealWorldApplications;
