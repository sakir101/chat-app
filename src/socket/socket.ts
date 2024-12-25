import { getUserInfo } from "@/services/auth.service";
import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;

export const connectSocket = (id: string): Promise<{ success: boolean; users?: string[] }> => {

    if (!id || (socket && socket.connected)) {
        // Return a resolved promise for invalid user ID
        return Promise.resolve({ success: false });
    }

    // Initialize the socket connection
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
        query: { userId: id },
    });

    return new Promise((resolve) => {
        // Ensure socket is not null before using
        socket!.on("connect", () => {

            // Fetch online users after a successful connection
            socket!.on("getOnlineUsers", (userIds: string[]) => {
                resolve({ success: true, users: userIds });
            });
        });

        // Handle connection errors
        socket!.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            resolve({ success: false });
        });
    });
};

// Disconnect function
export const disconnectSocket = (id: string) => {
    console.log(socket?.connected)
    if (id && socket && socket.connected) {
        socket.disconnect();
        console.log("Disconnected from Socket.IO server");
        socket = null; // Reset the socket instance
    } else {
        console.log("No active socket to disconnect");
    }
};

export const reconnectSocket = (): Promise<{ success: boolean; users?: string[] }> => {
    const { userId: id } = getUserInfo() as any;
    if (id) {
        return connectSocket(id); // Reconnect using stored user ID
    }
    return Promise.resolve({ success: false });
};

// Subscribe to Messages
export const subscribeToMessages = (
    callback: (newMessage: any) => void
) => {
    if (!socket) {
        console.error("Socket is not initialized");
        return;
    }
    socket.on(`newMessage`, callback);
};

// Unsubscribe from Messages
export const unsubscribeFromMessages = () => {
    if (!socket) {
        console.error("Socket is not initialized");
        return;
    }

    socket.off(`newMessage`);
};

