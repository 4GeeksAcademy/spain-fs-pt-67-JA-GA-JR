import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";


export const MovimientosCard = () => {


  const { actions } = useContext(Context)
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);







  // Función para convertir montos a números
  const parseAmount = (amount) => parseFloat(amount.replace('$', ''));

  // Calcular el total disponible
  const totalAvailable = Array.isArray(movements) ? movements.reduce((total, movement) => {
    const amount = parseAmount(movement.amount);
    return movement.type === 'expense' ? total - amount : total + amount;
  }, 0) : 0;


  useEffect(() => {

    let isMounted = true; // Variable de referencia para verificar si el componente sigue montado

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




  return (
    <div className="card">
  <div className="card-body">
    <h2>Movimientos</h2>
    <p>Aquí puedes ver todos los movimientos que has hecho.</p>
    <div className="movements">
      <ul>
        {Array.isArray(movements) && movements.length > 0 ? (
          movements.map((movement, index) => (
            <li key={index}>{movement.description} - {movement.amount}</li>
          ))
        ) : (
          <p>No hay movimientos para mostrar.</p>
        )}
      </ul>
    </div>
    <p><strong>Total disponible:</strong> {totalAvailable.toFixed(2)}</p>
  </div>
</div>
  )
}