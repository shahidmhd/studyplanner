import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import subjectsReducer from './subjectsSlice';
import plannerReducer from './plannerSlice';
import pomodoroReducer from './pomodoroSlice';
import gamificationReducer from './gamificationSlice';
import revisionReducer from './revisionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectsReducer,
    planner: plannerReducer,
    pomodoro: pomodoroReducer,
    gamification: gamificationReducer,
    revision: revisionReducer,
  },
});
