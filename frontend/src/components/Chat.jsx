import React, { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

const socket = io((import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", ""));

export default function Chat({ currentUser, recipient }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Dynamic room naming: Institutional or Private
    const email = currentUser?.email || "";
    const domain = email.includes("@") ? email.split("@")[1] : "global";

    const room = useMemo(() => {
        if (!recipient) return `chat_${domain}`;
        // Consistent private room naming: private_minID_maxID
        const ids = [currentUser?._id, recipient._id].sort();
        return `private_${ids[0]}_${ids[1]}`;
    }, [currentUser, recipient, domain]);

    useEffect(() => {
        if (recipient) {
            setIsOpen(true);
        }
    }, [recipient]);

    useEffect(() => {
        if (!room) return;

        setMessages([]); // Clear messages when switching rooms
        console.log(`Joining chat room: ${room}`);
        socket.emit("join-room", room);

        socket.on("receive-message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, [room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const msgData = {
            roomId: room,
            sender: currentUser?.name || "Anonymous",
            senderId: currentUser?._id || "anon",
            message: input,
            timestamp: new Date().toLocaleTimeString(),
        };

        socket.emit("send-message", msgData);
        setInput("");
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="flex flex-col h-[500px] shadow-2xl overflow-hidden border-primary/20 bg-white/95 backdrop-blur-sm">
                <div className="bg-primary p-4 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider">
                            {recipient ? `Chat with ${recipient.name}` : "Institutional Chat"}
                        </h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.length === 0 && (
                        <p className="text-center text-slate-400 text-sm py-10 italic">
                            {recipient
                                ? `Start a private conversation with ${recipient.name}.`
                                : "Questions? We're here to help in real-time."
                            }
                        </p>
                    )}
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex flex-col ${msg.senderId === currentUser?._id ? "items-end" : "items-start"}`}
                        >
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{msg.sender}</span>
                                <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                            </div>
                            <div
                                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.senderId === currentUser?._id
                                    ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/20"
                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-white shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white p-2 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
