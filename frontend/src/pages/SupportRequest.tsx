import React, { useEffect, useState, FormEvent } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Input from "../components/Input";
import { MessageSquare, Send, Clock, Trash2, ChevronLeft } from "lucide-react";
import { SupportRequest as SupportRequestType } from "../types";

type ViewMode = 'list' | 'create' | 'detail';

export default function SupportRequest() {
  const { user } = useAuth();

  const isStudent = user?.role === "student";
  const isCounselor = user?.role === "counselor";

  // View state
  const [view, setView] = useState<ViewMode>('list');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequestType | null>(null);

  // Form state
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  // Data state
  const [items, setItems] = useState<SupportRequestType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (isStudent) {
        res = await api.get("/support/my");
      } else if (isCounselor) {
        res = await api.get("/support");
      }
      setItems(res?.data || []);
    } catch (err) {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStudent || isCounselor) {
      fetchData();
    }
  }, [isStudent, isCounselor]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/support", { subject, message, anonymous });
      setSuccessMsg("Request submitted successfully.");
      setSubject("");
      setMessage("");
      setAnonymous(false);
      setView('list');
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit request.");
    }
  };

  const handleReply = async () => {
    if (!selectedRequest) return;
    try {
      await api.put(
        `/support/${selectedRequest._id}/respond`,
        { counselorReply: replyText }
      );
      setSuccessMsg("Response sent.");
      setReplyText("");
      fetchData();
      setView('list');
    } catch (err) {
      setError("Failed to send response.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this support request?")) return;

    try {
      await api.delete(`/support/${id}`);
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

  const openDetail = (request: SupportRequestType) => {
    setSelectedRequest(request);
    setReplyText(request.counselorReply || "");
    setView('detail');
  };

  const getStatusBadge = (status: string, hasReply: boolean) => {
    if (status === 'responded' || hasReply) return <Badge variant="success">Responded</Badge>;
    if (status === 'seen') return <Badge variant="info">Seen</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
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
        <div className="flex gap-3">
          {view !== 'list' && (
            <Button variant="ghost" onClick={() => setView('list')} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          )}
          {isStudent && view === 'list' && (
            <Button onClick={() => setView('create')} className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> New Request
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 text-status-error rounded-xl border border-status-error/20">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-status-success/10 text-status-success rounded-xl border border-status-success/20">
          {successMsg}
        </div>
      )}

      {/* VIEW: CREATE */}
      {view === 'create' && isStudent && (
        <Card className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-text-main mb-6">New Support Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main">Message</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface text-text-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[160px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your situation in detail..."
                required
              />
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-text-main">Submit anonymously</span>
              </label>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full">Send Request</Button>
            </div>
          </form>
        </Card>
      )}

      {/* VIEW: LIST */}
      {view === 'list' && (
        <div className="grid gap-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-28 bg-surface animate-pulse rounded-2xl" />)}
            </div>
          ) : items.length === 0 ? (
            <Card className="text-center py-16">
              <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-text-main">No requests found</h3>
              <p className="text-text-muted mt-1 max-w-sm mx-auto">
                {isStudent ? "You haven't submitted any support requests yet." : "You have no pending requests in your inbox."}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {items.map(item => (
                <Card 
                  key={item._id} 
                  className="cursor-pointer hover:shadow-md transition-all group" 
                  onClick={() => openDetail(item)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-text-main truncate">{item.subject}</h3>
                      </div>
                      <p className="text-xs text-text-muted flex items-center gap-2">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium text-text-body">{item.anonymous ? "Anonymous" : (item as any).studentId?.name || "Student"}</span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(item.status, !!item.counselorReply)}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end gap-4">
                    <p className="text-sm text-text-body line-clamp-1 italic text-text-muted">"{item.message}"</p>
                    {isStudent && item.status === 'pending' && (
                      <button
                        className="p-2 text-status-error hover:bg-status-error/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleDelete(e, item._id)}
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: DETAIL */}
      {view === 'detail' && selectedRequest && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Metadata */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Request Intel</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-text-muted mb-1.5 uppercase font-bold">Current Status</p>
                  {getStatusBadge(selectedRequest.status, !!selectedRequest.counselorReply)}
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase font-bold">Submitted On</p>
                  <p className="text-sm font-bold text-text-main">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase font-bold">From Student</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {selectedRequest.anonymous ? "?" : ((selectedRequest as any).studentId?.name?.[0] || "S")}
                    </div>
                    <p className="text-sm font-bold text-text-main">{selectedRequest.anonymous ? "Anonymity Active" : (selectedRequest as any).studentId?.name || "Student"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Message Flow */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text-main px-1">Conversation</h2>
              {/* Student Thread */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {selectedRequest.anonymous ? "?" : ((selectedRequest as any).studentId?.name?.[0] || "S")}
                </div>
                <div className="bg-surface border border-border-light rounded-2xl rounded-tl-none p-5 shadow-sm max-w-[90%]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-text-main">{selectedRequest.subject}</span>
                  </div>
                  <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Counselor Response */}
              {(selectedRequest.counselorReply || selectedRequest.status === 'responded') && (
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-sm font-bold text-secondary shrink-0">
                    C
                  </div>
                  <div className="bg-secondary/5 border border-secondary/20 rounded-2xl rounded-tr-none p-5 shadow-sm max-w-[90%]">
                    <p className="text-xs font-bold text-secondary mb-2 uppercase tracking-widest">Counselor Response</p>
                    <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">{selectedRequest.counselorReply || "Handled successfully."}</p>
                  </div>
                </div>
              )}

              {/* Waiting Indicator */}
              {isStudent && !selectedRequest.counselorReply && (
                <div className="flex justify-center p-8">
                  <div className="flex flex-col items-center gap-3 text-text-muted">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-widest">Waiting for counselor</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar for Counselors */}
            {isCounselor && selectedRequest.status !== 'responded' && !selectedRequest.counselorReply && (
              <Card className="mt-12 border-t-4 border-t-secondary">
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-secondary" /> Write a Response
                </h3>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-border-light bg-canvas text-text-body focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none min-h-[140px] mb-4"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide helpful guidance or a plan of action..."
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleReply} 
                    disabled={!replyText.trim()}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    Send Final Response
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
