import { createSlice } from '@reduxjs/toolkit';
import { POMODORO } from '../constants';

const load = () => JSON.parse(localStorage.getItem('asp_pomodoro') || 'null');
const save = (data) => localStorage.setItem('asp_pomodoro', JSON.stringify(data));

const initialState = load() || {
  isRunning: false,
  isBreak: false,
  secondsLeft: POMODORO.FOCUS_MINUTES * 60,
  completedSessions: 0,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    tick(state) {
      if (state.secondsLeft > 0) {
        state.secondsLeft -= 1;
      } else {
        if (!state.isBreak) {
          state.completedSessions += 1;
          state.isBreak = true;
          state.secondsLeft = POMODORO.BREAK_MINUTES * 60;
        } else {
          state.isBreak = false;
          state.secondsLeft = POMODORO.FOCUS_MINUTES * 60;
        }
        state.isRunning = false;
      }
      save(state);
    },
    startTimer(state) {
      state.isRunning = true;
      save(state);
    },
    pauseTimer(state) {
      state.isRunning = false;
      save(state);
    },
    resetTimer(state) {
      state.isRunning = false;
      state.isBreak = false;
      state.secondsLeft = POMODORO.FOCUS_MINUTES * 60;
      save(state);
    },
  },
});

export const { tick, startTimer, pauseTimer, resetTimer } = pomodoroSlice.actions;
export default pomodoroSlice.reducer;
