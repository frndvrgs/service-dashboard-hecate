import { useState, useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";

import { settings } from "@/settings";

export function useWebSocket(id: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [command, setCommand] = useState<
    "dump_source_code" | "analyze_source_code" | "analyze_pull_request" | null
  >(null);
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<Record<string, any> | null>(null);

  const socketUrl =
    settings.API.CMS.ENDPOINT.PUBLIC.SOCKETS || "http://127.0.0.1:20110/audit";

  const connectSocket = useCallback(() => {
    if (!id) return null;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      query: { id_work: id },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("socket connected successfully");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("socket disconnected:", reason);
    });

    newSocket.on("update", (payload) => {
      console.log(
        `${id} socket status: update`,
        payload.status,
        payload.command,
      );
      setStatus(payload.status);
      setCommand(payload.command);
    });

    newSocket.on("error", (payload) => {
      console.log(`${id} socket status: error`, payload.error);
      setStatus(payload.status);
      setError(payload.error);
      setCommand(null);
    });

    newSocket.on("interruption", (payload) => {
      console.log(`${id} socket status: interruption`, payload.status);
      setStatus(payload.status);
      setCommand(null);
    });

    newSocket.on("success", (payload) => {
      console.log(`${id} socket status: success`, payload.status, payload);
      setStatus(payload.status);
      setData({ ...payload.data, command: payload.command });
      setCommand(null);
    });

    return newSocket;
  }, [id, socketUrl]);

  useEffect(() => {
    const newSocket = connectSocket();
    if (newSocket) {
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [connectSocket]);

  return { socket, command, status, data, error };
}
