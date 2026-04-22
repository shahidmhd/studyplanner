import { createSlice } from '@reduxjs/toolkit';
import { calcSpacedRepetitionDate, today } from '../utils';
import { generateId } from '../utils';

const load = () => JSON.parse(localStorage.getItem('asp_revision') || 'null');
const save = (data) => localStorage.setItem('asp_revision', JSON.stringify(data));

const initialState = load() || { queue: [] };

const revisionSlice = createSlice({
  name: 'revision',
  initialState,
  reducers: {
    addToRevisionQueue(state, action) {
      const { topicId, topicName, subjectName, difficulty } = action.payload;
      const existing = state.queue.find((x) => x.topicId === topicId);
      if (existing) {
        existing.nextReview = calcSpacedRepetitionDate(difficulty, today());
        existing.reviewCount = (existing.reviewCount || 0) + 1;
      } else {
        state.queue.push({
          id: generateId(),
          topicId,
          topicName,
          subjectName,
          difficulty,
          nextReview: calcSpacedRepetitionDate(difficulty, today()),
          reviewCount: 1,
        });
      }
      save(state);
    },
    removeFromQueue(state, action) {
      state.queue = state.queue.filter((x) => x.id !== action.payload);
      save(state);
    },
    updateReview(state, action) {
      const { id, difficulty } = action.payload;
      const item = state.queue.find((x) => x.id === id);
      if (item) {
        item.nextReview = calcSpacedRepetitionDate(difficulty, today());
        item.reviewCount = (item.reviewCount || 0) + 1;
        item.lastReviewed = today();
      }
      save(state);
    },
  },
});

export const { addToRevisionQueue, removeFromQueue, updateReview } = revisionSlice.actions;
export default revisionSlice.reducer;
