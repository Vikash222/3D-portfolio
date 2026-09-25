import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { isAuthenticated, token, admin, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated, token, admin, logout };
}
