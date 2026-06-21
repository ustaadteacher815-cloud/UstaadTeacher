import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import AdminLayout from "../../components/layouts/AdminLayout";
import { api } from "../../api/client";

const emptySkillForm = {
  name: "",
  icon: "💡",
  description: "",
  lessonCount: 12,
  relatedSubjects: "",
  relatedCareers: "",
};

const emptyCareerForm = {
  name: "",
  icon: "🎯",
  stream: "STEM",
  demand: "High",
  salary: "",
  description: "",
  skills: "",
  path: "",
  relatedSubjects: "",
};

function listToText(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function AdminSkillsCareers() {
  const [tab, setTab] = useState("skills");
  const [tracks, setTracks] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [careerForm, setCareerForm] = useState(emptyCareerForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [trackData, careerData] = await Promise.all([
        api.adminGetSkillTracks(),
        api.adminGetCareers(),
      ]);
      setTracks(trackData);
      setCareers(careerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    if (tab === "skills") setSkillForm(emptySkillForm);
    else setCareerForm(emptyCareerForm);
    setModalOpen(true);
  };

  const openEditSkill = (track) => {
    setEditingId(track._id);
    setSkillForm({
      name: track.name,
      icon: track.icon,
      description: track.description || "",
      lessonCount: track.lessonCount,
      relatedSubjects: listToText(track.relatedSubjects),
      relatedCareers: listToText(track.relatedCareers),
    });
    setModalOpen(true);
  };

  const openEditCareer = (career) => {
    setEditingId(career._id);
    setCareerForm({
      name: career.name,
      icon: career.icon,
      stream: career.stream || "STEM",
      demand: career.demand || "High",
      salary: career.salary || "",
      description: career.description || "",
      skills: listToText(career.skills),
      path: Array.isArray(career.path) ? career.path.join("\n") : "",
      relatedSubjects: listToText(career.relatedSubjects),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (tab === "skills") {
        const payload = {
          name: skillForm.name.trim(),
          icon: skillForm.icon.trim() || "💡",
          description: skillForm.description.trim(),
          lessonCount: Number(skillForm.lessonCount) || 12,
          relatedSubjects: skillForm.relatedSubjects,
          relatedCareers: skillForm.relatedCareers,
        };
        if (!payload.name) throw new Error("Track name is required.");

        if (editingId) {
          await api.adminUpdateSkillTrack(editingId, payload);
          setMessage("Skill track updated — students will see changes in Skill Development.");
        } else {
          await api.adminCreateSkillTrack(payload);
          setMessage("Skill track added — visible to students in Skill Development.");
        }
      } else {
        const payload = {
          name: careerForm.name.trim(),
          icon: careerForm.icon.trim() || "🎯",
          stream: careerForm.stream,
          demand: careerForm.demand.trim() || "High",
          salary: careerForm.salary.trim(),
          description: careerForm.description.trim(),
          skills: careerForm.skills,
          path: careerForm.path,
          relatedSubjects: careerForm.relatedSubjects,
        };
        if (!payload.name) throw new Error("Career name is required.");

        if (editingId) {
          await api.adminUpdateCareer(editingId, payload);
          setMessage("Career updated — students will see changes in Career Explorer.");
        } else {
          await api.adminCreateCareer(payload);
          setMessage("Career added — visible to students in Career Explorer.");
        }
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      if (tab === "skills") {
        await api.adminDeleteSkillTrack(id);
        setMessage("Skill track deleted.");
      } else {
        await api.adminDeleteCareer(id);
        setMessage("Career deleted.");
      }
      loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return <AdminLayout title="Skills & Careers"><p>Loading...</p></AdminLayout>;
  }

  return (
    <AdminLayout title="Skills & Careers">
      <div className="page-intro mb-4">
        <p>
          Manage skill development tracks and career paths shown to students in{" "}
          <strong>Skill Development</strong> and <strong>Career Explorer</strong>.
        </p>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && (
        <Alert variant="danger">
          {error}
          <Button className="ms-2 ustaad-btn-primary admin-btn-sm" onClick={loadData}>Retry</Button>
        </Alert>
      )}

      <div className="d-flex flex-wrap gap-2 mb-4">
        <Button
          variant={tab === "skills" ? "success" : "outline-secondary"}
          className="admin-btn-sm"
          onClick={() => setTab("skills")}
        >
          Skill Tracks ({tracks.length})
        </Button>
        <Button
          variant={tab === "careers" ? "success" : "outline-secondary"}
          className="admin-btn-sm"
          onClick={() => setTab("careers")}
        >
          Career Paths ({careers.length})
        </Button>
        <Button className="ustaad-btn-primary admin-btn-sm ms-auto" onClick={openCreate}>
          + Add {tab === "skills" ? "Skill Track" : "Career"}
        </Button>
      </div>

      {tab === "skills" ? (
        <Row className="g-3">
          {tracks.map((track) => (
            <Col md={4} key={track._id}>
              <div className="ustaad-card h-100">
                <div style={{ fontSize: "2rem" }}>{track.icon}</div>
                <h6 className="fw-bold mt-2">{track.name}</h6>
                <p className="text-muted small mb-2">{track.description}</p>
                <p className="text-muted small mb-2">{track.lessonCount} lessons</p>
                <span className="admin-tag admin-tag-info d-inline-block mb-3">{track.trackId}</span>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => openEditSkill(track)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(track._id, track.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="g-3">
          {careers.map((career) => (
            <Col md={4} key={career._id}>
              <div className="ustaad-card h-100">
                <div style={{ fontSize: "2rem" }}>{career.icon}</div>
                <h6 className="fw-bold mt-2">{career.name}</h6>
                <p className="text-muted small mb-1">{career.stream} · {career.demand} demand</p>
                <p className="text-muted small mb-2">{career.salary}</p>
                <span className="admin-tag admin-tag-info d-inline-block mb-3">{career.careerId}</span>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => openEditCareer(career)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(career._id, career.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit" : "Add"} {tab === "skills" ? "Skill Track" : "Career Path"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tab === "skills" ? (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                />
              </Form.Group>
              <div className="row g-2">
                <div className="col-md-4">
                  <Form.Group className="mb-2">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                      value={skillForm.icon}
                      onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-2">
                    <Form.Label>Lessons</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={skillForm.lessonCount}
                      onChange={(e) => setSkillForm({ ...skillForm, lessonCount: e.target.value })}
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Related subjects (comma-separated ids)</Form.Label>
                <Form.Control
                  value={skillForm.relatedSubjects}
                  onChange={(e) => setSkillForm({ ...skillForm, relatedSubjects: e.target.value })}
                  placeholder="mathematics, physics, mathematics-12"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Related careers (comma-separated ids)</Form.Label>
                <Form.Control
                  value={skillForm.relatedCareers}
                  onChange={(e) => setSkillForm({ ...skillForm, relatedCareers: e.target.value })}
                  placeholder="engineer, ai-engineer"
                />
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={careerForm.name}
                  onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                />
              </Form.Group>
              <div className="row g-2">
                <div className="col-md-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                      value={careerForm.icon}
                      onChange={(e) => setCareerForm({ ...careerForm, icon: e.target.value })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Stream</Form.Label>
                    <Form.Select
                      value={careerForm.stream}
                      onChange={(e) => setCareerForm({ ...careerForm, stream: e.target.value })}
                    >
                      <option value="STEM">STEM</option>
                      <option value="PCM">PCM</option>
                      <option value="PCB">PCB</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Demand</Form.Label>
                    <Form.Control
                      value={careerForm.demand}
                      onChange={(e) => setCareerForm({ ...careerForm, demand: e.target.value })}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Salary range</Form.Label>
                    <Form.Control
                      value={careerForm.salary}
                      onChange={(e) => setCareerForm({ ...careerForm, salary: e.target.value })}
                      placeholder="₹6–20 LPA"
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Key skills (comma-separated)</Form.Label>
                <Form.Control
                  value={careerForm.skills}
                  onChange={(e) => setCareerForm({ ...careerForm, skills: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Career path steps (one per line)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={careerForm.path}
                  onChange={(e) => setCareerForm({ ...careerForm, path: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Related subjects (comma-separated ids)</Form.Label>
                <Form.Control
                  value={careerForm.relatedSubjects}
                  onChange={(e) => setCareerForm({ ...careerForm, relatedSubjects: e.target.value })}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button className="ustaad-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminSkillsCareers;
