import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta al contexto sea correcta

export const EventosCard = () => {
    const { store, actions } = useContext(Context);
    const [showMore, setShowMore] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    const events = store.events;

    useEffect(() => {
        // Indicar que el componente está montado
        setIsMounted(true);

        // Llamar a la acción para obtener los eventos
        actions.getEvents();

        // Función de limpieza para indicar que el componente ya no está montado
        return () => {
            setIsMounted(false);
        };
    }, []);

    const handleToggleShowMore = () => {
        if (isMounted) {
            setShowMore(!showMore);
        }
    };

    // Asegurarse de que `events` no sea `undefined`
    if (!events || !Array.isArray(events) || events.length === 0) {
        return (
            <div className="card card-main">
                <div className="card-body text-center">
                    <h1 className="card-title">Eventos</h1>
                    <p className="no-events">No hay eventos pendientes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card card-main">
            <div className="card-body text-center">
                <h1 className="card-title">Eventos</h1>
                <p className="card-description">Aquí puedes ver todos los eventos que tienes pendientes.</p>
                <div className="events">
                    <div className="events-list">
                        {events.slice(0, showMore ? events.length : 5).map(event => (
                            <div key={event.id} className="card event-item">
                                <div className="card-body">
                                    <h5 className="card-title">{event.nombre}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={handleToggleShowMore}>
                        {showMore ? "Ver menos" : "Ver más"}
                    </button>
                </div>
            </div>
        </div>
    );
};
