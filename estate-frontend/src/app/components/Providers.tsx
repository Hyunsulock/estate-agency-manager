"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { SocketProvider } from "./socketProvider";

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    return (
            <SessionProvider>{children}</SessionProvider>
    );
};

export default Providers;
