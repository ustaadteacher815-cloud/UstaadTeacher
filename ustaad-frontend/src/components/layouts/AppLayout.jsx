import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { getGradeLabel } from "../../data/learningContent";

const navGroups = [
  {
    label: "Learning",
    items: [
      { to: "/dashboard", label: "Home", icon: "🏠" },
      { to: "/learning-path", label: "Chapter Quests", icon: "🎯" },
      { to: "/theory-lab", label: "Theory Lab", icon: "📖" },
      { to: "/board-faq", label: "Board FAQ", icon: "📋" },
      { to: "/daily-challenge", label: "Daily Challenge", icon: "⚡" },
    ],
  },
  {
    label: "AI & Practice",
    items: [
      { to: "/ai-tutor", label: "Doubt Coach", icon: "🧠" },
      { to: "/recommendations", label: "Recommendations", icon: "✨" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { to: "/community", label: "Study Lounges", icon: "👥" },
      { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
      { to: "/rewards", label: "Rewards", icon: "🎁" },
      { to: "/scholarships", label: "Scholarships", icon: "🎓" },
    ],
  },
  {
    label: "Progress",
    items: [
      { to: "/analytics", label: "Analytics", icon: "📊" },
      { to: "/weekly-targets", label: "Weekly Targets", icon: "🎯" },
      { to: "/streak", label: "Streak", icon: "🔥" },
      { to: "/skills", label: "Skills", icon: "💡" },
      { to: "/career-explorer", label: "Career Explorer", icon: "🚀" },
    ],
  },
];

function profileInitial(name) {
  const trimmed = String(name || "").trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "S";
}

function studentLevel(xp = 0) {
  return Math.max(1, Math.floor(xp / 120) + 1);
}

function AppLayout({ children, title, backTo, backLabel = "Back", backState }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.name || "Student";
  const gradeLabel = user?.grade ? getGradeLabel(user.grade) : "CBSE";
  const level = studentLevel(user?.xp);

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
    navigate("/login");
  };

  return (
    <div className="ustaad-app-layout">
      <aside className="ustaad-sidebar">
        <Link to="/dashboard" className="ustaad-sidebar-brand">
          USTAAD
        </Link>
        {user?.name && (
          <p className="ustaad-sidebar-user">Hi, {user.name}</p>
        )}
        <nav className="ustaad-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="ustaad-sidebar-group">
              <p className="ustaad-sidebar-group-label">{group.label}</p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `ustaad-sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <span className="ustaad-sidebar-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <Button
          variant="outline-danger"
          className="w-100 ustaad-sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </aside>

      <div className="ustaad-main-wrap">
        <header className="ustaad-topbar">
          <span className="ustaad-topbar-grade">{gradeLabel}</span>

          <div className="ustaad-topbar-right">
            <Link to="/streak" className="ustaad-topbar-pill">
              🔥 {user?.streak ?? 0} day streak
            </Link>
            <span className="ustaad-topbar-pill">
              Lvl {level} · {user?.xp ?? 0} XP
            </span>

            <div className="ustaad-profile-menu" ref={menuRef}>
              <button
                type="button"
                className="ustaad-profile-btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open profile menu"
              >
                <span className="ustaad-profile-avatar">{profileInitial(displayName)}</span>
              </button>

              {menuOpen && (
                <div className="ustaad-profile-dropdown">
                  <div className="ustaad-profile-dropdown-header">
                    <span className="ustaad-profile-avatar lg">{profileInitial(displayName)}</span>
                    <div>
                      <strong>{displayName}</strong>
                      <small className="d-block text-muted">{gradeLabel} · {user?.board || "CBSE"}</small>
                    </div>
                  </div>
                  <Link to="/edit-profile" className="ustaad-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Edit Profile
                  </Link>
                  <Link to="/dashboard" className="ustaad-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/analytics" className="ustaad-profile-dropdown-link" onClick={() => setMenuOpen(false)}>
                    My Progress
                  </Link>
                  <button type="button" className="ustaad-profile-dropdown-link danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="ustaad-main">
          {backTo && (
            <Link to={backTo} state={backState} className="page-back-btn">
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

export default AppLayout;
