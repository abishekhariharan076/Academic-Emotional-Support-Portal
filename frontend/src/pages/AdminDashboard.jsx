import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const token = sessionStorage.getItem("token");

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
  const [instRequests, setInstRequests] = useState([]);
  const [loadingInst, setLoadingInst] = useState(false);
  const [activeTab, setActiveTab] = useState("stats"); // stats, users, connections
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedInstReq, setSelectedInstReq] = useState(null);
  const [selectedCounselorId, setSelectedCounselorId] = useState("");
  const [showAssignCounselorModal, setShowAssignCounselorModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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

  const fetchInstRequests = async () => {
    setLoadingInst(true);
    try {
      const res = await api.get("/admin/institution-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstRequests(res.data);
    } catch (err) {
      console.error("Failed to load institution requests", err);
    } finally {
      setLoadingInst(false);
    }
  };

  const handleFulfillRequest = async (requestId, counselorId) => {
    setMsg("");
    setError("");
    try {
      await api.post(`/admin/institution-requests/${requestId}/fulfill`, { counselorId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Institution request fulfilled and students connected.");
      fetchInstRequests();
      fetchUsers();
      setShowConnectModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fulfill request");
    }
  };

  const handleManualAssign = async (studentId, counselorId) => {
    setMsg("");
    setError("");
    try {
      await api.post(`/admin/users/${studentId}/assign-counselor`, { counselorId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Counselor assigned to student.");
      fetchUsers();
      setShowAssignCounselorModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign counselor");
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
    fetchInstRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-main pb-12">
      {/* Header */}
      <header className="border-b border-border-light bg-surface/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-text-muted">Welcome, {user?.name || "Admin"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-canvas border border-border-light rounded-xl p-1 flex mr-4">
              <button 
                onClick={() => setActiveTab("stats")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "stats" ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text-main"}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "users" ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text-main"}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab("connections")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "connections" ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-text-main"}`}
              >
                Connections
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { fetchStats(); fetchUsers(); fetchLogs(); fetchInstRequests(); }}>
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

        <div className="space-y-8">
          {activeTab === "stats" && (
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
        </div>
          )}

          {activeTab === "connections" && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Institution Connection Requests</h2>
                  <p className="text-sm text-text-body">Manage counselor-student links by institution domain</p>
                </div>
              </div>

              {loadingInst ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-canvas rounded-xl"></div>)}
                </div>
              ) : instRequests.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border-light rounded-2xl">
                  <p className="text-text-muted">No pending institution requests.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {instRequests.map(req => (
                    <Card key={req._id} className="border-l-4 border-l-primary bg-canvas/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{req.institutionName}</h3>
                        <Badge variant={req.status === "fulfilled" ? "success" : "warning"}>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-body mb-1"><strong>Domain:</strong> @{req.domain}</p>
                      <p className="text-sm text-text-body mb-3"><strong>Contact:</strong> {req.contactEmail}</p>
                      <p className="text-xs text-text-muted italic mb-4">"{req.message}"</p>
                      
                      {req.status === "pending" ? (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedInstReq(req);
                            setShowConnectModal(true);
                          }}
                        >
                          Connect Counselor
                        </Button>
                      ) : (
                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <p className="text-xs font-bold text-primary mb-1">Assigned Counselor</p>
                          <p className="text-sm">{req.assignedCounselorId?.name || "Unknown"}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* User Management Section */}
          {(activeTab === "users" || activeTab === "stats") && (
            <div className={`${activeTab === "stats" ? "lg:col-span-2" : "col-span-full"} space-y-6`}>
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
                            <p className="text-xs text-text-body mb-1">{u.email}</p>
                            {u.role === "student" && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Counselor:</span>
                                {u.assignedCounselor ? (
                                  <span className="text-xs text-primary font-medium">{u.assignedCounselor.name}</span>
                                ) : (
                                  <span className="text-xs text-text-muted italic">None assigned</span>
                                )}
                                <button 
                                  onClick={() => {
                                    setSelectedUserId(u._id);
                                    setSelectedCounselorId(u.assignedCounselor?._id || "");
                                    setShowAssignCounselorModal(true);
                                  }}
                                  className="text-[10px] text-primary hover:underline ml-1"
                                >
                                  Change
                                </button>
                              </div>
                            )}
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
        )}
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

      {/* Connect Counselor for Institution Request Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Connect Counselor</h2>
            <p className="text-sm text-text-body mb-4">
              Link a counselor to all students from <strong>{selectedInstReq?.institutionName}</strong> (@{selectedInstReq?.domain}).
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Counselor</label>
                <select 
                  className="w-full bg-canvas border border-border-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCounselorId}
                  onChange={(e) => setSelectedCounselorId(e.target.value)}
                >
                  <option value="">Select a counselor...</option>
                  {users.filter(u => u.role === "counselor").map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowConnectModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  disabled={!selectedCounselorId}
                  onClick={() => handleFulfillRequest(selectedInstReq._id, selectedCounselorId)}
                >
                  Connect
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Assign Counselor to Individual Student Modal */}
      {showAssignCounselorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Counselor</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Counselor</label>
                <select 
                  className="w-full bg-canvas border border-border-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCounselorId}
                  onChange={(e) => setSelectedCounselorId(e.target.value)}
                >
                  <option value="">None (Unassign)</option>
                  {users.filter(u => u.role === "counselor").map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowAssignCounselorModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => handleManualAssign(selectedUserId, selectedCounselorId)}
                >
                  Save Assignment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
