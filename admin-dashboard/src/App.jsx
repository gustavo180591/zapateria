import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Products = lazy(() => import('./pages/products'));
const Orders = lazy(() => import('./pages/orders'));
const Customers = lazy(() => import('./pages/customers'));
const Settings = lazy(() => import('./pages/settings'));
const Page404 = lazy(() => import('./pages/error/Page404'));

// Loading component
const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    }}
  >
    <CircularProgress />
  </Box>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Public Route component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products/*" element={<Products />} />
          <Route path="orders/*" element={<Orders />} />
          <Route path="customers/*" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
