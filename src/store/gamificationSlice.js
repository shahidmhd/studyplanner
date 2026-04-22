import { createSlice } from '@reduxjs/toolkit';
import { BADGES, XP_REWARDS } from '../constants';
import { getLevel } from '../utils';

const load = () => JSON.parse(localStorage.getItem('asp_gamification') || 'null');
const save = (data) => localStorage.setItem('asp_gamification', JSON.stringify(data));

const initialState = load() || {
  xp: 0,
  level: 1,
  completedTasks: 0,
  completedSessions: 0,
  streak: 0,
  lastStudyDate: null,
  badges: [],
};

const checkBadges = (state) => {
  BADGES.forEach((badge) => {
    if (state.badges.includes(badge.id)) return;
    if (badge.xpRequired && state.xp >= badge.xpRequired) state.badges.push(badge.id);
    if (badge.sessionsRequired && state.completedSessions >= badge.sessionsRequired) state.badges.push(badge.id);
    if (badge.streakRequired && state.streak >= badge.streakRequired) state.badges.push(badge.id);
  });
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    addXP(state, action) {
      state.xp += action.payload;
      state.level = getLevel(state.xp);
      checkBadges(state);
      save(state);
    },
    taskCompleted(state) {
      state.xp += XP_REWARDS.COMPLETE_TASK;
      state.completedTasks += 1;
      state.level = getLevel(state.xp);
      const today = new Date().toISOString().split('T')[0];
      if (state.lastStudyDate === today) {
        // same day, no streak update
      } else if (state.lastStudyDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
        state.streak += 1;
        if (state.streak % 3 === 0) state.xp += XP_REWARDS.STREAK_BONUS;
      } else {
        state.streak = 1;
      }
      state.lastStudyDate = today;
      checkBadges(state);
      save(state);
    },
    sessionCompleted(state) {
      state.xp += XP_REWARDS.COMPLETE_SESSION;
      state.completedSessions += 1;
      state.level = getLevel(state.xp);
      checkBadges(state);
      save(state);
    },
  },
});

export const { addXP, taskCompleted, sessionCompleted } = gamificationSlice.actions;
export default gamificationSlice.reducer;
