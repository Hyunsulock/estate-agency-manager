// import { useEffect } from "react";
// import useSocket from "./useSocket";



// export const useSocketEvent = (event: string, handler: (data: any) => void) => {
//     const [socket] = useSocket(); 

//     useEffect(() => {
//         if (!socket) return;

//         socket.on(event, handler);

//         return () => {
//             socket.off(event, handler);
//         };
//     }, [socket, handler]);
// };

import { useEffect } from "react";
import { useSocket } from "../components/socketProvider";

export const useSocketEvent = (
    event: string,
    handler: (data: any) => void,
    enabled = true // add this default param
) => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket || !enabled) return;

        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [socket, handler, event, enabled]);
};
