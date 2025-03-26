import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore(); // Get the token from Zustand

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if no token
  }

  return <>{children}</>;
};

export default ProtectedRoute;
