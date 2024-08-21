import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/movimientosCard.css";

export const MovimientosCard = () => {

  const { actions } = useContext(Context);
  const [movements, setMovements] = useState([]);
  const [events, setEvents] = useState([]); // judit -> Estado para almacenar los eventos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // judit -> esto se asegura de que la cantidad ingresada en el monto sea un número
  const parseAmount = (amount) => {
    if (typeof amount !== "number") {
      return 0;
    };
    return amount;
  };

  const handleDeleteMovement = async (movementId) => {
    const confirmed = window.confirm("¿Nos confirmas que quieres eliminar este movimiento?");
    if (confirmed) {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/movimientos/${movementId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                // judit -> Eliminar el movimiento del estado local
                setMovements((prevMovements) => prevMovements.filter(movement => movement.id !== movementId));
                alert("Movimiento eliminado exitosamente.");
            } else {
                alert("Hubo un problema al eliminar el movimiento.");
            }
        } catch (error) {
            console.error("Error al eliminar el movimiento:", error);
            alert("Error al eliminar el movimiento.");
        }
    }
  };

  // judit -> Calcular el total disponible
  const totalAvailable = movements.reduce((total, movement) => {
    const amount = parseAmount(movement.monto);
    return movement.tipo_movimiento.toLowerCase() === 'gasto' ? total - amount : total + amount;
  }, 0);

  useEffect(() => {
    let isMounted = true; // judit -> verificar si el componente sigue montado

    const fetchData = async () => {
      try {
        // judit -> Obtener movimientos y eventos simultáneamente
        const [movementsData, eventsData] = await Promise.all([
          actions.getMovement(),
          actions.getEvents(),
        ]);

        if (isMounted) {
          setMovements(movementsData);
          setEvents(eventsData); // judit -> Guardar los eventos en el estado
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          console.error("Error fetching data:", err); // Para registrar errores de manera clara
        }
      }
    };

    // judit -> Llamamos a fetchData solo una vez cuando se monta el componente
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [actions.getMovement, actions.getEvents]); // judit -> Cambiamos las dependencias a funciones específicas

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleToggleShowMore = () => {
    setShowMore(prevShowMore => !prevShowMore);
  };

  // judit -> Función para obtener el nombre del evento por su ID
  const getEventNameById = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.nombre : "Sin evento relacionado";
  };

  return (
    <div className="card">
      <div className="card-body text-center">
        <h2 className="card-title">Movimientos</h2>
        <p className="card-description">Aquí puedes ver todas las transacciones que has hecho:</p>
        <div className="movements">
          <ul className="movements-list">
            {Array.isArray(movements) && movements.length > 0 ? (
              movements.slice(0, showMore ? movements.length : 5).map((movement, index) => (
                <li
                  key={index}
                  className={`movement-item ${movement.tipo_movimiento.toLowerCase()}`}
                >
                  Nombre: "{movement.nombre}" / Monto: "{movement.monto}€" / Motivo: "{movement.motivo}" Tipo: "{movement.tipo_movimiento}" / ¿Evento relacionado? : "{getEventNameById(movement.eventos_relacion)}"
                  <button
                    className="btn btn-danger btn-sm ms-3"
                    onClick={() => handleDeleteMovement(movement.id)}  // judit -> Llama a la función de eliminación
                  >
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <p className="no-movements">No hay movimientos para mostrar.</p>
            )}
          </ul>
          <button
            className="btn btn-primary"
            onClick={handleToggleShowMore}
          >
            {showMore ? "Ver menos" : "Ver más"}
          </button>

        </div>
        <p className="total-available"><strong>Total disponible:</strong> {totalAvailable.toFixed(2)}€</p>
      </div>

    </div>
  );
}
