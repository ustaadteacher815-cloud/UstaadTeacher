import { Link, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import ChapterAiTutor from "../../components/ChapterAiTutor";
import LessonVideoPlayer from "../../components/LessonVideoPlayer";
import ChapterStudyExtras from "../../components/ChapterStudyExtras";
import { formatChapterName, getSubjectForChapter } from "../../data/learningContent";

function MicroLearning() {
  const { chapterId } = useParams();
  const subject = getSubjectForChapter(chapterId);
  const chapterName = formatChapterName(chapterId);

  return (
    <AppLayout
      title="Micro Learning Session"
      backTo={`/chapter/${subject}`}
      backLabel={`Back to ${subject}`}
    >
      <div className="ustaad-card" style={{ maxWidth: 720 }}>
        <span className="ustaad-badge mb-3 d-inline-block">3–10 Minutes</span>
        <h4 className="fw-bold">{chapterName}</h4>
        <p className="text-muted">
          Watch, read, and learn the key ideas in this chapter before moving to real-world applications and practice.
        </p>

        <LessonVideoPlayer chapterName={chapterName} />

        <h6 className="fw-bold mt-3">Lesson: Introduction to Key Concepts</h6>
        <p className="text-muted">
          Press play to start an AI-narrated lesson for this chapter.
        </p>

        <div className="ustaad-option ustaad-option-static">📹 AI video lesson — use the player above</div>

        <ChapterStudyExtras chapterName={chapterName} />

        <ChapterAiTutor chapterName={chapterName} />

        <Button as={Link} to={`/real-world/${chapterId}`} className="ustaad-btn-primary w-100 mt-3">
          NEXT: REAL WORLD APPLICATIONS
        </Button>
      </div>
    </AppLayout>
  );
}

export default MicroLearning;
