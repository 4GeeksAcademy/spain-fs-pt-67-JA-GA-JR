// import React from "react";

// export const EventosCard = () => {
//     return (

//         <div className="card">
//         <div className="card-body text-center">
//             <h2 className="card-title">Eventos</h2>
//             <p className="card-description">Aquí puedes ver todos los eventos que tienes pendientes.</p>
//             <div className="events">
//                 <ul className="events-list">
//                 {Array.isArray(events) && events.length > 0 ? (
//                 movements.slice(0, showMore ? movements.length : 5).map((movement, index) => (
//                     <li 
//                         key={index} 
//                         className={`movement-item ${movement.tipo_movimiento.toLowerCase()}`}
//                     >
//                         {movement.nombre} - {movement.monto} - {movement.tipo_movimiento}
//                     </li>
//                 ))
//             ) : (
//                 <p className="no-movements">No hay movimientos para mostrar.</p>
//                     )}
//                 </ul>
//                 <button 
//                             className="btn btn-primary" 
//                             onClick={handleToggleShowMore}
//                         >
//                             {showMore ? "Ver menos" : "Ver más"}
//                         </button>
    
//             </div>
//             <p className="total-available"><strong>Total disponible:</strong> {totalAvailable.toFixed(2)}</p>
//         </div>
       
//     </div>
      
//     );
// };
    
//     export default EventosCard;
