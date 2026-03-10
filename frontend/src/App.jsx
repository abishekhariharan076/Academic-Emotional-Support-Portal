import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import CheckIn from "./pages/CheckIn";
import CounselorDashboard from "./pages/CounselorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SupportRequest from "./pages/SupportRequest";
import Resources from "./pages/Resources";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CheckInHistory from "./pages/CheckInHistory";

export default function App() {
  return (
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
          path="/resources"
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
  );
}
