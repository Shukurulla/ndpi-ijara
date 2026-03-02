"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth.store";
import type { TutorChatData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function TutorChatScreenPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { tutorId, init } = useAuthStore();
  const { joinRoom, sendMessage, onMessage } = useSocket();
  const [messages, setMessages] = useState<TutorChatData[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (groupId) {
      joinRoom(groupId);
      mainService.getTutorChat(groupId)
        .then((res) => setMessages(res.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [groupId, joinRoom]);

  useEffect(() => {
    const unsub = onMessage((data) => {
      setMessages((prev) => [...prev, {
        _id: Date.now().toString(),
        group: data.groupId,
        message: data.message,
        tutorId: data.tutorId,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
      }]);
    });
    return unsub;
  }, [onMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !tutorId) return;
    sendMessage(groupId, input.trim(), tutorId);
    setMessages((prev) => [...prev, {
      _id: Date.now().toString(),
      group: groupId,
      message: input.trim(),
      tutorId: tutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
    setInput("");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await mainService.deleteTutorChat(deleteId);
      setMessages((prev) => prev.filter((m) => m._id !== deleteId));
    } catch (err) {
      console.error(err);
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Chat" />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {loading ? <Loading /> : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.tutorId === tutorId;
              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      isMine
                        ? "header-gradient text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (isMine) setDeleteId(msg._id);
                    }}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 4096))}
            placeholder="Xabar yozing..."
            className="input-field flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 header-gradient rounded-full flex items-center justify-center disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{input.length}/4096</p>
      </div>

      {deleteId && (
        <ConfirmDialog
          title="Xabarni o'chirish"
          message="Bu xabarni o'chirmoqchimisiz?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmText="O'chirish"
          cancelText="Bekor"
        />
      )}
    </div>
  );
}
