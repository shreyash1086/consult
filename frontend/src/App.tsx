import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import Portal from './pages/Portal';
import Dashboard from './pages/candidate/Dashboard';
import AssessmentList from './pages/candidate/AssessmentList';
import AssessmentDetail from './pages/candidate/AssessmentDetail';
import ResultPage from './pages/candidate/ResultPage';
import SubmissionsHistory from './pages/candidate/History';
import ScenarioManager from './pages/admin/ScenarioManager';
import QuestionManager from './pages/admin/QuestionManager';
import UserManager from './pages/admin/UserManager';
import AdminAnalytics from './pages/admin/Analytics';
import SubmissionsBrowser from './pages/trainer/SubmissionsBrowser';
import { useAuthStore } from './store/auth.store';
import { Role } from './types';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: Role[] }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return (
    <div className="h-screen w-full bg-near-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          {/* Default Route based on role */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === Role.ADMIN ? <ScenarioManager /> : user?.role === Role.TRAINER ? <SubmissionsBrowser /> : <Dashboard />}
            </ProtectedRoute>
          } />

          {/* Candidate Routes */}
          <Route path="/assessments" element={
            <ProtectedRoute roles={[Role.CANDIDATE]}>
              <AssessmentList />
            </ProtectedRoute>
          } />
          <Route path="/assessments/:id" element={
            <ProtectedRoute roles={[Role.CANDIDATE]}>
              <AssessmentDetail />
            </ProtectedRoute>
          } />
          <Route path="/submissions/:id" element={
            <ProtectedRoute roles={[Role.CANDIDATE]}>
              <ResultPage />
            </ProtectedRoute>
          } />
          <Route path="/submissions" element={
            <ProtectedRoute roles={[Role.CANDIDATE]}>
              <SubmissionsHistory />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/scenarios" replace />} />
          <Route path="/admin/scenarios" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <ScenarioManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/scenarios/:scenarioId/questions" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <QuestionManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <UserManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />

          {/* Trainer Routes */}
          <Route path="/trainer" element={
            <ProtectedRoute roles={[Role.TRAINER]}>
              <SubmissionsBrowser />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
