"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "@/app/lib/useSocketEvent";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useId } from "react";
import { handleHousePropertySocket } from "./handleHousePropertySocket";
import { useGetUser } from "../lib/useGetFunctions/useGetUser";

export const GlobalSocketListener = () => {
    const queryClient = useQueryClient();

    const handleHousePropertyChange = useCallback((message: any) => {
        queryClient.invalidateQueries({
            queryKey: ["houseProperty"],
        });
    }, []);

    const { data: user } = useSession(); // Get the user from the query
    const userId = user?.id;

    const handleSocketMessage = useCallback(
        (message: any) => {
            console.log(userId, "userid");
            handleHousePropertySocket(queryClient, message, userId);
        },
        [queryClient, userId]
    );

    useSocketEvent("houseProperty", handleSocketMessage);

    return null;
};
