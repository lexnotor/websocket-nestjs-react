import { ConnectedUser } from "@/@type";
import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
} from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";

enum events {
    SUCCESS_CONNECTED = "SUCCESS_CONNECTED",
    CAR_DELETED = "CAR_DELETED",
    CAR_ADDED = "CAR_ADDED",
}

@WebSocketGateway(undefined, {
    transports: ["websocket"],
    cors: { origin: "*" },
    pingInterval: 60000,
})
export class CarGateway implements OnGatewayInit, OnGatewayConnection {
    connected: ConnectedUser[] = [];
    private readonly logger = new Logger(CarGateway.name);

    afterInit(server: Server) {
        this.connected = [];
        server._opts;
        this.logger.log(`Server path: ${server.path()}`);
    }

    handleConnection(client: Socket) {
        const user = { id: randomUUID(), socket: client };
        this.connected.push(user);
        client.emit(events.SUCCESS_CONNECTED, { id: user.id });
        client.on("disconnect", () => {
            const index = this.connected.findIndex(
                (item) => item.id == user.id,
            );
            if (index != -1) this.connected.splice(index, 1);
            this.logger.log(`Connection : ${this.connected.length}`);
        });
        this.logger.log(`Connection : ${this.connected.length}`);
    }

    emitNewCar(carId: string, doer?: string) {
        this.connected.forEach(({ socket, id }) => {
            if (socket.connected && id != doer)
                socket.emit(events.CAR_ADDED, { id: carId });
        });

        this.logger.log(`CAR_ADDED : ${carId}`);
    }

    emitDeletedCar(carId: string, doer?: string) {
        this.connected.forEach(({ socket, id }) => {
            if (socket.connected && id != doer)
                socket.emit(events.CAR_DELETED, { id: carId });
        });

        this.logger.log(`CAR_DELETED : ${carId}`);
    }
}
