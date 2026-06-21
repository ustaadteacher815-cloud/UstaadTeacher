import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { footerLinks } from "../data/footerPages";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <Row>
          {footerLinks.map((group) => (
            <Col md={2} key={group.title} className="footer-col">
              <h5 className="fw-bold mb-4">{group.title}</h5>
              {group.links.map((link) => (
                <Link key={link.label} to={link.to} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </Col>
          ))}
        </Row>

        <hr className="mt-5 border-light" />

        <div className="text-center mt-3">
          © 2026 USTAAD - Learn Daily. Grow Daily.
          {" · "}
          <Link to="/parent/login" className="footer-link">Parent</Link>
          {" · "}
          <Link to="/admin/login" className="footer-link">Admin</Link>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
