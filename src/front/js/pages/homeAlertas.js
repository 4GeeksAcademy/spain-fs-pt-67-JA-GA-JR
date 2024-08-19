import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/movimientosCard.css";

export const HomeAlertas = () => {


  const {store, actions } = useContext(Context)
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);








  useEffect(() => {

    let isMounted = true; //judit  verificar si el componente sigue montado

    const fetchAlerts = async () => {
      try {
        const data = await actions.getAlerts();
        if (isMounted) {
          setAlerts(data);
          setLoading(false);
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
  )
}