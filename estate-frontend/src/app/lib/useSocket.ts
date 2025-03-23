import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'
import { Backend_URL } from './Constants';
import getAccessSession from './getAccessToken';

let socket: Socket | null;
export default function useSocketas(): [Socket | null, () => void] {

    const disconnet = useCallback(() => {
        socket?.disconnect();
        socket = null;
    }, []);

    useEffect(() => {
        const connect = async () => {
            if (!socket) {
                const token = await getAccessSession();
                socket = io(`${Backend_URL}`, {
                    transports: ['websocket'],
                    auth: { token: `Bearer ${token}` },
                });

                socket.on('connection_error', (error) => {
                    console.log(error.message);
                });
                console.log('connectec')
            }
        };

        connect();
    }, []);

    return [socket, disconnet]

}