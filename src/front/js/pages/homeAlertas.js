import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/movimientosCard.css";

export const HomeAlertas = () => {
  const { store, actions } = useContext(Context);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // Función para solicitar permiso de notificación
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
    } else {
    }
  };

  // Judit -> Llama a esta función cuando inicies tu aplicación o cuando sea relevante
  requestNotificationPermission();



  // Judit -> Función para mostrar notificaciones
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,

      });
      notification.onclick = () => {
        window.focus(); // Judit -> Opcional: hace que la ventana del navegador reciba el foco
        // Judit -> Aquí redirigimos a la página de alertas:
        window.location.href = "/homeAlertas";
      };
    } else {
    }
  };

  // Judit -> Función para notificar alertas próximas
  const notifyUpcomingAlerts = (alerts) => {
    const now = new Date(); // Fecha actual

    alerts.forEach(alert => {
      // Judit -> Convertir la fecha esperada a un objeto Date
      const alertDate = new Date(alert.fecha_esperada);

      // Judit -> Convertir antelación en días a milisegundos
      const anticipationDays = parseInt(alert.antelacion, 10);
      const anticipationMilliseconds = anticipationDays * 24 * 60 * 60 * 1000;

      // Judit -> Calcular la fecha de notificación restando la antelación de la fecha esperada
      const notificationDate = new Date(alertDate.getTime() - anticipationMilliseconds);

      // Judit -> Calcular el tiempo hasta la notificación
      const timeToNotification = notificationDate - now;

      // Judit -> Verifica si la notificación está dentro del rango de 10 minutos a partir de ahora
      if (timeToNotification > 0 && timeToNotification <= 10 * 60 * 1000) { // 10 minutos
        showNotification(
          `Alerta: ${alert.nombre}`,
          `Motivo: ${alert.motivo}\nFecha: ${alert.fecha_esperada}`
        );
      }
    });
  };


  useEffect(() => {
    let isMounted = true; // Judit -> Verificar si el componente sigue montado

    // Judit -> Solicita permiso de notificación al cargar el componente
    requestNotificationPermission();
    showNotification("Título de Prueba", "Cuerpo de la notificación de prueba.");
    const fetchAlerts = async () => {
      try {
        const data = await actions.getAlerts();
        if (isMounted) {
          setAlerts(data);
          setLoading(false);
          notifyUpcomingAlerts(data); // Judit -> Notifica alertas próximas
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchAlerts();

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
        <h1 className="card-title">Alertas Programadas</h1>
        <p className="card-description">Aquí puedes ver todas las alertas programadas.</p>
        <div className="alerts">
          {alerts.length > 0 ? (
            <div className="alerts-list">
              {alerts.slice(0, showMore ? alerts.length : 3).map(alert => (
                <div key={alert.id} className="card alert-item">
                  <div className="card-body">
                    <h5 className="card-title">{alert.nombre}</h5>
                    <p className="card-text"><strong>Fecha programada:</strong> {alert.fecha_esperada}</p>
                    <p className="card-text"><strong>Motivo:</strong> {alert.motivo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-alerts">No hay alertas programadas.</p>
          )}
          <button
            className="btn btn-primary"
            onClick={handleToggleShowMore}
          >
            {showMore ? "Ver menos" : "Ver más"}
          </button>
        </div>
      </div>
    </div>
  );
};
