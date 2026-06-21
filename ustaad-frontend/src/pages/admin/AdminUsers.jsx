import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";

function AdminUsers() {
  const [data, setData] = useState({ users: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredUsers = data.users.filter((user) => {
    if (roleFilter === "student") return user.role !== "parent";
    if (roleFilter === "parent") return user.role === "parent";
    return true;
  });

  useEffect(() => {
    let cancelled = false;

    api.adminGetUsers({ search: query, page, limit: 15 })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, page, refreshKey]);

  const handleSearch = () => {
    setLoading(true);
    setError("");
    setPage(1);
    setQuery(search);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      name: user.name || "",
      grade: user.grade || "",
      board: user.board || "",
      xp: user.xp || 0,
      coins: user.coins || 0,
      streak: user.streak || 0,
      isActive: user.isActive !== false,
      onboardingComplete: user.onboardingComplete === true,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.adminUpdateUser(editUser._id, form);
      setMessage("Student updated successfully.");
      setEditUser(null);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="admin-toolbar">
        <Form.Control
          type="search"
          placeholder="Search by name, phone, grade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ maxWidth: 320 }}
        />
        <Form.Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ maxWidth: 160 }}
        >
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="parent">Parents</option>
        </Form.Select>
        <Button className="ustaad-btn-primary admin-btn-sm" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Grade</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name || "—"}</td>
                    <td>
                      <span className={`admin-tag ${user.role === "parent" ? "admin-tag-info" : "admin-tag-success"}`}>
                        {user.role === "parent" ? "Parent" : "Student"}
                      </span>
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.grade || "—"}</td>
                    <td>{user.xp}</td>
                    <td>{user.streak}</td>
                    <td>
                      <span className={`admin-tag ${user.isActive !== false ? "admin-tag-success" : "admin-tag-danger"}`}>
                        {user.isActive !== false ? "Active" : "Disabled"}
                      </span>
                      {user.role !== "parent" && (
                        <span className={`admin-tag ms-1 ${user.onboardingComplete ? "admin-tag-success" : "admin-tag-warning"}`}>
                          {user.onboardingComplete ? "Onboarded" : "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="d-flex gap-1">
                      <Button as={Link} to={`/admin/users/${user._id}`} size="sm" variant="outline-secondary">
                        View
                      </Button>
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(user)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted small">{data.total} users total</span>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={page <= 1}
                onClick={() => { setLoading(true); setPage((p) => p - 1); }}
              >
                Previous
              </Button>
              <span className="align-self-center small">Page {data.page} of {data.pages}</span>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={page >= data.pages}
                onClick={() => { setLoading(true); setPage((p) => p + 1); }}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal show={Boolean(editUser)} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Grade</Form.Label>
            <Form.Control value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Board</Form.Label>
            <Form.Control value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })} />
          </Form.Group>
          <div className="row g-2">
            <div className="col-4">
              <Form.Label>XP</Form.Label>
              <Form.Control type="number" value={form.xp} onChange={(e) => setForm({ ...form, xp: e.target.value })} />
            </div>
            <div className="col-4">
              <Form.Label>Coins</Form.Label>
              <Form.Control type="number" value={form.coins} onChange={(e) => setForm({ ...form, coins: e.target.value })} />
            </div>
            <div className="col-4">
              <Form.Label>Streak</Form.Label>
              <Form.Control type="number" value={form.streak} onChange={(e) => setForm({ ...form, streak: e.target.value })} />
            </div>
          </div>
          <Form.Check
            type="switch"
            className="mt-3"
            label="Account active"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          {editUser?.role !== "parent" && (
            <Form.Check
              type="switch"
              className="mt-2"
              label="Onboarding complete"
              checked={form.onboardingComplete}
              onChange={(e) => setForm({ ...form, onboardingComplete: e.target.checked })}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
          <Button className="ustaad-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminUsers;
