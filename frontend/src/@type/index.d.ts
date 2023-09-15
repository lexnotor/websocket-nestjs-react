import { Socket } from "socket.io";

interface DefaultData {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface CarInfo extends DefaultData {
    proprio: string;
    marque: string;
    model: string;
    plaque: string;
}

export interface ConnectedUser {
    id: string;
    socket: Socket;
}
