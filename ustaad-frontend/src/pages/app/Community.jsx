import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function Community() {
  const navigate = useNavigate();
  const { data: lounges = [], error, loading, retry } = useApiQuery(api.getCommunity);
  const [message, setMessage] = useState("");
  const [entering, setEntering] = useState(null);

  const enterLounge = async (loungeId, alreadyJoined) => {
    setEntering(loungeId);
    setMessage("");
    try {
      if (!alreadyJoined) {
        await api.joinStudyLounge(loungeId);
      }
      navigate(`/community/${loungeId}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setEntering(null);
    }
  };

  return (
    <AppLayout title="Study Lounges 👥" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Enter shared study forums to collaborate with CBSE classmates, chat in live topic rooms,
          and complete cooperative challenges together.
        </p>
      </div>

      {message && <Alert variant="danger">{message}</Alert>}
      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>{error}</span>
          <Button size="sm" variant="outline-danger" onClick={retry}>Retry</Button>
        </Alert>
      )}

      {loading ? (
        <p>Loading lounges...</p>
      ) : (
        <>
          <h6 className="fw-bold mb-3">{lounges.length} study lounges</h6>

          {lounges.map((lounge) => (
            <div key={lounge.id} className="ustaad-list-card">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="ustaad-badge mb-2 d-inline-block">{lounge.type}</span>
                  <h6 className="fw-bold mb-1">{lounge.icon} {lounge.name}</h6>
                  <small className="text-muted d-block">{lounge.topic}</small>
                  <small className="text-muted">{lounge.members} online · {lounge.activity}</small>
                </div>
                <button
                  className="ustaad-btn-primary btn"
                  style={{ height: 40, fontSize: 14, minWidth: 130 }}
                  disabled={entering === lounge.id}
                  onClick={() => enterLounge(lounge.id, lounge.joined)}
                >
                  {entering === lounge.id
                    ? "Entering..."
                    : lounge.joined
                      ? "INSIDE ✓"
                      : "ENTER SPACE"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="page-intro mt-2">
        <p className="mb-2"><strong>Inside each lounge:</strong></p>
        <ul className="chapter-tips-list mb-0">
          <li>Live chat with classmates (+5 XP per message)</li>
          <li>See who is studying with you right now</li>
          <li>Cooperative challenges linked to daily quests</li>
        </ul>
      </div>
    </AppLayout>
  );
}

export default Community;
