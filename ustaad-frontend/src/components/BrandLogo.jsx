import logoIcon from "../assets/ustaad-logo.svg";
import "./Navbar.css";

function BrandLogo() {
  return (
    <span className="navbar-brand-wrap">
      <img src={logoIcon} alt="" className="navbar-brand-icon" aria-hidden="true" />
      <span>USTAAD</span>
    </span>
  );
}

export default BrandLogo;
