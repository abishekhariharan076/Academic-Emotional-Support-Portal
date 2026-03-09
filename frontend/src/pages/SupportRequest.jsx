import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import NotifBadge from "../components/NotifBadge";
import { countUnseen, markManySeen } from "../utils/seenStore";

export default function SupportRequest() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const isStudent = user?.role === "student";
  const isCounselor = user?.role === "counselor";

  // View state: 'list', 'create', 'detail'
  const [view, setView] = useState('list');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Data state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (isStudent) {
        res = await api.get("/support/my", { headers: { Authorization: `Bearer ${token}` } });
      } else if (isCounselor) {
        res = await api.get("/support", { headers: { Authorization: `Bearer ${token}` } });
      }
      setItems(res?.data || []);
    } catch (err) {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isStudent, isCounselor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/support", { subject, message, anonymous }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccessMsg("Request submitted successfully.");
      setSubject("");
      setMessage("");
      setAnonymous(false);
      setView('list');
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request.");
    }
  };

  const handleReply = async () => {
    if (!selectedRequest) return;
    try {
      await api.put(
        `/support/${selectedRequest._id}/respond`,
        { counselorReply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Response sent.");
      setReplyText("");
      fetchData(); // Refresh list to get updated status
      // We might want to keep the detail view open but updated.
      // For now, let's go back to list or stay in detail with updated item?
      // Updating item locally is tricky without full refresh.
      // Let's close for simplicity or re-fetch.
      setView('list');
    } catch (err) {
      setError("Failed to send response.");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening detail view
    if (!window.confirm("Are you sure you want to delete this support request?")) return;

    try {
      await api.delete(`/support/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems((prev) => prev.filter((item) => item._id !== id));
      setSuccessMsg("Request deleted successfully.");
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(null);
        setView('list');
      }
    } catch (err) {
      setError("Failed to delete request.");
    }
  };

  const openDetail = (request) => {
    setSelectedRequest(request);
    setReplyText(request.counselorReply || "");
    setView('detail');
  };

  // Status Badge Helper
  const getStatusBadge = (status, hasReply) => {
    if (status === 'responded' || hasReply) return <Badge variant="success">Responded</Badge>;
    if (status === 'seen') return <Badge variant="info">Seen</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            {isStudent ? "Support Requests" : "Inbox"}
          </h1>
          <p className="text-text-body">
            {isStudent ? "Get guidance from campus counselors." : "Manage student support requests."}
          </p>
        </div>
        <div className="flex gap-2">
          {view !== 'list' && (
            <Button variant="ghost" onClick={() => setView('list')}>
              Back to List
            </Button>
          )}
          {isStudent && view === 'list' && (
            <Button onClick={() => setView('create')}>New Request</Button>
          )}
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-status-error rounded-xl">{error}</div>}
      {successMsg && <div className="p-4 bg-green-50 text-status-success rounded-xl">{successMsg}</div>}

      {/* VIEW: CREATE */}
      {view === 'create' && isStudent && (
        <Card className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">New Support Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Message</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-text-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your situation..."
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anon"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="anon" className="text-sm text-text-body">Submit anonymously</label>
            </div>
            <div className="pt-2">
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Card>
      )}

      {/* VIEW: LIST */}
      {view === 'list' && (
        <div className="grid gap-4">
          {loading ? <p>Loading...</p> : items.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-text-muted">No requests found.</p>
            </Card>
          ) : (
            items.map(item => (
              <Card key={item._id} className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary" onClick={() => openDetail(item)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-text-main">{item.subject}</h3>
                    <p className="text-sm text-text-muted">
                      {new Date(item.createdAt).toLocaleDateString()} • {item.anonymous ? "Anonymous" : item.studentId?.name || "Student"}
                    </p>
                  </div>
                  {getStatusBadge(item.status, item.counselorReply)}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-text-body line-clamp-2">{item.message}</p>
                  {isStudent && item.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                      onClick={(e) => handleDelete(e, item._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* VIEW: DETAIL */}
      {view === 'detail' && selectedRequest && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Metadata */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <h3 className="text-sm font-bold text-text-muted uppercase mb-3">Request Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Status</p>
                  {getStatusBadge(selectedRequest.status, selectedRequest.counselorReply)}
                </div>
                <div>
                  <p className="text-xs text-text-muted">Date</p>
                  <p className="text-sm font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Student</p>
                  <p className="text-sm font-medium">{selectedRequest.anonymous ? "Anonymous" : selectedRequest.studentId?.name || "Student"}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Conversation */}
          <div className="md:col-span-2 space-y-6">
            {/* Student Message Bubble */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {selectedRequest.anonymous ? "?" : (selectedRequest.studentId?.name?.[0] || "S")}
              </div>
              <div className="bg-white border border-border-light rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[90%]">
                <p className="text-text-body">{selectedRequest.message}</p>
              </div>
            </div>

            {/* Counselor Reply Bubble (if exists) */}
            {(selectedRequest.counselorReply || selectedRequest.status === 'responded') && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                  C
                </div>
                <div className="bg-secondary/5 border border-secondary/20 rounded-2xl rounded-tr-none p-4 shadow-sm max-w-[90%]">
                  <p className="text-xs font-bold text-secondary mb-1">Counselor Response</p>
                  <p className="text-text-body">{selectedRequest.counselorReply || "No text content."}</p>
                </div>
              </div>
            )}

            {/* Reply Action (Counselor Only) */}
            {isCounselor && selectedRequest.status !== 'responded' && !selectedRequest.counselorReply && (
              <Card className="mt-8">
                <h3 className="font-bold mb-2">Write a Response</h3>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-text-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none mb-3"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleReply}>Send Response</Button>
                </div>
              </Card>
            )}

            {isStudent && !selectedRequest.counselorReply && (
              <div className="text-center p-6 bg-canvas rounded-xl">
                <p className="text-text-muted">Waiting for a counselor to respond...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
