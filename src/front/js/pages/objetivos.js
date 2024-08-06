import React, {useContext, useState} from "react";
import "../../styles/objetivos.css";
import { Context } from "../store/appContext";


export const Objetivos = () => {
    const [goalName, setGoalName] = useState('');
    const [amount, setAmount] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [monthlySavings, setMonthlySavings] = useState('');
    const {actions} = useContext(Context);



const handleInputChange =(e) => {
    const {name, value} = e.target;
    if (name === "goalName") setGoalName(value);
    if (name === "amount") setAmount(value);
    if (name === "expectedDate") setExpectedDate(value);
     if (name === "monthlySavings") setMonthlySavings(value);
};




const handleAddGoal = async () => {
    const newGoal = {
        goalName,
        amount: parseFloat (amount),
        expectedDate,
        monthlySavings: parseFloat (monthlySavings),
    };
    console.log(newGoal);

    const result = await actions.postGoal(newGoal);
    if (result) {
      console.log("Objetivo creado con éxito:", result);
    }

    setGoalName('');
    setAmount('');
    setExpectedDate('');
    setMonthlySavings('');
};





// judit calcular el tiempo necesario para ahorrar en base a lo que el cliente quiere aportar mensualmente
const calculateMonthsToSave = (totalAmount, monthlySavings) => {
  if (monthlySavings <= 0) {
      return null; 
  }
  const months = totalAmount / monthlySavings;
  
  return Math.ceil(months);
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
              <button type="button" className="btn btn-primary"onClick={handleAddGoal}>Agregar Objetivo</button>
            </form>
          </div>
        </div>
      </div>
    );
};