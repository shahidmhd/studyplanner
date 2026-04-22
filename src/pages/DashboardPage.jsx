import { useSelector } from 'react-redux';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { today, formatDate, xpToNextLevel, getLevel } from '../utils';
import { BADGES } from '../constants';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { xp, level, completedTasks, completedSessions, streak, badges } = useSelector((s) => s.gamification);
  const { schedule } = useSelector((s) => s.planner);
  const { queue: revisionQueue } = useSelector((s) => s.revision);
  const subjects = useSelector((s) => s.subjects.subjects);
  const user = useSelector((s) => s.auth.user);

  const allTasks = schedule.flatMap((d) => d.tasks);
  const doneTasks = allTasks.filter((t) => t.status === 'done').length;
  const pendingTasks = allTasks.filter((t) => t.status === 'pending').length;
  const missedTasks = allTasks.filter((t) => t.status === 'missed').length;
  const totalHours = allTasks.filter((t) => t.status === 'done').reduce((a, t) => a + t.hours, 0);

  // Weekly data from schedule
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayTasks = schedule.find((s) => s.date === dateStr);
    const done = dayTasks ? dayTasks.tasks.filter((t) => t.status === 'done').length : 0;
    const hours = dayTasks ? dayTasks.tasks.filter((t) => t.status === 'done').reduce((a, t) => a + t.hours, 0) : 0;
    return { date: formatDate(dateStr), done, hours };
  });

  const pieData = [
    { name: 'Done', value: doneTasks },
    { name: 'Pending', value: pendingTasks },
    { name: 'Missed', value: missedTasks },
  ].filter((d) => d.value > 0);

  const subjectProgress = subjects.map((s) => ({
    name: s.name,
    total: s.topics.length,
    completed: s.topics.filter((t) => t.completed).length,
    color: s.color,
  }));

  const xpForNext = xpToNextLevel(xp);
  const xpProgress = ((50 - xpForNext) / 50) * 100;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">{today() && formatDate(today())} · Keep up the great work</p>
        </div>
        {streak > 0 && (
          <div className="streak-badge">🔥 {streak} day streak</div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <p className="stat-value">{totalHours}h</p>
            <p className="stat-label">Total Study Hours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-value">{doneTasks}</p>
            <p className="stat-label">Tasks Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍅</div>
          <div className="stat-info">
            <p className="stat-value">{completedSessions}</p>
            <p className="stat-label">Focus Sessions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <p className="stat-value">{revisionQueue.length}</p>
            <p className="stat-label">Due for Review</p>
          </div>
        </div>
      </div>

      {/* XP / Level Progress */}
      <div className="card xp-card">
        <div className="xp-header">
          <div>
            <h3>Level {level}</h3>
            <p>{xp} XP · {xpForNext} XP to next level</p>
          </div>
          <div className="xp-badges">
            {badges.slice(-3).map((bid) => {
              const b = BADGES.find((x) => x.id === bid);
              return b ? <span key={bid} title={b.name} className="xp-badge-icon">{b.icon}</span> : null;
            })}
          </div>
        </div>
        <div className="xp-bar-bg">
          <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      <div className="charts-grid">
        {/* Weekly Hours Chart */}
        <div className="card chart-card">
          <h3>Weekly Study Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="url(#colorHours)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Pie */}
        <div className="card chart-card">
          <h3>Task Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">Generate a study plan to see stats</div>
          )}
        </div>

        {/* Subject Progress */}
        <div className="card chart-card full-width">
          <h3>Subject Progress</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={subjectProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#e2e8f0" name="Total" />
              <Bar dataKey="completed" fill="#6366f1" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
