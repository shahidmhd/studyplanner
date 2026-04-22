import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePlan, markTaskDone, markTaskMissed, toggleExamMode, resetPlan } from '../store/plannerSlice';
import { taskCompleted } from '../store/gamificationSlice';
import { addToRevisionQueue } from '../store/revisionSlice';
import { formatDate, today } from '../utils';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

function TaskCard({ task, onDone, onMissed }) {
  const isToday = task.date === today();
  const statusClass = task.status === 'done' ? 'task-done' : task.status === 'missed' ? 'task-missed' : isToday ? 'task-today' : '';

  return (
    <div className={`task-card ${statusClass}`}>
      <div className="task-info">
        <div className="task-dot" style={{ background: task.subjectColor }} />
        <div>
          <p className="task-name">{task.topicName}</p>
          <p className="task-subject">{task.subjectName} · {task.hours}h</p>
        </div>
      </div>
      <div className="task-right">
        <Badge label={task.difficulty} />
        {task.status === 'pending' && (
          <div className="task-btns">
            <button className="task-btn done" onClick={() => onDone(task.id)}>✓</button>
            <button className="task-btn miss" onClick={() => onMissed(task.id)}>✗</button>
          </div>
        )}
        {task.status === 'done' && <span className="status-chip done">Done</span>}
        {task.status === 'missed' && <span className="status-chip missed">Rescheduled</span>}
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const dispatch = useDispatch();
  const subjects = useSelector((s) => s.subjects.subjects);
  const { schedule, dailyHours, examMode, generated } = useSelector((s) => s.planner);
  const [hours, setHours] = useState(dailyHours);

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);

  const handleGenerate = () => {
    dispatch(generatePlan({ subjects, dailyHours: hours, examMode }));
  };

  const handleDone = (taskId) => {
    dispatch(markTaskDone(taskId));
    dispatch(taskCompleted());
    // Find task and add to revision queue
    for (const day of schedule) {
      const task = day.tasks.find((t) => t.id === taskId);
      if (task) {
        dispatch(addToRevisionQueue({
          topicId: task.topicId,
          topicName: task.topicName,
          subjectName: task.subjectName,
          difficulty: task.difficulty,
        }));
        break;
      }
    }
  };

  const handleMissed = (taskId) => {
    dispatch(markTaskMissed(taskId));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Study Planner</h1>
          <p className="page-subtitle">Your personalized adaptive schedule</p>
        </div>
        <div className="planner-controls">
          <label className="exam-toggle">
            <input type="checkbox" checked={examMode} onChange={() => dispatch(toggleExamMode())} />
            <span className="toggle-slider" />
            <span className="toggle-label">⚡ Exam Mode</span>
          </label>
        </div>
      </div>

      <div className="planner-setup card">
        <h3>Schedule Settings</h3>
        <div className="setup-row">
          <div className="form-group inline">
            <label>Daily Study Hours</label>
            <input
              type="number"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="hours-input"
            />
          </div>
          <div className="setup-stats">
            <span>📚 {subjects.length} subjects</span>
            <span>📝 {totalTopics} topics</span>
            {examMode && <span className="exam-tag">⚡ Exam Mode Active</span>}
          </div>
          <div className="setup-actions">
            <Button variant="primary" onClick={handleGenerate}>
              {generated ? '↻ Regenerate' : '▶ Generate Plan'}
            </Button>
            {generated && <Button variant="ghost" onClick={() => dispatch(resetPlan())}>Clear</Button>}
          </div>
        </div>
      </div>

      {!generated && (
        <div className="empty-state">
          <p>📅 No schedule yet.</p>
          <p>Add subjects & topics, then generate your plan!</p>
        </div>
      )}

      {generated && schedule.length === 0 && (
        <div className="empty-state">
          <p>No topics found. Add topics to your subjects first.</p>
        </div>
      )}

      <div className="schedule-list">
        {schedule.map((day) => (
          <div key={day.date} className="day-block">
            <div className={`day-header ${day.date === today() ? 'today' : ''}`}>
              <h3>{formatDate(day.date)}</h3>
              {day.date === today() && <span className="today-badge">Today</span>}
              <span className="day-hours">
                {day.tasks.reduce((a, t) => a + t.hours, 0)}h total
              </span>
            </div>
            <div className="day-tasks">
              {day.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDone={handleDone} onMissed={handleMissed} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
