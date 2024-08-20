import React from 'react';
import { HomeMovimientos } from './homeMovimientos';
import { HomeObjetivos } from './homeObjetivos';
import { HomeEventos } from './homeEventos';
import { useNavigate } from 'react-router-dom';
import { HomeAlertas } from './homeAlertas';

export const Home = () => {
    const navigate = useNavigate();

    const createMovement = () => {
        navigate('/movimientos');
    };
    const createGoal = () => {
        navigate('/objetivos');
    };
    const createEvent = () => {
        navigate('/eventos');
    };

    const handleSeeMoreMovements = () => {
        navigate('/homeMovimientos');
    };

    const handleSeeMoreGoals = () => {
        navigate('/homeObjetivos');
    };

    const handleSeeMoreEvents = () => {
        navigate('/homeEventos');
    };

    const createAlert = () => {
        navigate('/alertas');
    };
    const handleSeeMoreAlerts = () => {
        navigate('/homealertas');
    };

    return (
        <div className="home-container">
            <main className="home-content">
                <div className="home-section movements-section card">
                    <div className="card-body">
                        <h2 className="card-title">Movimientos</h2>
                        <HomeMovimientos />
                        <button className="btn-primary" onClick={handleSeeMoreMovements}>Ir a la pagina principal de movimientos</button>
                        <button className="btn-primary" onClick={createMovement}>Crear un movimiento nuevo</button>
                    
                    </div>
                </div>
                <div className="home-section goals-section card">
                    <div className="card-body">
                        <h2 className="card-title">Objetivos</h2>
                        <HomeObjetivos />
                        <button className="btn-primary" onClick={handleSeeMoreGoals}>Ir a la pagina principal de objetivos</button>
                        <button className="btn-primary" onClick={createGoal}>Crear un nuevo objetivo</button>
                    
                    </div>
                </div>
                <div className="home-section events-section card">
                    <div className="card-body">
                        <h2 className="card-title">Eventos</h2>
                        <HomeEventos />
                        <button className="btn-primary" onClick={handleSeeMoreEvents}>Ir a la pagina principal de eventos</button>
                        <button className="btn-primary" onClick={createEvent}>Crear un nuevo evento</button>
                   
                   </div>
                   </div>

                   <div className="home-section alerts-section card">
                    <div className="card-body">
                        <h2 className="card-title">Alertas programadas</h2>
                        <HomeAlertas />
                        <button className="btn-primary" onClick={handleSeeMoreAlerts}>Ir a la pagina principal de alertas programadas</button>
                        <button className="btn-primary" onClick={createAlert}>Crear una nueva alertas programadas</button>
                   
                   </div>
                </div>
            </main>
        </div>
    );
};
