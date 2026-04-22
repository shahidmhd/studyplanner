import { createSlice } from '@reduxjs/toolkit';
import { generateSchedule, addDays, today } from '../utils';

const load = () => JSON.parse(localStorage.getItem('asp_planner') || 'null');
const save = (data) => localStorage.setItem('asp_planner', JSON.stringify(data));

const initialState = load() || {
  schedule: [],
  dailyHours: 4,
  examMode: false,
  generated: false,
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    generatePlan(state, action) {
      const { subjects, dailyHours, examMode } = action.payload;
      state.dailyHours = dailyHours;
      state.examMode = examMode;
      state.schedule = generateSchedule(subjects, dailyHours, examMode);
      state.generated = true;
      save(state);
    },
    setDailyHours(state, action) {
      state.dailyHours = action.payload;
      save(state);
    },
    toggleExamMode(state) {
      state.examMode = !state.examMode;
      save(state);
    },
    markTaskDone(state, action) {
      const taskId = action.payload;
      for (const day of state.schedule) {
        const task = day.tasks.find((t) => t.id === taskId);
        if (task) { task.status = 'done'; break; }
      }
      save(state);
    },
    markTaskMissed(state, action) {
      const taskId = action.payload;
      let missedTask = null;
      for (const day of state.schedule) {
        const task = day.tasks.find((t) => t.id === taskId);
        if (task) {
          task.status = 'missed';
          missedTask = { ...task };
          break;
        }
      }
      if (missedTask) {
        // Find next available slot or create new day
        const lastDay = state.schedule[state.schedule.length - 1];
        const nextDate = lastDay ? addDays(lastDay.date, 1) : today();
        const existingDay = state.schedule.find((d) => d.date === nextDate);
        const rescheduled = { ...missedTask, id: `${missedTask.id}-r`, status: 'pending', date: nextDate };
        if (existingDay) {
          existingDay.tasks.push(rescheduled);
        } else {
          state.schedule.push({ date: nextDate, tasks: [rescheduled] });
        }
        state.schedule.sort((a, b) => a.date.localeCompare(b.date));
      }
      save(state);
    },
    resetPlan(state) {
      state.schedule = [];
      state.generated = false;
      save(state);
    },
  },
});

export const { generatePlan, setDailyHours, toggleExamMode, markTaskDone, markTaskMissed, resetPlan } = plannerSlice.actions;
export default plannerSlice.reducer;
