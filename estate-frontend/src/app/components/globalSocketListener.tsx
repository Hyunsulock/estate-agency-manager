"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useId } from "react";
import { handleHousePropertySocket } from "./handleHousePropertySocket";
import { useSocket } from "./socketProvider";
import { handleOfferSocket } from "./handleOfferSocket";

export const GlobalSocketListener = () => {
    const queryClient = useQueryClient();

    const handleOfferChange = useCallback((message: any) => {
        queryClient.invalidateQueries({
            queryKey: ["offer"],
        });
    }, []);

    const handleDealChange = useCallback((message: any) => {
        queryClient.invalidateQueries({
            queryKey: ["deal"],
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
        socket.on("deal", handleDealChange);
        return () => {
            socket.off("houseProperty", handleHouseProperty);
            socket.off("offer", handleOffer);
            socket.off("deal", handleDealChange);
        };
    }, [socket, handleHouseProperty, handleOffer, handleDealChange]);

    return null;
};
