import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/cardObjetivos.css";




export const CardObjetivos = () => {
    const [showMore, setShowMore] = useState(false);
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getGoal(); // judit llama a la función para obtener los objetivos
    }, [actions]);

    const handleToggleShowMore = () => {
        setShowMore(!showMore);
    };

    const goals = store.goals || [];

    // judit calcula el total disponible sumando los montos de los objetivos
    const totalAvailable = goals.reduce((acc, goal) => acc + (goal.monto || 0), 0);

    // judit calcula el numero de meses restantes hasta una fecha futura especifica.
    const calculateMonthsUntilDate = (expectedDate) => {
        const today = new Date();
        const endDate = new Date(expectedDate);
    
        if (isNaN(endDate.getTime())) {
            return null; 
        }
    
        // judit calcular la diferencia en meses
        const yearsDifference = endDate.getFullYear() - today.getFullYear();
        const monthsDifference = endDate.getMonth() - today.getMonth();
        const totalMonths = (yearsDifference * 12) + monthsDifference;
    
        return totalMonths < 0 ? 0 : totalMonths;
    };
    

    // judit calcula el numero de meses necesarios para ahorrar una cantidad 
    //total dada, dado un monto de ahorro mensual.
    const calculateMonthsToSave = (totalAmount, monthlySavings) => {
        // Verifica si el monto de ahorro mensual es menor o igual a cero
        if (monthlySavings <= 0) {
            return null; // Si el monto de ahorro mensual es inválido, retorna null
        }
    
        // Calcula el número de meses necesarios para ahorrar el monto total
        const months = totalAmount / monthlySavings;
        
        // Retorna el número de meses redondeado hacia arriba
        return Math.ceil(months);
    };
    
    

    return (
        <div className="card card-main">
            <div className="card-body text-center">
                <h1 className="card-title">Objetivos</h1>
                <p className="card-description">Aquí puedes ver todos los objetivos que tienes pendientes.</p>
                <div className="goals">
                    {goals.length > 0 ? (
                        <div className="goals-list">
                            {goals.slice(0, showMore ? goals.length : 5).map(goal => {
                                const monthsUntilDate = calculateMonthsUntilDate(goal.fecha_objetivo);
                                const monthsToSave = calculateMonthsToSave(goal.monto, goal.cuota_mensual);

                                return (
                                    <div key={goal.id} className="card goal-item">
                                        <div className="card-body">
                                            <h5 className="card-title">{goal.nombre}</h5>
                                            <p className="card-text"><strong>Monto:</strong> {goal.monto?.toFixed(2)} EUR</p>
                                            <p className="card-text"><strong>Fecha objetivo:</strong> {goal.fecha_objetivo}</p>
                                            <p className="card-text"><strong>Cuota mensual:</strong> {goal.cuota_mensual?.toFixed(2)} EUR</p>
                                            <p className="card-text"><strong>Tiempo restante hasta el objetivo:</strong> {monthsUntilDate} meses</p>
                                            <p className="card-text"><strong>Tiempo necesario para ahorrar:</strong> {monthsToSave} meses</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="no-goals">No hay objetivos pendientes.</p>
                    )}
                     <button
                        className="btn btn-primary"
                        onClick={handleToggleShowMore}
                    >
                        {showMore ? "Ver menos" : "Ver más"}
                    </button>
                </div>
                <p className="total-available"><strong>Total disponible:</strong> {goals.reduce((acc, goal) => acc + goal.monto, 0).toFixed(2)} EUR</p>
            </div>
        </div>
    );
};
