import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../BrandLogo";
import { api } from "../../api/client";
import "../../styles/parent.css";

const navSections = [
  {
    title: "Overview",
    items: [
      { to: "/parent", label: "Dashboard", icon: "🏠", end: true },
      { to: "/parent/notifications", label: "Alerts", icon: "🔔" },
      { to: "/parent/reports", label: "Weekly Reports", icon: "📊" },
    ],
  },
  {
    title: "Learning",
    items: [
      { to: "/parent/progress", label: "Subject Progress", icon: "📚" },
      { to: "/parent/activity", label: "Activity & Streaks", icon: "🔥" },
      { to: "/parent/challenges", label: "Daily Challenges", icon: "⚡" },
      { to: "/parent/leaderboard", label: "Leaderboard", icon: "🏆" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { to: "/parent/rewards", label: "Rewards & Badges", icon: "🎁" },
      { to: "/parent/tips", label: "Parent Tips", icon: "💡" },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/parent/link", label: "Link Child", icon: "🔗" },
      { to: "/parent/settings", label: "Settings", icon: "⚙️" },
      { to: "/parent/help", label: "Help & Support", icon: "❓" },
    ],
  },
];

function profileInitial(name) {
  const trimmed = String(name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "P";
}

function ParentLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [childrenData, setChildrenData] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api.parentDashboard()
      .then((data) => { if (!cancelled) setChildrenData(data.children || []); })
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
    navigate("/parent/login");
  };

  const primaryChild = childrenData[0];
  const totalStreak = childrenData.reduce((sum, c) => sum + (c.streak || 0), 0);
  const totalXp = childrenData.reduce((sum, c) => sum + (c.xp || 0), 0);
  const displayName = user?.name || "Parent";

  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <Link to="/parent" className="parent-sidebar-brand">
          <BrandLogo />
        </Link>
        <span className="parent-sidebar-badge">PARENT PORTAL</span>
        {user?.name && (
          <p className="px-3 small mb-4 parent-sidebar-user">Hi, {user.name}</p>
        )}

        {navSections.map((section) => (
          <div key={section.title} className="parent-nav-section">
            <div className="parent-nav-section-title">{section.title}</div>
            <nav>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `parent-sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <span className="parent-sidebar-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        <div className="parent-sidebar-footer">
          <Link to="/" className="parent-sidebar-link">
            <span className="parent-sidebar-icon">🌐</span>
            Website
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

      <div className="parent-main-wrap">
        <header className="parent-topbar">
          <span className="parent-topbar-badge">
            {childrenData.length} linked {childrenData.length === 1 ? "child" : "children"}
          </span>

          <div className="parent-topbar-right">
            {primaryChild && (
              <Link to={`/parent/child/${primaryChild.id}`} className="parent-topbar-pill">
                {primaryChild.name} · {primaryChild.progress}%
              </Link>
            )}
            <span className="parent-topbar-pill">🔥 {primaryChild?.streak ?? totalStreak} streak</span>
            <span className="parent-topbar-pill">⭐ {primaryChild?.xp ?? totalXp} XP</span>

            <div className="parent-profile-menu" ref={menuRef}>
              <button
                type="button"
                className="parent-profile-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open profile menu"
              >
                <span className="parent-profile-avatar">{profileInitial(displayName)}</span>
              </button>

              {menuOpen && (
                <div className="parent-profile-dropdown">
                  <div className="parent-profile-dropdown-header">
                    <span className="parent-profile-avatar lg">{profileInitial(displayName)}</span>
                    <div>
                      <strong>{displayName}</strong>
                      <small className="d-block text-muted">Parent Account</small>
                    </div>
                  </div>
                  <Link to="/parent/settings" className="parent-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Edit Profile
                  </Link>
                  <Link to="/parent/link" className="parent-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Link Child
                  </Link>
                  <Link to="/parent/reports" className="parent-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Weekly Reports
                  </Link>
                  <button type="button" className="parent-profile-dropdown-link danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="parent-main">
          {title && <h1 className="ustaad-title mb-4">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}

export default ParentLayout;
