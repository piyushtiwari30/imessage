import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user) => {
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL, {
        query: {
            userId: user._id,
        },
    });

    console.log("CONNECTING SOCKET FOR USER:", user._id);

    socket.on("connect", () => {
        console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("SOCKET DISCONNECTED:", reason);
    });

    socket.on("connect_error", (error) => {
        console.log("SOCKET CONNECTION ERROR:", error.message);
    });

    socket.on("getOnlineUsers", (userIds) => {
        console.log("ONLINE USERS RECEIVED:", userIds);

        set({
            onlineUsers: userIds,
        });
    });

    set({
        socket,
    });
},

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));