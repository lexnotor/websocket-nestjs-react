import React, { createContext, useContext, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalContext } from "./GlobalContext";

type WebSocketContextType = { socketId?: string };
enum events {
    SUCCESS_CONNECTED = "SUCCESS_CONNECTED",
    CAR_DELETED = "CAR_DELETED",
    CAR_ADDED = "CAR_ADDED",
}

const WebSocketContext = createContext<WebSocketContextType>({});

const WebSocketContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { getOneCars, carsDispatcher } = useGlobalContext();
    const [socketId, setSocketID] = useState<string>(null);
    const carSocket = useMemo(
        () =>
            io(import.meta.env.VITE_BACKEND_URL, {
                reconnectionDelay: 5000,
                transports: ["websocket"],
                timeout: 5000,
            }),
        []
    );

    if (carSocket && !socketId) {
        carSocket.on("connect", () => {
            console.log("SOCKET_IO_CONNECTED");
        });

        carSocket.on("connect_error", (erro) => {
            console.log(erro.message);
        });

        carSocket.on(events.SUCCESS_CONNECTED, (arg: { id: string }) => {
            setSocketID(arg.id);
        });
        carSocket.on(events.CAR_ADDED, (arg: { id: string }) => {
            getOneCars(arg.id);
        });
        carSocket.on(events.CAR_DELETED, (arg: { id: string }) => {
            carsDispatcher({ type: "DELETE_ONE_CAR", payload: arg.id });
        });
    }

    return (
        <WebSocketContext.Provider value={{ socketId }}>
            {children}
        </WebSocketContext.Provider>
    );
};

const useWebSocketContext = () => useContext(WebSocketContext);

export { WebSocketContextProvider, useWebSocketContext };
