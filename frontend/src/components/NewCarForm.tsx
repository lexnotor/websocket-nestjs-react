import React, { useRef } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const NewCarForm = () => {
    const { createOneCar } = useGlobalContext();

    const proprioRef = useRef<HTMLInputElement>(null);
    const marqueRef = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLInputElement>(null);
    const plaqueRef = useRef<HTMLInputElement>(null);

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const proprio = proprioRef.current.value,
            marque = marqueRef.current.value,
            model = modelRef.current.value,
            plaque = plaqueRef.current.value;
        if (
            !proprio.trim() ||
            !marque.trim() ||
            !model.trim() ||
            !plaque.trim()
        )
            return alert("Tout les champs sont obligatoire");

        createOneCar({ marque, model, proprio, plaque }).then((bool) => {
            if (bool) alert("CREER OK");
            else console.log("CREATION ERROR");
        });
    };

    return (
        <form onSubmit={submit}>
            <h2 style={{ textAlign: "center" }}>Nouveau Car</h2>
            <div className="form-container">
                <label htmlFor="">Proprio :</label>
                <input type="text" minLength={3} ref={proprioRef} />

                <label htmlFor="">Marque :</label>
                <input type="text" minLength={3} ref={marqueRef} />

                <label htmlFor="">Model :</label>
                <input type="text" minLength={3} ref={modelRef} />

                <label htmlFor="">Plaque :</label>
                <input type="text" minLength={3} ref={plaqueRef} />
            </div>
            <button className="submit-btn">Envoyer</button>
        </form>
    );
};

export default NewCarForm;
