import { useGlobalContext } from "../context/GlobalContext";

const CarList = () => {
    const { cars, deleteOneCar } = useGlobalContext();
    return (
        <ul className="car-list">
            {cars.map((car) => (
                <li key={car.id} className="car-item">
                    <div>
                        <h4>
                            {car.marque} - <i>{car.model}</i>
                        </h4>
                        <p>
                            {car.proprio} - <i>{car.plaque}</i>
                        </p>
                    </div>
                    <div
                        style={{
                            fontSize: "2rem",
                            color: "red",
                            cursor: "pointer",
                        }}
                        onClick={() => deleteOneCar(car.id)}
                    >
                        X
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CarList;
