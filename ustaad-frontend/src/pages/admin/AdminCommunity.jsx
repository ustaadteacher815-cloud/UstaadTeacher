import { useCallback, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function AdminCommunity() {
  const { data, error, loading, retry } = useApiQuery(api.adminCommunityOverview);
  const [selectedLounge, setSelectedLounge] = useState(null);
  const [messages, setMessages] = useState(null);
  const [msgLoading, setMsgLoading] = useState(false);

  const loadMessages = useCallback(async (loungeId) => {
    setMsgLoading(true);
    setSelectedLounge(loungeId);
    try {
      const result = await api.adminGetCommunityMessages(loungeId);
      setMessages(result);
    } catch {
      setMessages(null);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  if (loading) {
    return <AdminLayout title="Study Lounges"><p>Loading...</p></AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout title="Study Lounges">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Study Lounges">
      <div className="page-intro mb-4">
        <p>Monitor study lounge membership and recent chat activity across the platform.</p>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="admin-stat-card" style={{ minWidth: 180 }}>
          <div className="admin-stat-value">{data.totalMemberships}</div>
          <div className="admin-stat-label">Total Memberships</div>
        </div>
        <div className="admin-stat-card" style={{ minWidth: 180 }}>
          <div className="admin-stat-value">{data.totalMessages}</div>
          <div className="admin-stat-label">Chat Messages</div>
        </div>
      </div>

      {data.lounges.map((lounge) => (
        <div key={lounge.id} className="ustaad-list-card mb-3">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <span className="admin-tag admin-tag-info mb-2 d-inline-block">{lounge.type}</span>
              <h6 className="fw-bold mb-1">{lounge.icon} {lounge.name}</h6>
              <small className="text-muted d-block">{lounge.topic}</small>
              {lounge.members.length > 0 && (
                <p className="small text-muted mb-0 mt-1">Members: {lounge.members.join(", ")}</p>
              )}
            </div>
            <div className="text-end">
              <span className="admin-tag admin-tag-success d-block mb-1">{lounge.memberCount} members</span>
              <span className="admin-tag admin-tag-warning">{lounge.messageCount} messages</span>
              <Button
                size="sm"
                variant="outline-primary"
                className="mt-2 d-block ms-auto"
                onClick={() => loadMessages(lounge.id)}
              >
                View Messages
              </Button>
            </div>
          </div>
        </div>
      ))}

      {selectedLounge && (
        <div className="ustaad-card mt-4">
          <h6 className="fw-bold mb-3">
            Recent Messages — {messages?.lounge?.name || selectedLounge}
          </h6>
          {msgLoading ? (
            <p>Loading messages...</p>
          ) : !messages?.messages?.length ? (
            <p className="text-muted mb-0">No messages in this lounge yet.</p>
          ) : (
            messages.messages.map((msg) => (
              <div key={msg._id} className="border-bottom py-2">
                <strong>{msg.userName}</strong>
                <small className="text-muted ms-2">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                </small>
                <p className="mb-0 small">{msg.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminCommunity;
