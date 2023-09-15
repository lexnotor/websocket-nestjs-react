import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpCode,
    Param,
    Post,
    Query,
} from "@nestjs/common";
import { CarService } from "./car.service";
import { CarInfo } from "@/@type";
import { CarGateway } from "./car.gateway";

type QueryDto = {
    all?: boolean;
    carId?: string;
};

@Controller("cars")
export class CarController {
    constructor(
        private readonly carService: CarService,
        private readonly carGateway: CarGateway,
    ) {}

    @Get()
    @HttpCode(200)
    findCars(@Query() query: QueryDto) {
        const res = query.carId
            ? this.carService.getOneCar(query.carId)
            : this.carService.getAllCars();

        return res;
    }

    @Post()
    @HttpCode(202)
    createCar(
        @Body() payload: Partial<CarInfo>,
        @Headers("socket_id") socketId: string,
    ) {
        const res = this.carService.addCar(payload);
        this.carGateway.emitNewCar(res.id, socketId);

        return res;
    }

    @Delete(":id")
    @HttpCode(202)
    deleteCar(
        @Param("id") carId: string,
        @Headers("socket_id") socketId: string,
    ) {
        const res = this.carService.deleteCar(carId);

        this.carGateway.emitDeletedCar(res, socketId);
        return res;
    }
}
