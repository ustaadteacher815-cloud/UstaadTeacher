import { Link } from "react-router-dom";

import ParentLayout from "../../components/layouts/ParentLayout";

import { api } from "../../api/client";

import { useApiQuery } from "../../hooks/useApiQuery";



function SubjectBar({ label, value, icon }) {

  return (

    <div className="mb-3">

      <div className="d-flex justify-content-between small">

        <span>{icon ? `${icon} ` : ""}{label}</span>

        <span className="fw-bold">{value}%</span>

      </div>

      <div className="parent-subject-bar">

        <div className="parent-subject-bar-fill" style={{ width: `${value}%` }} />

      </div>

    </div>

  );

}



function ParentProgress() {

  const { data, loading } = useApiQuery(api.parentProgress);



  return (

    <ParentLayout title="Subject Progress">

      <div className="page-intro">

        <p>

          See how each child is progressing in subjects for their class — Class 11 or Class 12 only,

          not mixed together.

        </p>

      </div>



      {loading ? (

        <p>Loading...</p>

      ) : data?.children?.length === 0 ? (

        <div className="ustaad-card text-center">

          <p className="text-muted mb-3">Link a child to view subject progress.</p>

          <Link to="/parent/link" className="ustaad-link">Link child →</Link>

        </div>

      ) : (

        data.children.map((child) => (

          <div key={child.id} className="ustaad-card mb-3">

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">

              <div>

                <h5 className="fw-bold mb-1">{child.name}</h5>

                <p className="text-muted small mb-0">

                  {child.gradeLabel || child.grade || "—"} · {child.completedLessons} lessons done

                </p>

              </div>

              <div className="text-end">

                <div className="fw-bold" style={{ color: "#1cb0f6", fontSize: "1.4rem" }}>{child.progress}%</div>

                <small className="text-muted">Overall</small>

              </div>

            </div>

            {(child.subjects || []).map((subject) => (

              <SubjectBar

                key={subject.id}

                label={subject.name}

                icon={subject.icon}

                value={subject.progress || 0}

              />

            ))}

            <Link to={`/parent/child/${child.id}`} className="ustaad-link small">Full report →</Link>

          </div>

        ))

      )}

    </ParentLayout>

  );

}



export default ParentProgress;

