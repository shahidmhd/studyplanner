import { useSelector } from 'react-redux';

export function useAuth() {
  const user = useSelector((s) => s.auth.user);
  return { user, isAuthenticated: !!user };
}
