import { Row, Col, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function chapterQuestionsLink(subject) {
  const grade = String(subject.grade || "").includes("12") ? "12" : "11";
  return `/admin/chapter-questions?grade=${grade}&subject=${subject.id}`;
}

function AdminContent() {
  const { data, error, loading, retry } = useApiQuery(api.adminContentOverview);

  if (loading) {
    return (
      <AdminLayout title="Chapter Quests">
        <p>Loading content...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Chapter Quests">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chapter Quests">
      <div className="page-intro d-flex justify-content-between align-items-start flex-wrap gap-2">
        <p className="mb-0">
          Syllabus subjects and chapters for Chapter Quests — aligned with the student learning path.
          Use <strong>Chapter Questions</strong> to add practice questions students see after picking a chapter.
        </p>
        <Button as={Link} to="/admin/chapter-questions" className="ustaad-btn-primary admin-btn-sm">
          ✏️ Manage Chapter Questions
        </Button>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.subjects.length}</div>
          <div className="admin-stat-label">Subjects</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.totalChapters}</div>
          <div className="admin-stat-label">Chapters</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.boardFaqPapers}</div>
          <div className="admin-stat-label">Board FAQ Papers</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{data.studyLounges?.length || 0}</div>
          <div className="admin-stat-label">Study Lounges</div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <div className="ustaad-card h-100">
            <h5 className="fw-bold mb-3">📚 Subjects & Chapters</h5>
            {data.subjects.map((subject) => (
              <div key={subject.id} className="ustaad-option mb-2">
                <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                  <div>
                    <strong>{subject.name}</strong>
                    <div className="small text-muted">
                      {subject.grade || "—"} · {subject.chapters} chapters
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to={chapterQuestionsLink(subject)}
                    size="sm"
                    variant="outline-success"
                    className="admin-btn-sm"
                  >
                    Questions →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col lg={6}>
          <div className="ustaad-card h-100 mb-4">
            <h5 className="fw-bold mb-3">🎁 Rewards Catalog</h5>
            {data.rewards.map((reward) => (
              <div key={reward.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                <span>{reward.name}</span>
                <span className="admin-tag admin-tag-warning">{reward.cost} coins</span>
              </div>
            ))}
            <Button as={Link} to="/admin/rewards" className="ustaad-btn-outline admin-btn-sm mt-2">
              View redemption stats →
            </Button>
          </div>
          <div className="ustaad-card h-100">
            <h5 className="fw-bold mb-3">👥 Study Lounges</h5>
            {(data.studyLounges || []).map((lounge) => (
              <div key={lounge.id} className="ustaad-option mb-2">
                <span className="admin-tag admin-tag-info me-2">{lounge.type}</span>
                {lounge.name}
              </div>
            ))}
            <Button as={Link} to="/admin/community" className="ustaad-btn-outline admin-btn-sm mt-2">
              Manage lounges →
            </Button>
          </div>
        </Col>
      </Row>

      <div className="ustaad-card mt-4">
        <h5 className="fw-bold mb-2">Quick Actions</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/admin/chapter-questions" className="ustaad-btn-primary admin-btn-sm">Chapter Questions</Button>
          <Button as={Link} to="/admin/theory-lab" className="ustaad-btn-outline admin-btn-sm">Theory Lab</Button>
          <Button as={Link} to="/admin/board-faq" className="ustaad-btn-outline admin-btn-sm">Board FAQ</Button>
          <Button as={Link} to="/admin/questions" className="ustaad-btn-outline admin-btn-sm">Question Bank</Button>
          <Button as={Link} to="/admin/users" className="ustaad-btn-outline admin-btn-sm">View Users</Button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminContent;
