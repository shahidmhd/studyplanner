import { createSlice } from '@reduxjs/toolkit';
import { DUMMY_SUBJECTS } from '../constants';
import { generateId } from '../utils';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const load = () => JSON.parse(localStorage.getItem('asp_subjects') || 'null');
const save = (data) => localStorage.setItem('asp_subjects', JSON.stringify(data));

const initialState = {
  subjects: load() || DUMMY_SUBJECTS,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject(state, action) {
      const { name } = action.payload;
      const color = COLORS[state.subjects.length % COLORS.length];
      state.subjects.push({ id: generateId(), name, color, topics: [] });
      save(state.subjects);
    },
    updateSubject(state, action) {
      const { id, name } = action.payload;
      const s = state.subjects.find((x) => x.id === id);
      if (s) s.name = name;
      save(state.subjects);
    },
    deleteSubject(state, action) {
      state.subjects = state.subjects.filter((s) => s.id !== action.payload);
      save(state.subjects);
    },
    addTopic(state, action) {
      const { subjectId, name, difficulty } = action.payload;
      const s = state.subjects.find((x) => x.id === subjectId);
      if (s) {
        s.topics.push({ id: generateId(), name, difficulty, completed: false, subjectId });
      }
      save(state.subjects);
    },
    updateTopic(state, action) {
      const { subjectId, topicId, name, difficulty } = action.payload;
      const s = state.subjects.find((x) => x.id === subjectId);
      if (s) {
        const t = s.topics.find((x) => x.id === topicId);
        if (t) { t.name = name; t.difficulty = difficulty; }
      }
      save(state.subjects);
    },
    deleteTopic(state, action) {
      const { subjectId, topicId } = action.payload;
      const s = state.subjects.find((x) => x.id === subjectId);
      if (s) s.topics = s.topics.filter((t) => t.id !== topicId);
      save(state.subjects);
    },
    markTopicCompleted(state, action) {
      const { subjectId, topicId } = action.payload;
      const s = state.subjects.find((x) => x.id === subjectId);
      if (s) {
        const t = s.topics.find((x) => x.id === topicId);
        if (t) t.completed = true;
      }
      save(state.subjects);
    },
  },
});

export const { addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic, markTopicCompleted } = subjectsSlice.actions;
export default subjectsSlice.reducer;
