export const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const formatMinutes = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const today = () => new Date().toISOString().split('T')[0];

export const difficultyWeight = (difficulty) => {
  if (difficulty === 'Hard') return 3;
  if (difficulty === 'Medium') return 2;
  return 1;
};

export const generateSchedule = (subjects, dailyHours, examMode = false) => {
  const schedule = [];
  let currentDate = today();

  let allTopics = subjects.flatMap((s) =>
    s.topics.map((t) => ({ ...t, subjectName: s.name, subjectColor: s.color }))
  );

  if (examMode) {
    allTopics = allTopics.sort((a, b) => difficultyWeight(b.difficulty) - difficultyWeight(a.difficulty));
  }

  const hoursPerTopic = {
    Hard: 2,
    Medium: 1.5,
    Easy: 1,
  };

  let dayHoursUsed = 0;
  let dayTasks = [];

  const pushDay = () => {
    if (dayTasks.length > 0) {
      schedule.push({ date: currentDate, tasks: dayTasks });
      dayTasks = [];
      dayHoursUsed = 0;
      currentDate = addDays(currentDate, 1);
    }
  };

  allTopics.forEach((topic) => {
    const needed = hoursPerTopic[topic.difficulty] || 1;
    if (dayHoursUsed + needed > dailyHours) {
      pushDay();
    }
    dayTasks.push({
      id: generateId(),
      topicId: topic.id,
      topicName: topic.name,
      subjectName: topic.subjectName,
      subjectColor: topic.subjectColor,
      difficulty: topic.difficulty,
      hours: needed,
      status: 'pending',
      date: currentDate,
    });
    dayHoursUsed += needed;
  });

  if (dayTasks.length > 0) {
    schedule.push({ date: currentDate, tasks: dayTasks });
  }

  return schedule;
};

export const calcSpacedRepetitionDate = (difficulty, lastReviewed) => {
  const intervals = { Easy: 7, Medium: 3, Hard: 1 };
  return addDays(lastReviewed || today(), intervals[difficulty] || 3);
};

export const getLevel = (xp) => Math.floor(xp / 50) + 1;

export const xpToNextLevel = (xp) => 50 - (xp % 50);
