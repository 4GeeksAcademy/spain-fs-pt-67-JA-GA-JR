import React, { useContext, useState } from "react";
import "../../styles/objetivos.css";
import { Context } from "../store/appContext";

export const Objetivos = () => {
    const [goalName, setGoalName] = useState('');
    const [amount, setAmount] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [monthlySavings, setMonthlySavings] = useState('');
    const { actions } = useContext(Context);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "goalName") setGoalName(value);
        if (name === "amount") setAmount(value);
        if (name === "expectedDate") setExpectedDate(value);
        if (name === "monthlySavings") setMonthlySavings(value);
    };
 //judt convierte elobjetoen un array de arrays y si es un string quita los espacios y si no hay espacios devuelve null
    const cleanData = (data) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                cleaned[key] = value.trim() || null;
            } else {
                cleaned[key] = value || null;
            }
        }
        return cleaned;
    };

    const handleAddGoal = async () => {
        const newGoal = {
            nombre: goalName,
            monto: parseFloat(amount) || null,
            fecha_objetivo : expectedDate,
            cuota_mensual: parseFloat(monthlySavings) || null,
        };

        const cleanedData = cleanData(newGoal);
        console.log('Datos del objetivo despues de limpieza:', cleanedData);

        try {
            const result = await actions.postGoal(cleanedData);
            if (result) {
                console.log("Objetivo creado con éxito:", result);
            }

         
            setGoalName('');
            setAmount('');
            setExpectedDate('');
            setMonthlySavings('');
        } catch (error) {
            console.error("Error al crear el objetivo:", error);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <h2>Agregar Objetivo</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="goalName">Nombre del Objetivo:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="goalName"
                                id="nombre"
                                value={goalName}
                                placeholder="Nombre del objetivo"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="amount">Monto:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="amount"
                                id="monto"
                                value={amount}
                                placeholder="Monto"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="expectedDate">Fecha Esperada del Objetivo:</label>
                            <input
                                type="date"
                                className="form-control"
                                name="expectedDate"
                                id="fecha_objetivo"
                                value={expectedDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="monthlySavings">Pago Mensual (si no hay fecha esperada):</label>
                            <input
                                type="number"
                                className="form-control"
                                name="monthlySavings"
                                id="cuota_mensual"
                                value={monthlySavings}
                                placeholder="Pago mensual"
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddGoal}>Agregar Objetivo</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
