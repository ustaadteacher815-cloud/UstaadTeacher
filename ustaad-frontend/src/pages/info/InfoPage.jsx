import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import MarketingLayout from "../../components/layouts/MarketingLayout";
import { footerPages, slugMap } from "../../data/footerPages";

function InfoPage() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];

  if (!slugMap[section]?.includes(slug) || !footerPages[slug]) {
    return <Navigate to="/" replace />;
  }

  const page = footerPages[slug];

  return (
    <MarketingLayout>
      <span className="ustaad-badge mb-3 d-inline-block">{page.category}</span>
      <h1 className="ustaad-title">{page.title}</h1>
      {page.subtitle && (
        <p className="text-muted mb-4" style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
          {page.subtitle}
        </p>
      )}

      {page.content?.map((para) => (
        <p key={para.slice(0, 40)} className="text-muted" style={{ lineHeight: 1.8 }}>
          {para}
        </p>
      ))}

      {page.highlights && (
        <Row className="g-3 my-4">
          {page.highlights.map((h) => (
            <Col md={4} sm={6} key={h.label}>
              <div className="ustaad-stat-card">
                <div className="ustaad-stat-value" style={{ fontSize: "1.4rem" }}>
                  {h.label}
                </div>
                <div className="small text-muted">{h.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {page.sections?.map((sec) => (
        <div key={sec.heading} className="info-section mb-4">
          <h5 className="fw-bold mb-3">{sec.heading}</h5>
          {sec.content?.map((para) => (
            <p key={para.slice(0, 40)} className="text-muted" style={{ lineHeight: 1.8 }}>
              {para}
            </p>
          ))}
          {sec.bullets && (
            <ul className="chapter-tips-list">
              {sec.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {page.bullets && (
        <div className="mb-4">
          {page.bulletTitle && <h5 className="fw-bold mb-3">{page.bulletTitle}</h5>}
          <ul className="chapter-tips-list">
            {page.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {page.steps && (
        <div className="mb-4">
          <h5 className="fw-bold mb-3">How it works</h5>
          {page.steps.map((step, i) => (
            <div key={step.title} className="ustaad-list-card">
              <strong>{i + 1}. {step.title}</strong>
              <p className="mb-0 mt-1 text-muted small">{step.desc}</p>
            </div>
          ))}
        </div>
      )}

      {page.faqs && (
        <div className="mt-3 mb-4">
          <h5 className="fw-bold mb-3">Frequently Asked Questions</h5>
          {page.faqs.map((faq) => (
            <div key={faq.q} className="ustaad-option mb-2">
              <strong>{faq.q}</strong>
              <p className="mb-0 mt-1 text-muted small" style={{ lineHeight: 1.7 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {page.cta && (
        <div className="mt-4">
          {page.cta.to ? (
            <Button as={Link} to={page.cta.to} className="ustaad-btn-primary">
              {page.cta.label}
            </Button>
          ) : (
            <Button
              as="a"
              href={page.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ustaad-btn-primary text-decoration-none"
            >
              {page.cta.label}
            </Button>
          )}
        </div>
      )}

      <div className="mt-5 pt-3 border-top">
        <Link to="/" className="ustaad-link">
          ← Back to Home
        </Link>
      </div>
    </MarketingLayout>
  );
}

export default InfoPage;
