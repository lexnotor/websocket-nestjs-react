import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from "react";
import { CarInfo } from "../@type";

type ActionType =
    | {
          type: "SET_ALL_CARS";
          payload: CarInfo[];
      }
    | { type: "SET_ONE_CARS"; payload: CarInfo }
    | { type: "DELETE_ALL_CAR" }
    | { type: "DELETE_ONE_CAR"; payload: string };
type GlobalContextType = {
    cars?: CarInfo[];
    carsDispatcher?: React.Dispatch<ActionType>;
    getAllCars?: () => Promise<boolean>;
    getOneCars?: (carId: string) => Promise<boolean>;
    deleteOneCar?: (carId: string) => Promise<boolean>;
    createOneCar?: (carinfo: Partial<CarInfo>) => Promise<boolean>;
};

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const GlobalContext = createContext<GlobalContextType>({});

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cars, carsDispatcher] = useReducer<
        (state: CarInfo[], action: ActionType) => CarInfo[]
    >((state, action) => {
        switch (action.type) {
            case "SET_ALL_CARS":
                return action.payload;
            case "SET_ONE_CARS":
                return [
                    ...state.filter((item) => item.id != action.payload.id),
                    action.payload,
                ];
            case "DELETE_ONE_CAR":
                return state.filter((item) => item.id != action.payload);
            case "DELETE_ALL_CAR":
                return [];
            default:
                return state;
        }
    }, []);

    const getAllCars = useCallback(async () => {
        const res: CarInfo[] = await fetch(`${baseUrl}/cars?all=true`, {
            mode: "cors",
        })
            .then((res) => (res.status == 200 ? res.json() : []))
            .catch(() => []);
        carsDispatcher({ payload: res, type: "SET_ALL_CARS" });
        return !!res.length;
    }, []);

    const getOneCars = useCallback(async (carId: string) => {
        const res: CarInfo = await fetch(`${baseUrl}/cars?carId=${carId}`, {
            mode: "cors",
        })
            .then((res) => (res.status == 200 ? res.json() : null))
            .catch(() => null);

        res && carsDispatcher({ payload: res, type: "SET_ONE_CARS" });
        return !!res;
    }, []);

    const deleteOneCar = useCallback(async (carId: string) => {
        const res: string = await fetch(`${baseUrl}/cars/${carId}`, {
            mode: "cors",
            method: "delete",
        })
            .then((res) => (res.status == 202 ? carId : null))
            .catch(() => null);
        res && carsDispatcher({ payload: res, type: "DELETE_ONE_CAR" });
        return !!res;
    }, []);

    const createOneCar = useCallback(async (carInfo: Partial<CarInfo>) => {
        const res: CarInfo = await fetch(`${baseUrl}/cars`, {
            mode: "cors",
            method: "post",
            body: JSON.stringify(carInfo),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => (res.status == 202 ? res.json() : null))
            .catch(() => null);
        res && carsDispatcher({ payload: res, type: "SET_ONE_CARS" });
        return !!res;
    }, []);

    useEffect(() => {
        getAllCars();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                cars,
                carsDispatcher,
                getAllCars,
                getOneCars,
                deleteOneCar,
                createOneCar,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContextProvider, useGlobalContext };
