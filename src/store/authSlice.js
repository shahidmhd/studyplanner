import { createSlice } from '@reduxjs/toolkit';

const loadUsers = () => JSON.parse(localStorage.getItem('asp_users') || '[]');
const saveUsers = (users) => localStorage.setItem('asp_users', JSON.stringify(users));
const loadSession = () => JSON.parse(localStorage.getItem('asp_session') || 'null');
const saveSession = (user) => localStorage.setItem('asp_session', JSON.stringify(user));
const clearSession = () => localStorage.removeItem('asp_session');

const initialState = {
  user: loadSession(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload;
      const users = loadUsers();
      if (users.find((u) => u.email === email)) {
        state.error = 'Email already registered.';
        return;
      }
      const newUser = { id: `user-${Date.now()}`, name, email, password };
      users.push(newUser);
      saveUsers(users);
      const session = { id: newUser.id, name, email };
      saveSession(session);
      state.user = session;
      state.error = null;
    },
    login(state, action) {
      const { email, password } = action.payload;
      const users = loadUsers();
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        state.error = 'Invalid email or password.';
        return;
      }
      const session = { id: found.id, name: found.name, email: found.email };
      saveSession(session);
      state.user = session;
      state.error = null;
    },
    logout(state) {
      clearSession();
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
