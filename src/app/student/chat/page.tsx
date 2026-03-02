"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";

interface ChatMessage {
  message: string;
  tutorId: string;
  groupId: string;
  createdAt: string;
}

export default function StudentChatPage() {
  const { studentGroupId, studentId } = useAuthStore();
  const { joinRoom, onMessage } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  useEffect(() => {
    if (studentGroupId) {
      joinRoom(studentGroupId);
    }
  }, [studentGroupId, joinRoom]);

  useEffect(() => {
    const unsub = onMessage((data) => {
      setMessages((prev) => [...prev, data]);
    });
    return unsub;
  }, [onMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Chat" />
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Hozircha xabar yo'q
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.tutorId ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  msg.tutorId
                    ? "bg-white border border-gray-200 rounded-tl-none"
                    : "header-gradient text-white rounded-tr-none"
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.tutorId ? "text-gray-400" : "text-white/60"
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
