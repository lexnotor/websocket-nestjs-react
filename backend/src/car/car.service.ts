import { CarInfo } from "@/@type";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class CarService {
    cars: CarInfo[] = [];

    addCar(payload: Partial<CarInfo>) {
        payload.created_at = new Date().toISOString();
        payload.updated_at = new Date().toISOString();
        payload.deleted_at = null;
        payload.id = randomUUID();
        this.cars.push(payload as CarInfo);

        return payload;
    }

    deleteCar(carId: string) {
        const index = this.cars.findIndex((item) => item.id == carId);

        if (index == -1)
            throw new HttpException(
                `CAR_NOT_FOUND ${carId}`,
                HttpStatus.NOT_FOUND,
            );

        this.cars.splice(index, 1);

        return carId;
    }

    getAllCars() {
        return this.cars;
    }
    getOneCar(carId: string) {
        const car = this.cars.find((item) => item.id == carId);

        if (!car)
            throw new HttpException(
                `CAR_NOT_FOUND ${carId}`,
                HttpStatus.NOT_FOUND,
            );

        return car;
    }
}
