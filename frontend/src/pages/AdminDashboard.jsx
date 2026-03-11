import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showCreateCounselor, setShowCreateCounselor] = useState(false);
  const [counselorForm, setCounselorForm] = useState({ name: "", email: "", password: "" });
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    setMsg("");
    setError("");
    try {
      const res = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setMsg("");
    setError("");
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;

    setMsg("");
    setError("");
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("User removed successfully.");
      fetchStats();
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove user");
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    setMsg("");
    setError("");
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(`User role updated to ${newRole}.`);
      fetchStats();
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role");
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get("/admin/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load logs", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleCreateCounselor = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.post("/admin/counselors", counselorForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Counselor account created successfully.");
      setShowCreateCounselor(false);
      setCounselorForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create counselor");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-main pb-12">
      {/* Header */}
      <header className="border-b border-border-light bg-surface/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
              AE
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-text-muted">Welcome, {user?.name || "Admin"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { fetchStats(); fetchUsers(); fetchLogs(); }}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateCounselor(true)}>
              + New Counselor
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Alerts */}
        {msg && (
          <div className="mb-6 p-4 bg-status-success/10 text-status-success rounded-xl font-medium border border-status-success/20 animate-in fade-in slide-in-from-top-2">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-status-error/10 text-status-error rounded-xl font-medium border border-status-error/20 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Stats Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h2 className="text-lg font-bold mb-1">System Overview</h2>
              <p className="text-sm text-text-body mb-6">Real-time platform metrics</p>

              {loadingStats ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-canvas rounded-xl"></div>
                  ))}
                </div>
              ) : stats ? (
                <div className="grid gap-4">
                  <div className="bg-canvas border border-border-light p-4 rounded-xl">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Users</p>
                    <p className="text-3xl font-bold mt-1">{stats.users.total}</p>
                    <div className="flex gap-2 mt-2 text-xs text-text-body">
                      <span>{stats.users.students} Students</span>
                      <span className="text-border-light">•</span>
                      <span>{stats.users.counselors} Counselors</span>
                    </div>
                  </div>

                  <div className="bg-canvas border border-border-light p-4 rounded-xl">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Check-ins</p>
                    <p className="text-3xl font-bold mt-1">{stats.checkIns.total}</p>
                    <p className="text-xs text-text-body mt-2">
                      {stats.checkIns.open} pending review
                    </p>
                  </div>

                  <div className="bg-canvas border border-border-light p-4 rounded-xl">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Weekly Activity</p>
                    <p className="text-3xl font-bold mt-1">{stats.checkIns.last7Days}</p>
                    <p className="text-xs text-text-body mt-2">New requests this week</p>
                  </div>
                </div>
              ) : null}
            </Card>

            {/* Counselor Logs Section */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">Counselor Activity Logs</h2>
                  <p className="text-sm text-text-body">Recent interactions and reviews</p>
                </div>
              </div>

              {loadingLogs ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-canvas rounded-xl"></div>
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">No recent activity found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log._id} className="p-3 bg-canvas border border-border-light rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold">{log.userId?.name || "Student"}</p>
                          <p className="text-xs text-text-muted">
                            Reviewed by <span className="font-semibold text-primary">{log.reviewedBy?.name || "Counselor"}</span> on {new Date(log.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="success">Reviewed</Badge>
                      </div>
                      {log.counselorNote && (
                        <p className="text-xs mt-2 text-text-body italic">"{log.counselorNote}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* User Management Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">User Management</h2>
                  <p className="text-sm text-text-body">Manage account access and roles</p>
                </div>
                <div className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {users.length} Users Found
                </div>
              </div>

              {loadingUsers ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-canvas rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border-light rounded-2xl">
                  <p className="text-text-muted">No users found in the system.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-light">
                  {users.map((u) => (
                    <div key={u._id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                            {u.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-text-main leading-none mb-1">{u.name || "Unnamed User"}</p>
                            <p className="text-xs text-text-body">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                            disabled={u._id === user?.id}
                            className="text-xs font-semibold bg-canvas border border-border-light rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="counselor">Counselor</option>
                            <option value="admin">Admin</option>
                          </select>

                          {u._id !== user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-status-error hover:bg-status-error/5"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Create Counselor Modal */}
      {showCreateCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create Counselor Account</h2>
            <form onSubmit={handleCreateCounselor} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Counselor Name"
                value={counselorForm.name}
                onChange={(e) => setCounselorForm({ ...counselorForm, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="counselor@institution.edu"
                value={counselorForm.email}
                onChange={(e) => setCounselorForm({ ...counselorForm, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={counselorForm.password}
                onChange={(e) => setCounselorForm({ ...counselorForm, password: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreateCounselor(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
