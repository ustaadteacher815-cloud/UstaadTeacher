import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminTheoryLab() {
  const { data, error, loading, retry } = useApiQuery(api.adminTheoryLabOverview);
  const [openGrade, setOpenGrade] = useState("11");

  if (loading) {
    return <AdminLayout title="Theory Lab"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Theory Lab">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  const activeGrade = data.grades.find((g) => g.grade === openGrade) || data.grades[0];

  return (
    <AdminLayout title="Theory Lab">
      <div className="page-intro mb-4">
        <p>
          Syllabus chapters available to students in Theory Lab and Chapter Quests — same content as the student app.
        </p>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalSubjects}</div>
          <div className="admin-stat-label">Subjects</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalChapters}</div>
          <div className="admin-stat-label">Chapters</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.practiceQuestions}</div>
          <div className="admin-stat-label">Practice Questions</div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {data.grades.map((grade) => (
          <Button
            key={grade.grade}
            variant={openGrade === grade.grade ? "success" : "outline-secondary"}
            className="admin-btn-sm"
            onClick={() => setOpenGrade(grade.grade)}
          >
            {grade.gradeLabel}
          </Button>
        ))}
        <Button as={Link} to="/admin/questions" className="ustaad-btn-outline admin-btn-sm ms-auto">
          Manage Practice Questions
        </Button>
      </div>

      {activeGrade?.subjects.map((subject) => (
        <div key={subject.id} className="ustaad-card mb-3">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <h5 className="fw-bold mb-0">
              {subject.icon} {subject.name}
            </h5>
            <span className="admin-tag admin-tag-info">
              {subject.chapterCount} chapters · {subject.lessonCount} lessons
            </span>
          </div>
          <div className="row g-2">
            {subject.chapters.map((chapter) => (
              <div key={chapter.id} className="col-md-6 col-lg-4">
                <div className="ustaad-option mb-0">
                  <strong>Ch {chapter.chapterNo}: {chapter.name}</strong>
                  <div className="small text-muted">{chapter.lessons} micro-lessons</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}

export default AdminTheoryLab;
