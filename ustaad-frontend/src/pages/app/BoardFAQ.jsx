import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";
import { api } from "../../api/client";
import { useApiQuery } from "../../hooks/useApiQuery";

function BoardFAQ() {
  const { data, error, loading, retry } = useApiQuery(api.getBoardFaq);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const subjects = data?.subjects || [];

  const chaptersWithPapers = useMemo(() => {
    const papers = data?.papers || [];
    const list = subjectFilter === "all"
      ? subjects.flatMap((s) => s.chapters.map((c) => ({ ...c, subjectName: s.name })))
      : (subjects.find((s) => s.id === subjectFilter)?.chapters || []).map((c) => ({
          ...c,
          subjectName: subjects.find((s) => s.id === subjectFilter)?.name,
        }));

    return list.filter((c) => c.paperCount > 0);
  }, [data, subjects, subjectFilter]);

  const filtered = useMemo(() => {
    let papers = data?.papers || [];

    if (subjectFilter !== "all") {
      const subject = subjects.find((s) => s.id === subjectFilter);
      const ids = new Set(subject?.chapters.map((c) => c.id) || []);
      papers = papers.filter((p) => ids.has(p.chapterId));
    }

    if (chapterFilter !== "all") {
      papers = papers.filter((p) => p.chapterId === chapterFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      papers = papers.filter(
        (p) =>
          p.question.toLowerCase().includes(q) ||
          p.chapterName.toLowerCase().includes(q)
      );
    }

    return papers;
  }, [data, subjects, subjectFilter, chapterFilter, search]);

  const selected = filtered.find((p) => p.id === selectedId) || filtered[0];

  if (loading) {
    return (
      <AppLayout title="Solved Board FAQ 📋" backTo="/dashboard" backLabel="Back to Home">
        <p>Loading archive...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Solved Board FAQ 📋" backTo="/dashboard" backLabel="Back to Home">
        <Alert variant="danger">{error}</Alert>
        <Button className="ustaad-btn-primary" onClick={retry}>Retry</Button>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Solved Board FAQ 📋" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro mb-4">
        <p>
          <strong>{data.total} solved papers</strong> for {data.gradeLabel} with step-by-step board-style
          solutions. Filter by subject or search a topic.
        </p>
      </div>

      <div className="ustaad-card mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search board questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className={`ustaad-btn-outline btn btn-sm ${subjectFilter === "all" ? "active" : ""}`}
          onClick={() => { setSubjectFilter("all"); setChapterFilter("all"); }}
        >
          All subjects
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            type="button"
            className={`ustaad-btn-outline btn btn-sm ${subjectFilter === subject.id ? "active" : ""}`}
            onClick={() => { setSubjectFilter(subject.id); setChapterFilter("all"); }}
          >
            {subject.icon} {subject.name}
          </button>
        ))}
      </div>

      {chaptersWithPapers.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            className={`ustaad-btn-outline btn btn-sm ${chapterFilter === "all" ? "active" : ""}`}
            onClick={() => setChapterFilter("all")}
          >
            All chapters
          </button>
          {chaptersWithPapers.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className={`ustaad-btn-outline btn btn-sm ${chapterFilter === chapter.id ? "active" : ""}`}
              onClick={() => setChapterFilter(chapter.id)}
            >
              {chapter.chapterNo}. {chapter.name} ({chapter.paperCount})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="ustaad-card">
          <p className="text-muted mb-3">No papers match your filter. Try another subject or clear search.</p>
          <Button as={Link} to="/learning-path" className="ustaad-btn-primary">
            Go to Chapter Quests
          </Button>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-5">
            {filtered.map((paper) => (
              <button
                key={paper.id}
                type="button"
                className={`ustaad-list-card w-100 text-start mb-2 ${selected?.id === paper.id ? "border-success" : ""}`}
                onClick={() => setSelectedId(paper.id)}
              >
                <span className="ustaad-badge mb-2 d-inline-block">{paper.paperLabel}</span>
                {paper.subjectName && (
                  <small className="text-muted d-block mb-1">{paper.subjectName} · Ch {paper.chapterNo}</small>
                )}
                <p className="mb-0 small">{paper.question}</p>
              </button>
            ))}
          </div>
          <div className="col-lg-7">
            {selected && (
              <div className="ustaad-card">
                <h6 className="fw-bold mb-1">{selected.chapterName}</h6>
                <p className="text-muted small mb-3">{selected.paperLabel}</p>
                <p className="mb-3">{selected.question}</p>

                {selected.options?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold small">Options</h6>
                    {selected.options.map((opt, i) => (
                      <div
                        key={opt}
                        className={`ustaad-option ${i === selected.answer ? "selected" : ""}`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                        {i === selected.answer && " ✓"}
                      </div>
                    ))}
                  </div>
                )}

                <h6 className="fw-bold mb-2">Step-by-step solution</h6>
                {selected.steps.map((step, index) => (
                  <div key={`${index}-${step}`} className="ustaad-option">
                    Step {index + 1}: {step}
                  </div>
                ))}

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Button as={Link} to={`/practice/${selected.chapterId}`} className="ustaad-btn-primary btn-sm">
                    Practice this chapter
                  </Button>
                  <Button as={Link} to={`/lesson/${selected.chapterId}`} className="ustaad-btn-outline btn-sm">
                    Open theory lesson
                  </Button>
                  <Button as={Link} to="/ai-tutor" className="ustaad-btn-outline btn-sm">
                    Ask Doubt Coach
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default BoardFAQ;
