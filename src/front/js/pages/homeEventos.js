import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta al contexto sea correcta

export const HomeEventos = () => {
   

  const {store, actions } = useContext(Context)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);








  useEffect(() => {

    let isMounted = true; //judit  verificar si el componente sigue montado

    const fetchEvents = async () => {
      try {
        const data = await actions.getEvents();
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchEvents()

    return () => {
      isMounted = false;
    };

  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

 const handleToggleShowMore = () => {
        setShowMore(prevShowMore => !prevShowMore);
    };

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
