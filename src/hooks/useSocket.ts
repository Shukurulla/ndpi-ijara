import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/utils/constants";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinRoom = useCallback((groupId: string) => {
    socketRef.current?.emit("joinRoom", groupId);
  }, []);

  const sendMessage = useCallback(
    (groupId: string, message: string, tutorId: string) => {
      socketRef.current?.emit("sendMessage", { groupId, message, tutorId });
    },
    []
  );

  const onMessage = useCallback(
    (callback: (data: { message: string; tutorId: string; groupId: string; createdAt: string }) => void) => {
      socketRef.current?.on("receiveMessage", callback);
      return () => {
        socketRef.current?.off("receiveMessage", callback);
      };
    },
    []
  );

  return { joinRoom, sendMessage, onMessage, socket: socketRef };
}
