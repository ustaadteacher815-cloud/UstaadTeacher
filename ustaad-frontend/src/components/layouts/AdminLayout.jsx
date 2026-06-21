import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../BrandLogo";
import { api } from "../../api/client";
import "../../styles/admin.css";
import { navSections } from "./adminNav";

function profileInitial(name) {
  const trimmed = String(name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "A";
}

function AdminLayout({ children, title, backTo, backLabel = "Back to Dashboard", hideBack = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api.adminStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/admin/login");
  };

  const displayName = user?.name || "Admin";
  const isDashboard = location.pathname === "/admin";
  const showBack = !hideBack && !isDashboard;
  const resolvedBackTo = backTo ?? "/admin";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar-brand">
          <BrandLogo />
        </Link>
        <span className="admin-sidebar-badge">ADMIN PANEL</span>
        {user?.name && (
          <p className="px-3 small mb-4 admin-sidebar-user">{user.name}</p>
        )}

        {navSections.map((section) => (
          <div key={section.title} className="admin-nav-section">
            <div className="admin-nav-section-title">{section.title}</div>
            <nav>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <span className="admin-sidebar-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        <div className="admin-sidebar-footer">
          <Link to="/dashboard" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">🎓</span>
            Student App
          </Link>
          <Button
            variant="outline-light"
            className="w-100 mt-2 admin-btn-sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <span className="admin-topbar-badge">
            {stats ? `${stats.totalStudents} students` : "Admin Panel"}
          </span>

          <div className="admin-topbar-right">
            {stats && (
              <>
                <span className="admin-topbar-pill">{stats.activeToday} active today</span>
                <span className="admin-topbar-pill">{stats.onboardedStudents} onboarded</span>
              </>
            )}

            <div className="admin-profile-menu" ref={menuRef}>
              <button
                type="button"
                className="admin-profile-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open profile menu"
              >
                <span className="admin-profile-avatar">{profileInitial(displayName)}</span>
              </button>

              {menuOpen && (
                <div className="admin-profile-dropdown">
                  <div className="admin-profile-dropdown-header">
                    <span className="admin-profile-avatar lg">{profileInitial(displayName)}</span>
                    <div>
                      <strong>{displayName}</strong>
                      <small className="d-block text-muted">Administrator</small>
                    </div>
                  </div>
                  <Link to="/admin/settings" className="admin-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>
                  <Link to="/admin/users" className="admin-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Manage Users
                  </Link>
                  <button type="button" className="admin-profile-dropdown-link danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-main">
          {showBack && (
            <Link to={resolvedBackTo} className="page-back-btn">
              ← {backLabel}
            </Link>
          )}
          {title && <h1 className="ustaad-title mb-4">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
