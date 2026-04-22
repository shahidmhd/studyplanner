import { useSelector } from 'react-redux';
import { BADGES } from '../constants';
import { getLevel, xpToNextLevel } from '../utils';

export default function AchievementsPage() {
  const { xp, level, completedTasks, completedSessions, streak, badges } = useSelector((s) => s.gamification);
  const xpForNext = xpToNextLevel(xp);
  const xpProgress = ((50 - xpForNext) / 50) * 100;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Achievements</h1>
          <p className="page-subtitle">Track your progress and earn rewards</p>
        </div>
      </div>

      {/* Level & XP Card */}
      <div className="card level-card">
        <div className="level-display">
          <div className="level-circle">{level}</div>
          <div className="level-info">
            <h2>Level {level}</h2>
            <p>{xp} total XP · {xpForNext} XP to Level {level + 1}</p>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="level-stats">
          <div className="level-stat">
            <span className="ls-value">{completedTasks}</span>
            <span className="ls-label">Tasks Done</span>
          </div>
          <div className="level-stat">
            <span className="ls-value">{completedSessions}</span>
            <span className="ls-label">Sessions</span>
          </div>
          <div className="level-stat">
            <span className="ls-value">{streak}</span>
            <span className="ls-label">Day Streak</span>
          </div>
          <div className="level-stat">
            <span className="ls-value">{badges.length}</span>
            <span className="ls-label">Badges</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h2 className="section-title">🏅 Badges</h2>
      <div className="badges-grid">
        {BADGES.map((badge) => {
          const earned = badges.includes(badge.id);
          return (
            <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
              <div className="badge-icon">{earned ? badge.icon : '🔒'}</div>
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-desc">{badge.description}</p>
              {earned && <span className="badge-earned-tag">Earned!</span>}
            </div>
          );
        })}
      </div>

      {/* XP How to Earn */}
      <div className="card how-to-earn">
        <h3>💡 How to Earn XP</h3>
        <ul>
          <li><strong>+10 XP</strong> — Complete a study task</li>
          <li><strong>+5 XP</strong> — Complete a Pomodoro session</li>
          <li><strong>+15 XP</strong> — Maintain a 3-day study streak</li>
        </ul>
      </div>
    </div>
  );
}
