import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Landing = lazy(() => import("./pages/Landing"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const CounselorDashboard = lazy(() => import("./pages/CounselorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SupportRequest = lazy(() => import("./pages/SupportRequest"));
const Resources = lazy(() => import("./pages/Resources"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CheckInHistory = lazy(() => import("./pages/CheckInHistory"));

// Loading Fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-canvas">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-text-muted text-sm font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Public Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected App Shell */}
        <Route element={<Layout />}>
          {/* Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkin"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CheckIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkin/history"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CheckInHistory />
              </ProtectedRoute>
            }
          />

          {/* Support Requests (Shared) */}
          <Route
            path="/support"
            element={
              <ProtectedRoute allowedRoles={["student", "counselor"]}>
                <SupportRequest />
              </ProtectedRoute>
            }
          />

          {/* Counselor */}
          <Route
            path="/counselor"
            element={
              <ProtectedRoute allowedRoles={["counselor"]}>
                <CounselorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Resources (Shared) */}
          <Route
            path="/reference"
            element={
              <ProtectedRoute allowedRoles={["student", "counselor", "admin"]}>
                <Resources />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </AuthProvider>
  );
}
