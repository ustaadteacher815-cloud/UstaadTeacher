import Navbar from "../Navbar";
import Footer from "../Footer";
import { Container } from "react-bootstrap";

function MarketingLayout({ children }) {
  return (
    <div className="ustaad-page">
      <Navbar />
      <Container className="py-5" style={{ minHeight: "60vh" }}>
        <div className="ustaad-card" style={{ maxWidth: 920, margin: "0 auto" }}>
          {children}
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default MarketingLayout;
