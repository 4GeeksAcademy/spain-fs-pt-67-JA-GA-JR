import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';

export const HomeEventos = () => {

  const { store, actions } = useContext(Context)
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

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm("¿Confirmas que quieres eliminar este evento?");
    if (confirmed) {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.BACKEND_URL}/api/eventos/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
          alert("Evento eliminado exitosamente.");
        } else {
          alert("Hubo un problema al eliminar el evento.");
        }
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        alert("Error al eliminar el evento.");
      }
    }
  };

  return (
    <div className="card card-main">
      <div className="card-body text-center">
        <h1 className="card-title">Eventos</h1>
        <p className="card-description">Aquí puedes administrar todos los eventos que tienes pendientes.</p>
        <div className="events">
          <div className="events-list">
            {events.slice(0, showMore ? events.length : 3).map(event => (
              <div key={event.id} className="card event-item">
                <div className="card-body">
                  <h5 className="card-title">{event.nombre}</h5>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Eliminar
                  </button>
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
