import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import PlannerPage from './pages/PlannerPage';
import PomodoroPage from './pages/PomodoroPage';
import RevisionPage from './pages/RevisionPage';
import AchievementsPage from './pages/AchievementsPage';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/camerin">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="pomodoro" element={<PomodoroPage />} />
            <Route path="revision" element={<RevisionPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
