import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";
import { 
  Users, 
  Activity, 
  Shield, 
  Settings, 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  LogOut,
  Mail,
  Home
} from "lucide-react";
import { User, CheckIn } from "../types";

interface AdminStats {
  users: {
    total: number;
    students: number;
    counselors: number;
  };
  checkIns: {
    total: number;
    open: number;
    last7Days: number;
  };
}

interface InstitutionRequest {
  _id: string;
  institutionName: string;
  contactEmail: string;
  domain: string;
  message: string;
  status: 'pending' | 'fulfilled';
  assignedCounselorId?: User;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showCreateCounselor, setShowCreateCounselor] = useState<boolean>(false);
  const [counselorForm, setCounselorForm] = useState({ name: "", email: "", password: "" });
  const [logs, setLogs] = useState<CheckIn[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [instRequests, setInstRequests] = useState<InstitutionRequest[]>([]);
  const [loadingInst, setLoadingInst] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("stats"); // stats, users, connections
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [selectedInstReq, setSelectedInstReq] = useState<InstitutionRequest | null>(null);
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>("");
  const [showAssignCounselorModal, setShowAssignCounselorModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMsg("User removed successfully.");
      fetchStats();
      fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to remove user");
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setMsg(`User role updated to ${newRole}.`);
      fetchStats();
      fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update role");
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get("/admin/logs");
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
      const res = await api.get("/admin/institution-requests");
      setInstRequests(res.data);
    } catch (err) {
      console.error("Failed to load institution requests", err);
    } finally {
      setLoadingInst(false);
    }
  };

  const handleFulfillRequest = async (requestId: string, counselorId: string) => {
    try {
      await api.post(`/admin/institution-requests/${requestId}/fulfill`, { counselorId });
      setMsg("Institution request fulfilled and students connected.");
      fetchInstRequests();
      fetchUsers();
      setShowConnectModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fulfill request");
    }
  };

  const handleManualAssign = async (studentId: string, counselorId: string) => {
    try {
      await api.post(`/admin/users/${studentId}/assign-counselor`, { counselorId });
      setMsg("Counselor assigned to student.");
      fetchUsers();
      setShowAssignCounselorModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to assign counselor");
    }
  };

  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/counselors", counselorForm);
      setMsg("Counselor account created successfully.");
      setShowCreateCounselor(false);
      setCounselorForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create counselor");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchLogs();
    fetchInstRequests();
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-main pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <header className="border-b border-border-light bg-surface/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Admin Console</h1>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Master Control • {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-canvas border border-border-light rounded-xl p-1 hidden lg:flex mr-4 shadow-inner">
              {[
                { id: "stats", label: "Overview", icon: Activity },
                { id: "users", label: "Users", icon: Users },
                { id: "connections", label: "Registry", icon: LinkIcon }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-white shadow-md text-primary" : "text-text-muted hover:text-text-main"}`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchUsers(); fetchLogs(); fetchInstRequests(); }}>
              <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreateCounselor(true)} className="hidden sm:flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> New Staff
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-status-error hover:bg-status-error/5">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Mobile Tab Nav */}
        <div className="lg:hidden mb-8 grid grid-cols-3 gap-2">
            {['stats', 'users', 'connections'].map(t => (
                <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === t ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-surface border-border-light text-text-muted"}`}
                >
                    {t}
                </button>
            ))}
        </div>

        {/* Alerts */}
        {msg && (
          <Card className="mb-8 border-l-4 border-l-status-success bg-status-success/5 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-status-success">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-bold">{msg}</p>
            </div>
          </Card>
        )}
        {error && (
          <Card className="mb-8 border-l-4 border-l-status-error bg-status-error/5 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-status-error">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          {activeTab === "stats" && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Stats Section */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform">
                    <Activity className="w-20 h-20" />
                  </div>
                  <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-6">Network Vitality</h2>

                  {loadingStats ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-canvas rounded-2xl"></div>
                      ))}
                    </div>
                  ) : stats ? (
                    <div className="grid gap-4">
                      <div className="bg-canvas border border-border-light p-5 rounded-2xl shadow-inner group-hover:border-primary/20 transition-colors">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Global Roster</p>
                        <p className="text-4xl font-black mt-1 text-text-main">{stats.users.total}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <Badge variant="info">{stats.users.students} Students</Badge>
                            <Badge variant="neutral">{stats.users.counselors} Counselors</Badge>
                        </div>
                      </div>

                      <div className="bg-canvas border border-border-light p-5 rounded-2xl shadow-inner group-hover:border-secondary/20 transition-colors">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Pulse</p>
                        <p className="text-4xl font-black mt-1 text-text-main">{stats.checkIns.total}</p>
                        <p className="text-xs font-bold text-status-warning mt-3 flex items-center gap-1.5">
                          <Activity className="w-3 h-3" />
                          {stats.checkIns.open} awaiting review
                        </p>
                      </div>

                      <div className="bg-canvas border border-border-light p-5 rounded-2xl shadow-inner">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">7D Velocity</p>
                        <p className="text-4xl font-black mt-1 text-text-main">{stats.checkIns.last7Days}</p>
                        <p className="text-xs font-bold text-text-muted mt-3">New signals this cycle</p>
                      </div>
                    </div>
                  ) : null}
                </Card>

                {/* Audit Log */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-secondary/5 rotate-12">
                        <Settings className="w-16 h-16" />
                    </div>
                  <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-6">Audit Trail</h2>
                  {loadingLogs ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-canvas rounded-2xl"></div>)}
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border-light rounded-2xl">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No recent audit data</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logs.slice(0, 5).map((log) => (
                        <div key={log._id} className="p-4 bg-canvas border border-border-light rounded-2xl hover:border-secondary/20 transition-colors group cursor-default">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-text-main truncate">{ (log.userId as any)?.name || "Patient Zero"}</p>
                              <p className="text-[10px] font-bold text-text-muted mt-0.5">
                                Verified by <span className="text-secondary">{(log.reviewedBy as any)?.name || "Admin"}</span>
                              </p>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-status-success shrink-0 mt-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Main Activity Area */}
              <div className="lg:col-span-2">
                 <Card className="h-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-black text-text-main uppercase tracking-tight">Active User Registry</h2>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Cross-domain authorization management</p>
                        </div>
                        <Badge variant="info" className="px-4 py-1.5">{users.length} Records</Badge>
                    </div>

                    {loadingUsers ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-canvas rounded-2xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="divide-y divide-border-light">
                            {users.map(u => (
                                <div key={u.id || (u as any)._id} className="py-5 first:pt-0 last:pb-0 group hover:bg-canvas/50 transition-colors -mx-2 px-2 rounded-xl">
                                    <div className="flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {u.name?.charAt(0) || "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-black text-text-main truncate">{u.name || "Ghost Record"}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail className="w-3 h-3 text-text-muted" />
                                                    <p className="text-xs font-bold text-text-muted truncate">{u.email}</p>
                                                </div>
                                                {u.role === "student" && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center gap-1.5 bg-canvas px-2 py-1 rounded-lg border border-border-light shadow-inner">
                                                            <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">Lineage:</span>
                                                            { (u as any).assignedCounselor ? (
                                                                <span className="text-[10px] text-primary font-black uppercase tracking-wider">{(u as any).assignedCounselor.name}</span>
                                                            ) : (
                                                                <span className="text-[10px] text-text-muted italic font-bold">Unmapped</span>
                                                            )}
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedUserId(u.id || (u as any)._id);
                                                                    setSelectedCounselorId((u as any).assignedCounselor?._id || "");
                                                                    setShowAssignCounselorModal(true);
                                                                }}
                                                                className="text-primary hover:text-primary-dark transition-colors"
                                                            >
                                                                <Settings className="w-3.5 h-3.5 ml-1" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleUpdateRole(u.id || (u as any)._id, e.target.value)}
                                                    disabled={(u.id || (u as any)._id) === user?.id}
                                                    className="appearance-none text-[10px] font-black uppercase tracking-widest bg-canvas border border-border-light rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50 transition-all cursor-pointer shadow-sm hover:border-primary/20"
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="counselor">Counselor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                </div>
                                            </div>

                                            {(u.id || (u as any)._id) !== user?.id && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id || (u as any)._id)}
                                                    className="p-2.5 text-status-error hover:bg-status-error/10 rounded-xl transition-all shadow-sm border border-transparent hover:border-status-error/20"
                                                    title="Erase Record"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
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
          )}

          {activeTab === "connections" && (
            <Card className="animate-in slide-in-from-right-8 duration-500">
               <div className="flex items-center justify-between mb-8 overflow-hidden relative p-1">
                <div className="absolute top-0 right-0 p-8 text-primary/5 -rotate-12 translate-x-12 -translate-y-12">
                   <LinkIcon className="w-48 h-48" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter">Institutional Registry</h2>
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">Cross-domain counselor-student bridge</p>
                </div>
              </div>

              {loadingInst ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map(i => <div key={i} className="h-44 bg-canvas rounded-3xl animate-pulse border border-border-light" />)}
                </div>
              ) : instRequests.length === 0 ? (
                <div className="text-center py-24 border-4 border-dashed border-border-light rounded-[32px] bg-canvas/30">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Home className="w-10 h-10 text-text-muted opacity-20" />
                  </div>
                  <h3 className="text-lg font-black text-text-main uppercase tracking-tight">Registry Neutral</h3>
                  <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-1">Incoming domain links: 0</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {instRequests.map(req => (
                    <Card key={req._id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 bg-surface border-border-light hover:border-primary/30">
                      <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-all duration-500 ${req.status === 'fulfilled' ? 'bg-status-success' : 'bg-status-warning shadow-[0_0_12px_rgba(var(--status-warning),0.4)]'}`} />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="min-w-0">
                            <h3 className="font-black text-xl text-text-main truncate tracking-tighter uppercase">{req.institutionName}</h3>
                            <div className="inline-flex mt-2 px-2 py-0.5 bg-canvas border border-border-light rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                                @{req.domain}
                            </div>
                        </div>
                        <Badge variant={req.status === "fulfilled" ? "success" : "warning"} className="tracking-widest px-3">
                          {req.status}
                        </Badge>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-text-body">
                          <Mail className="w-4 h-4 text-text-muted" />
                          <span className="text-xs font-bold truncate">{req.contactEmail}</span>
                        </div>
                        <div className="p-4 bg-canvas rounded-2xl border border-border-light text-xs font-medium italic leading-relaxed text-text-muted relative min-h-[64px]">
                            <div className="absolute top-1 right-2 opacity-5 font-black text-4xl">"</div>
                            {req.message}
                        </div>
                      </div>
                      
                      {req.status === "pending" ? (
                        <Button 
                          className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn"
                          onClick={() => {
                            setSelectedInstReq(req);
                            setShowConnectModal(true);
                          }}
                        >
                          Establish Bridge <LinkIcon className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                        </Button>
                      ) : (
                        <div className="bg-status-success/5 p-4 rounded-2xl border border-status-success/10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-status-success uppercase tracking-widest mb-1">Stationed Counselor</p>
                            <p className="text-sm font-black text-text-main">{req.assignedCounselorId?.name || "Ghost Record"}</p>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-status-success/10 flex items-center justify-center text-status-success border border-status-success/10">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === "users" && (
             <div className="space-y-6">
                {/* This is handled by the unified list in the stats view for common layouts, 
                    but could be dedicated here with more advanced filters */}
             </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showCreateCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 border-t-8 border-t-primary shadow-2xl">
            <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-6 flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-primary" /> New Counselor
            </h2>
            <form onSubmit={handleCreateCounselor} className="space-y-5">
              <Input
                label="Identity Profile (Full Name)"
                placeholder="Full operational name"
                value={counselorForm.name}
                onChange={(e) => setCounselorForm({ ...counselorForm, name: e.target.value })}
                required
              />
              <Input
                label="System Identifier (Email)"
                type="email"
                placeholder="counselor@institution.edu"
                value={counselorForm.email}
                onChange={(e) => setCounselorForm({ ...counselorForm, email: e.target.value })}
                required
              />
              <Input
                label="Security Override (Password)"
                type="password"
                placeholder="••••••••"
                value={counselorForm.password}
                onChange={(e) => setCounselorForm({ ...counselorForm, password: e.target.value })}
                required
              />
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setShowCreateCounselor(false)}>
                  Abort
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                  Provision Account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-md border-t-8 border-t-secondary shadow-2xl">
            <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2">Establish Bridge</h2>
            <p className="text-xs font-bold text-text-muted mb-8 uppercase tracking-widest">
              Mapping students of <strong className="text-primary">{selectedInstReq?.institutionName}</strong>
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Select Lead Counselor</label>
                <select 
                  className="w-full bg-canvas border border-border-light rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary shadow-inner appearance-none transition-all"
                  value={selectedCounselorId}
                  onChange={(e) => setSelectedCounselorId(e.target.value)}
                >
                  <option value="" className="font-bold">Select Active Staff Member</option>
                  {users.filter(u => u.role === "counselor").map(c => (
                    <option key={c.id || (c as any)._id} value={c.id || (c as any)._id} className="font-bold">{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border-light/50">
                <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setShowConnectModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-2xl bg-secondary hover:bg-secondary-dark font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20"
                  disabled={!selectedCounselorId}
                  onClick={() => handleFulfillRequest(selectedInstReq?._id || "", selectedCounselorId)}
                >
                  Confirm Mapping
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showAssignCounselorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-md border-t-8 border-t-primary shadow-2xl">
            <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-8">Node Alignment</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Target Account Counselor</label>
                <select 
                  className="w-full bg-canvas border border-border-light rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-inner appearance-none transition-all"
                  value={selectedCounselorId}
                  onChange={(e) => setSelectedCounselorId(e.target.value)}
                >
                  <option value="" className="font-bold text-status-error">Unassign / Neutral State</option>
                  {users.filter(u => u.role === "counselor").map(c => (
                    <option key={c.id || (c as any)._id} value={c.id || (c as any)._id} className="font-bold">{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border-light/50">
                <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAssignCounselorModal(false)}>
                  Abort
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10"
                  onClick={() => handleManualAssign(selectedUserId || "", selectedCounselorId)}
                >
                  Update Registry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
