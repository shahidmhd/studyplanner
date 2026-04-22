import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tick, startTimer, pauseTimer, resetTimer } from '../store/pomodoroSlice';
import { sessionCompleted } from '../store/gamificationSlice';
import { formatMinutes } from '../utils';
import { POMODORO } from '../constants';
import Button from '../components/common/Button';

export default function PomodoroPage() {
  const dispatch = useDispatch();
  const { isRunning, isBreak, secondsLeft, completedSessions } = useSelector((s) => s.pomodoro);
  const intervalRef = useRef(null);
  const prevRunning = useRef(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => dispatch(tick()), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, dispatch]);

  // Award XP when a session completes (isBreak flips to true)
  const prevIsBreak = useRef(isBreak);
  useEffect(() => {
    if (isBreak && !prevIsBreak.current) {
      dispatch(sessionCompleted());
    }
    prevIsBreak.current = isBreak;
  }, [isBreak, dispatch]);

  const totalSeconds = isBreak ? POMODORO.BREAK_MINUTES * 60 : POMODORO.FOCUS_MINUTES * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pomodoro Timer</h1>
          <p className="page-subtitle">Stay focused with timed sessions</p>
        </div>
      </div>

      <div className="pomodoro-container">
        <div className="pomodoro-card">
          <div className={`phase-badge ${isBreak ? 'break' : 'focus'}`}>
            {isBreak ? '☕ Break Time' : '🎯 Focus Session'}
          </div>

          <div className="timer-ring-wrapper">
            <svg className="timer-ring" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" className="ring-bg" />
              <circle
                cx="100" cy="100" r="90"
                className={`ring-progress ${isBreak ? 'break' : 'focus'}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="timer-display">
              <span className="timer-time">{formatMinutes(secondsLeft)}</span>
              <span className="timer-label">{isBreak ? 'Break' : 'Focus'}</span>
            </div>
          </div>

          <div className="timer-controls">
            {!isRunning ? (
              <Button variant="primary" size="lg" onClick={() => dispatch(startTimer())}>
                ▶ Start
              </Button>
            ) : (
              <Button variant="warning" size="lg" onClick={() => dispatch(pauseTimer())}>
                ⏸ Pause
              </Button>
            )}
            <Button variant="ghost" onClick={() => dispatch(resetTimer())}>↺ Reset</Button>
          </div>

          <div className="sessions-count">
            <div className="sessions-dots">
              {Array.from({ length: Math.min(completedSessions, 8) }).map((_, i) => (
                <div key={i} className="session-dot filled" />
              ))}
              {Array.from({ length: Math.max(0, 4 - (completedSessions % 4)) }).map((_, i) => (
                <div key={`e-${i}`} className="session-dot" />
              ))}
            </div>
            <p className="sessions-text">{completedSessions} sessions completed today</p>
          </div>
        </div>

        <div className="pomodoro-tips card">
          <h3>💡 Pomodoro Tips</h3>
          <ul>
            <li>Focus on a single task during each session</li>
            <li>Avoid distractions — put your phone away</li>
            <li>After 4 sessions, take a longer 15-min break</li>
            <li>Each completed session earns you +5 XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
