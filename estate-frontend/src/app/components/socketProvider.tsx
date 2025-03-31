"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import getAccessSession from "../lib/getAccessToken";
import { Backend_URL } from "../lib/Constants";
import { useSession } from "next-auth/react";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data: session, status } = useSession();
    useEffect(() => {
        const connect = async () => {
            if (status === "authenticated" && session?.accessToken) {
                const token = session.accessToken;

                const newSocket = io(`${Backend_URL}`, {
                    transports: ["websocket"],
                    auth: { token: `Bearer ${token}` },
                });

                newSocket.on("connect", () => {
                    console.log(" Socket connected:", newSocket.id);
                });

                newSocket.on("connection_error", (error) => {
                    console.log("Socket connection error:", error.message);
                });

                setSocket(newSocket);

                return () => {
                    newSocket.disconnect();
                    console.log("Socket disconnected");
                };
            }
            // const token = await getAccessSession();
            // if (!token) {
            //     return null;
            // }
        };

        connect();

        // Cleanup disconnect when provider unmounts
        return () => {
            socket?.disconnect();
        };
        
    }, [status, session?.accessToken]); 

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
