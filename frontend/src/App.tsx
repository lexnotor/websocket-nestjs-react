import CarList from "./components/CarList";
import NewCarForm from "./components/NewCarForm";
import { GlobalContextProvider } from "./context/GlobalContext";
import { WebSocketContextProvider } from "./context/WebSocketContext";

const App = () => {
    return (
        <GlobalContextProvider>
            <WebSocketContextProvider>
                <div className="main_app">
                    <NewCarForm />
                    <CarList />
                </div>
            </WebSocketContextProvider>
        </GlobalContextProvider>
    );
};

export default App;
