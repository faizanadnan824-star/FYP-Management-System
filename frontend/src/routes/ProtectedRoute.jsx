import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Segoe UI, sans-serif', color: '#2563eb', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>Securing Session Framework...</p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Verifying role authority tokens with cloud instance...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'supervisor' && !location.pathname.startsWith('/supervisor')) {
      return <Navigate to="/supervisor" replace />;
    }
    if (user.role === 'student' && !location.pathname.startsWith('/student')) {
      return <Navigate to="/student" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}