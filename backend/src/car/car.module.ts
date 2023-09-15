import { Module } from "@nestjs/common";
import { CarController } from "./car.controller";
import { CarGateway } from "./car.gateway";
import { CarService } from "./car.service";

@Module({
    controllers: [CarController],
    providers: [CarService, CarGateway],
})
export class CarModule {}
