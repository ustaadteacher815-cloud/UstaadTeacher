import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function ParentNotifications() {
  const { data, loading } = useApiQuery(api.parentNotifications);

  return (
    <ParentLayout title="Alerts">
      <div className="page-intro">
        <p>Important updates about your children&apos;s learning — streaks, inactivity, and milestones.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data?.notifications?.length === 0 ? (
        <div className="ustaad-card text-center">
          <p className="text-muted mb-0">No alerts right now. All good!</p>
        </div>
      ) : (
        data.notifications.map((note) => (
          <div key={note.id} className={`parent-alert-item ${note.type || ""}`}>
            <p className="mb-1 fw-semibold">{note.childName || "Ustaad"}</p>
            <p className="mb-0 text-muted">{note.message}</p>
            {note.childId && (
              <Link to={`/parent/child/${note.childId}`} className="ustaad-link small d-inline-block mt-2">
                View report →
              </Link>
            )}
            {note.id === "no-children" && (
              <Link to="/parent/link" className="ustaad-link small d-inline-block mt-2">
                Link child →
              </Link>
            )}
          </div>
        ))
      )}
    </ParentLayout>
  );
}

export default ParentNotifications;
