"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "@/app/lib/useSocketEvent";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useId } from "react";
import { handleHousePropertySocket } from "./handleHousePropertySocket";
import { useGetUser } from "../lib/useGetFunctions/useGetUser";
import { useSocket } from "./socketProvider";
import { handleOfferSocket } from "./handleOfferSocket";

export const GlobalSocketListener = () => {
    const queryClient = useQueryClient();

    const handleOfferChange = useCallback((message: any) => {
        queryClient.invalidateQueries({
            queryKey: ["offer"],
        });
    }, []);

    const { data: user } = useSession(); // Get the user from the query
    const userId = user?.id;

    const handleHouseProperty = useCallback(
        (message: any) => {
            // console.log(userId, "userid");
            handleHousePropertySocket(queryClient, message, userId);
        },
        [queryClient, userId]
    );

    const handleOffer = useCallback(
        (message: any) => {
            // console.log(userId, "userid");
            handleOfferSocket(queryClient, message, userId);
        },
        [queryClient, userId]
    );

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on("houseProperty", handleHouseProperty);
        socket.on("offer", handleOffer);
        return () => {
            socket.off("houseProperty", handleHouseProperty);
            socket.off("offer", handleOffer);
        };
    }, [socket, handleHouseProperty, handleOffer]);

    // useSocketEvent("houseProperty", handleSocketMessage);

    return null;
};
