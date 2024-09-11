import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import io, { Socket } from "socket.io-client";
import { settings } from "@/settings";

interface SocketData {
  status: string | null;
  command: string | null;
  data: Record<string, any> | null;
  error: Record<string, any> | null;
}

interface SocketState {
  socket: Socket | null;
  isConnecting: boolean;
  isConnected: boolean;
  data: SocketData;
}

interface WebSocketContextType {
  getSocketState: (id: string) => SocketState;
  connectSocket: (id: string) => void;
  disconnectSocket: (id: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

const INITIAL_SOCKET_STATE: SocketState = {
  socket: null,
  isConnecting: false,
  isConnected: false,
  data: { status: null, command: null, data: null, error: null },
};

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [socketStates, setSocketStates] = useState<Record<string, SocketState>>(
    {},
  );
  const socketUrl =
    settings.API.CMS.ENDPOINT.PUBLIC.SOCKETS || "http://127.0.0.1:20110/audit";

  const updateSocketState = useCallback(
    (id: string, newState: Partial<SocketState>) => {
      setSocketStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...newState },
      }));
    },
    [],
  );

  const connectSocket = useCallback(
    (id: string) => {
      if (socketStates[id]?.isConnecting || socketStates[id]?.isConnected)
        return;

      updateSocketState(id, { isConnecting: true });

      const newSocket = io(socketUrl, {
        transports: ["websocket"],
        query: { id_work: id },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log(`${id} socket connected successfully`);
        updateSocketState(id, { isConnecting: false, isConnected: true });
      });

      newSocket.on("disconnect", (reason) => {
        console.log(`${id} socket disconnected:`, reason);
        updateSocketState(id, { isConnected: false });
      });

      newSocket.on("update", (payload) => {
        updateSocketState(id, {
          data: {
            ...socketStates[id].data,
            status: payload.status,
            command: payload.command,
          },
        });
      });

      newSocket.on("error", (payload) => {
        updateSocketState(id, {
          data: {
            ...socketStates[id].data,
            status: payload.status,
            error: payload.error,
            command: null,
          },
        });
      });

      newSocket.on("interruption", (payload) => {
        updateSocketState(id, {
          data: {
            ...socketStates[id].data,
            status: payload.status,
            command: null,
          },
        });
      });

      newSocket.on("success", (payload) => {
        updateSocketState(id, {
          data: {
            ...socketStates[id].data,
            status: payload.status,
            data: { ...payload.data, command: payload.command },
            command: null,
          },
        });
      });

      updateSocketState(id, { socket: newSocket });
    },
    [socketUrl, socketStates, updateSocketState],
  );

  const disconnectSocket = useCallback(
    (id: string) => {
      const socketState = socketStates[id];
      if (socketState?.socket) {
        socketState.socket.disconnect();
        updateSocketState(id, { ...INITIAL_SOCKET_STATE });
      }
    },
    [socketStates, updateSocketState],
  );

  const getSocketState = useCallback(
    (id: string) => {
      return socketStates[id] || INITIAL_SOCKET_STATE;
    },
    [socketStates],
  );

  const contextValue = useMemo(
    () => ({
      getSocketState,
      connectSocket,
      disconnectSocket,
    }),
    [getSocketState, connectSocket, disconnectSocket],
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (id: string) => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  const { getSocketState, connectSocket, disconnectSocket } = context;

  useEffect(() => {
    connectSocket(id);
    return () => {
      disconnectSocket(id);
    };
  }, [id, connectSocket, disconnectSocket]);

  return getSocketState(id);
};
