// frontend/src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to finish checking localStorage
  // before deciding to redirect — prevents flashing to /login
  if (loading) return null;

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role (e.g. member trying to access /admin)
  if (role && user.role !== role) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default ProtectedRoute;