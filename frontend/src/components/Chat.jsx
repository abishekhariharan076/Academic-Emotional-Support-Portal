import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api";
import Button from "./Button";
import Input from "./Input";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export default function Chat({ supportRequestId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const scrollRef = useRef(null);

  useEffect(() => {
    // Join room
    socket.emit("join-room", supportRequestId);

    // Fetch history
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/support/${supportRequestId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // Listen for messages
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
      // socket.emit("leave-room", supportRequestId); // Optional
    };
  }, [supportRequestId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msgData = {
      roomId: supportRequestId,
      sender: user.name,
      senderId: user.id,
      domain: user.domain,
      message: text,
    };

    socket.emit("send-message", msgData);
    setText("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div>
          <h3 className="font-bold text-white">Live Support</h3>
          <p className="text-xs text-white/60">Institutional Chat • Secure</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full text-white/40 italic">
            Loading history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 italic text-center px-8">
            Start a conversation with your {user.role === "student" ? "counselor" : "student"}.
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId?._id === user.id || msg.senderId === user.id;
            return (
              <div 
                key={idx} 
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  isMe 
                    ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20" 
                    : "bg-white/10 text-white border border-white/5 rounded-tl-none"
                }`}>
                  {!isMe && (
                    <p className="text-[10px] font-bold mb-1 opacity-60 uppercase tracking-wider">
                      {msg.senderId?.name || msg.sender}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text || msg.message}</p>
                </div>
                <span className="text-[10px] text-white/30 mt-1 px-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer */}
      <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
        />
        <Button 
          type="submit" 
          variant="primary" 
          size="sm"
          className="rounded-xl px-4"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
