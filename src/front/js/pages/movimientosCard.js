import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/movimientosCard.css";

export const MovimientosCard = () => {


  const { actions } = useContext(Context)
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);






  // judit esto se asegura de que la cantidad ingresada en el monto sea un numero
  const parseAmount = (amount) => {
  if (typeof amount !== "number") {
    return 0;
  };
  return amount
  };

  // judit Calcular el total disponible
  const totalAvailable = movements.reduce((total, movement) => {
    const amount = parseAmount(movement.monto);
    return movement.tipo_movimiento.toLowerCase() === 'gasto' ? total - amount : total + amount;
  }, 0);


  useEffect(() => {

    let isMounted = true; //judit  verificar si el componente sigue montado

    const fetchMovements = async () => {
      try {
        const data = await actions.getMovement();
        if (isMounted) {
          setMovements(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchMovements()

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
                    Nombre: "{movement.nombre}" / Monto: "{movement.monto}€" / Tipo: "{movement.tipo_movimiento}".
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
  )
}