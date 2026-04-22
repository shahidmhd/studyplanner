import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/subjects', icon: '📚', label: 'Subjects' },
  { to: '/planner', icon: '📅', label: 'Study Planner' },
  { to: '/pomodoro', icon: '🍅', label: 'Pomodoro' },
  { to: '/revision', icon: '🔁', label: 'Revision Queue' },
  { to: '/achievements', icon: '🏆', label: 'Achievements' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { xp, level } = useSelector((s) => s.gamification);
  const examMode = useSelector((s) => s.planner.examMode);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🎓</span>
        <span className="logo-text">StudyAI</span>
      </div>

      {examMode && (
        <div className="exam-mode-badge">⚡ Exam Mode</div>
      )}

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-level">Level {level} · {xp} XP</p>
          </div>
        </div>
        <button className="logout-btn" onClick={() => dispatch(logout())}>Sign Out</button>
      </div>
    </aside>
  );
}
