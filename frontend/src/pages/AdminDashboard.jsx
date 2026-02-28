import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [msg, setMsg] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    setMsg("");
    try {
      const res = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setMsg("");
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AESP</h1>
            <p className="text-sm text-slate-400">
              Admin Dashboard • Welcome, {user?.name || "Admin"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchStats();
                fetchUsers();
              }}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
            <h2 className="text-base font-semibold">System Stats</h2>
            <p className="mt-1 text-sm text-slate-400">
              High-level overview of portal activity.
            </p>

            {loadingStats && (
              <p className="mt-4 text-sm text-slate-400">Loading stats…</p>
            )}

            {!loadingStats && stats && (
              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-400">Total Users</p>
                  <p className="mt-1 text-2xl font-bold">{stats.users.total}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Students: {stats.users.students} • Counselors:{" "}
                    {stats.users.counselors} • Admins: {stats.users.admins}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-400">Total Check-ins</p>
                  <p className="mt-1 text-2xl font-bold">{stats.checkIns.total}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Open: {stats.checkIns.open} • Reviewed: {stats.checkIns.reviewed}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-400">Last 7 days</p>
                  <p className="mt-1 text-2xl font-bold">{stats.checkIns.last7Days}</p>
                  <p className="mt-2 text-xs text-slate-500">Recent check-ins</p>
                </div>
              </div>
            )}
          </div>

          {msg && (
            <div className="rounded-2xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-200">
              {msg}
            </div>
          )}
        </div>

        {/* Users */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
            <h2 className="text-base font-semibold">Users</h2>
            <p className="mt-1 text-xs text-slate-400">
              All registered accounts (password hidden).
            </p>

            {loadingUsers && (
              <p className="mt-4 text-sm text-slate-400">Loading users…</p>
            )}

            {!loadingUsers && users.length === 0 && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="text-sm text-slate-300">No users found.</p>
              </div>
            )}

            <div className="mt-4 grid gap-3">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {u.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <span className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300">
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-xs font-semibold text-slate-300">Next upgrades</p>
              <p className="mt-1 text-xs text-slate-400">
                Add admin actions: change roles, disable accounts, export reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
