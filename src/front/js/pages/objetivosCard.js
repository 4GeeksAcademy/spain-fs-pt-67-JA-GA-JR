import React, { useState, useEffect } from "react";
import "../../styles/cardObjetivos.css";

export const CardObjetivos = () => {
    const [showMore, setShowMore] = useState(false);
    const [goals, setGoals] = useState([]);  // Almacena los objetivos localmente en este componente
    const [authToken, setAuthToken] = useState(null);

    // Jorge -> useEffect para obtener el authToken desde localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log("useEffect: authToken desde localStorage", token);
        if (token) {
            setAuthToken(token);
        }
    }, []);

    // Jorge -> useEffect para obtener los objetivos cuando authToken esté disponible
    useEffect(() => {
        if (authToken) {
            console.log("useEffect: authToken presente, llamando a getGoals");
            getGoals(authToken);
        } else {
            console.log("useEffect: authToken no presente");
        }
    }, [authToken]);

    // Jorge -> Función para obtener los objetivos desde el backend
    const getGoals = async (token) => {
        console.log("getGoals: Ejecutando función getGoals con token", token);
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/objetivo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("getGoals: Estado de la respuesta:", response.status);

            if (!response.ok) {
                throw new Error('Error al obtener los objetivos');
            }

            const data = await response.json();
            console.log("getGoals: Objetivos obtenidos:", data.data);
            setGoals(data.data || []);
        } catch (error) {
            console.error('Error al obtener los objetivos:', error);
        }
    };

    const handleToggleShowMore = () => {
        setShowMore(!showMore);
    };

    const totalAvailable = goals.reduce((acc, goal) => acc + (goal.monto || 0), 0);

    const calculateMonthsUntilDate = (expectedDate) => {
        const today = new Date();
        const endDate = new Date(expectedDate);

        if (isNaN(endDate.getTime())) {
            return null;
        }

        const yearsDifference = endDate.getFullYear() - today.getFullYear();
        const monthsDifference = endDate.getMonth() - today.getMonth();
        const totalMonths = (yearsDifference * 12) + monthsDifference;

        return totalMonths < 0 ? 0 : totalMonths;
    };

    const calculateMonthsToSave = (totalAmount, monthlySavings) => {
        if (monthlySavings <= 0) {
            return null;
        }
        const months = totalAmount / monthlySavings;
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
                <p className="total-available"><strong>Total disponible:</strong> {totalAvailable.toFixed(2)} EUR</p>
            </div>
        </div>
    );
};
