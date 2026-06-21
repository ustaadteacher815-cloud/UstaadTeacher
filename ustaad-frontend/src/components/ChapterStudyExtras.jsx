import { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { api } from "../api/client";

function ChapterStudyExtras({ chapterName }) {
  const [active, setActive] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const [error, setError] = useState("");
  const [diagrams, setDiagrams] = useState(null);
  const [formulas, setFormulas] = useState(null);

  const loadPanel = async (type) => {
    if (active === type) {
      setActive(null);
      return;
    }

    setActive(type);
    setError("");

    if (type === "diagrams" && diagrams) return;
    if (type === "formulas" && formulas) return;

    setLoadingType(type);
    try {
      const result = await api.getChapterExtras(chapterName, type);
      if (type === "diagrams") {
        setDiagrams(result.data);
      } else {
        setFormulas(result.data);
      }
    } catch (err) {
      setError(err.message || "Could not load content.");
      setActive(null);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="chapter-study-extras">
      <button
        type="button"
        className={`ustaad-option w-100 text-start${active === "diagrams" ? " selected" : ""}`}
        onClick={() => loadPanel("diagrams")}
      >
        🖼️ Visual diagrams & examples
        <small className="d-block text-muted mt-1 mb-0">
          {active === "diagrams" ? "Tap to hide" : "Tap to view AI-generated diagrams"}
        </small>
      </button>

      {active === "diagrams" && (
        <div className="lesson-extra-panel">
          {loadingType === "diagrams" ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" /> Loading diagrams...
            </div>
          ) : (
            diagrams?.items?.map((item, i) => (
              <div key={item.title} className="lesson-extra-card">
                <div className="lesson-extra-icon">{["📊", "🔷", "📐"][i] || "🖼️"}</div>
                <div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <p className="text-muted small mb-2">{item.description}</p>
                  <p className="small mb-0">
                    <strong>Example:</strong> {item.example}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button
        type="button"
        className={`ustaad-option w-100 text-start${active === "formulas" ? " selected" : ""}`}
        onClick={() => loadPanel("formulas")}
      >
        📝 Key formulas & notes
        <small className="d-block text-muted mt-1 mb-0">
          {active === "formulas" ? "Tap to hide" : "Tap to view formulas and revision notes"}
        </small>
      </button>

      {active === "formulas" && (
        <div className="lesson-extra-panel">
          {loadingType === "formulas" ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" /> Loading formulas...
            </div>
          ) : (
            <>
              {formulas?.formulas?.map((f) => (
                <div key={f.name} className="lesson-formula-card">
                  <div className="fw-bold">{f.name}</div>
                  <div className="lesson-formula-eq">{f.formula}</div>
                  <small className="text-muted">{f.usage}</small>
                </div>
              ))}
              <h6 className="fw-bold mt-3 mb-2">Quick revision notes</h6>
              <ul className="lesson-notes-list">
                {formulas?.notes?.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {error && <Alert variant="danger" className="py-2 small mt-2">{error}</Alert>}
    </div>
  );
}

export default ChapterStudyExtras;
