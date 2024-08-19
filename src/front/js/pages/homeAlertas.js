import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/movimientosCard.css";

export const HomeAlertas = () => {


  const {store, actions } = useContext(Context)
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);


// Función para solicitar permiso de notificación
const requestNotificationPermission = () => {
  console.log('Solicitando permiso de notificación...');
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('Permiso recibido:', permission);
      if (permission === 'granted') {
        console.log('Permiso concedido para mostrar notificaciones.');
      } else {
        console.log('Permiso denegado para mostrar notificaciones.');
      }
    });
  }
};

// Función para mostrar notificaciones
const showNotification = (title, body) => {
  console.log('Mostrando notificación:', title, body);
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: 'icon-url' // Reemplaza con la URL de tu icono
    });
  } else {
    console.log('No se ha concedido permiso para mostrar notificaciones.');
  }
};

// Función para notificar alertas próximas
const notifyUpcomingAlerts = (alerts) => {
  alerts.forEach(alert => {
    const alertDate = new Date(alert.fecha_esperada);
    const now = new Date();
    const timeToAlert = alertDate - now;

    console.log(`Alerta: ${alert.nombre}, Tiempo hasta alerta: ${timeToAlert} ms`);

    if (timeToAlert > 0 && timeToAlert <= 10 * 60 * 1000) { // 10 minutos
      showNotification(
        `Alerta: ${alert.nombre}`,
        `Motivo: ${alert.motivo}\nFecha: ${alert.fecha_esperada}`
      );
    }
  });
};






  useEffect(() => {

    let isMounted = true; //judit  verificar si el componente sigue montado

     // Solicita permiso de notificación al cargar el componente
     requestNotificationPermission();

    const fetchAlerts = async () => {
      try {
        const data = await actions.getAlerts();
        if (isMounted) {
          setAlerts(data);
          setLoading(false);
          notifyUpcomingAlerts(data); // Notifica alertas próximas
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchAlerts()

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
            {alerts.slice(0, showMore ? alerts.length : 5).map(alert => (
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