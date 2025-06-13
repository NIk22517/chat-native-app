import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface UseSocketOptions {
  reconnect?: boolean;
}

const baseURL = `ws://192.168.1.34:8080/api/message/live/`;

export const useSocket = ({ reconnect = true }: UseSocketOptions = {}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { auth } = useAuthStore();

  useEffect(() => {
    if (!auth?.id) return;

    const ws = new WebSocket(`${baseURL}${auth.id}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected!");
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected.");
      if (reconnect) {
        setTimeout(() => {
          console.log("Reconnecting WebSocket...");
          setSocket(new WebSocket(`${baseURL}${auth.id}`));
        }, 3000);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [auth]);

  return { socket, isConnected };
};
