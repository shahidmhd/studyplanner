export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const SPACED_REPETITION_INTERVALS = {
  Easy: 7,
  Medium: 3,
  Hard: 1,
};

export const POMODORO = {
  FOCUS_MINUTES: 25,
  BREAK_MINUTES: 5,
};

export const XP_REWARDS = {
  COMPLETE_TASK: 10,
  COMPLETE_SESSION: 5,
  STREAK_BONUS: 15,
};

export const BADGES = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🎯', xpRequired: 10 },
  { id: 'pomodoro_5', name: 'Focus Master', description: 'Complete 5 Pomodoro sessions', icon: '🍅', sessionsRequired: 5 },
  { id: 'xp_50', name: 'Quick Learner', description: 'Earn 50 XP', icon: '⚡', xpRequired: 50 },
  { id: 'xp_100', name: 'Scholar', description: 'Earn 100 XP', icon: '📚', xpRequired: 100 },
  { id: 'xp_200', name: 'Champion', description: 'Earn 200 XP', icon: '🏆', xpRequired: 200 },
  { id: 'streak_3', name: 'Consistent', description: 'Study 3 days in a row', icon: '🔥', streakRequired: 3 },
];

export const DUMMY_SUBJECTS = [
  {
    id: 'subj-1',
    name: 'Mathematics',
    color: '#6366f1',
    topics: [
      { id: 'topic-1', name: 'Calculus', difficulty: 'Hard', completed: false, subjectId: 'subj-1' },
      { id: 'topic-2', name: 'Algebra', difficulty: 'Medium', completed: false, subjectId: 'subj-1' },
      { id: 'topic-3', name: 'Statistics', difficulty: 'Medium', completed: false, subjectId: 'subj-1' },
    ],
  },
  {
    id: 'subj-2',
    name: 'Physics',
    color: '#f59e0b',
    topics: [
      { id: 'topic-4', name: 'Mechanics', difficulty: 'Hard', completed: false, subjectId: 'subj-2' },
      { id: 'topic-5', name: 'Optics', difficulty: 'Easy', completed: false, subjectId: 'subj-2' },
    ],
  },
  {
    id: 'subj-3',
    name: 'Chemistry',
    color: '#10b981',
    topics: [
      { id: 'topic-6', name: 'Organic Chemistry', difficulty: 'Hard', completed: false, subjectId: 'subj-3' },
      { id: 'topic-7', name: 'Periodic Table', difficulty: 'Easy', completed: false, subjectId: 'subj-3' },
    ],
  },
];
