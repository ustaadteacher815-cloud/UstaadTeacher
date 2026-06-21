import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentChildCommunity() {
  const { studentId } = useParams();
  const fetcher = useCallback(() => api.parentChildCommunity(studentId), [studentId]);
  const { data, error, loading, retry } = useApiQuery(fetcher);

  if (loading) {
    return <ParentLayout title="Study Lounges"><p>Loading...</p></ParentLayout>;
  }

  if (error) {
    return (
      <ParentLayout title="Study Lounges">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout title={`${data.studentName}'s Study Lounges`}>
      <Link to={`/parent/child/${studentId}`} className="page-back-btn">← Back to Report</Link>

      <div className="page-intro mb-4">
        <p>Study lounges your child has joined — group study rooms, subject battles, and team challenges.</p>
      </div>

      {data.joinedLounges.length === 0 ? (
        <div className="ustaad-card text-center">
          <div style={{ fontSize: "2.5rem" }}>👥</div>
          <p className="text-muted mb-0 mt-2">Your child hasn&apos;t joined any study lounges yet.</p>
        </div>
      ) : (
        data.joinedLounges.map((lounge) => (
          <div key={lounge.id} className="ustaad-list-card mb-3">
            <div className="d-flex align-items-start gap-3">
              <span style={{ fontSize: "2rem" }}>{lounge.icon}</span>
              <div>
                <span className="admin-tag admin-tag-info mb-2 d-inline-block">{lounge.type}</span>
                <h6 className="fw-bold mb-1">{lounge.name}</h6>
                <p className="text-muted small mb-1">{lounge.topic}</p>
                <p className="small mb-0">{lounge.activity}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </ParentLayout>
  );
}

export default ParentChildCommunity;
