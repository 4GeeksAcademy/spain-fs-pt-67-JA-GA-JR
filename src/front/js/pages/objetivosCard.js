import React, { useState } from "react";

export const CardObjetivos = () => {


    const [showMore, setShowMore] = useState(false);


    //calculael tiempo que faalta hasta la fecha añadida
    const calculateMonthsUntilDate = (expectedDate) => {
        const today = new Date();
        const endDate = new Date(expectedDate);

        // judit asegurarse de que la fecha esperada sea válida
        if (isNaN(endDate.getTime())) {
            return null; // La fecha no es válida
        }
        // judit calcular la diferencia en años y meses
        let months = (endDate.getFullYear() - today.getFullYear()) * 12;
        months -= today.getMonth();
        months += endDate.getMonth();

        // Si la fecha esperada ya pasó, retornar 0 o un valor negativo
        return months < 0 ? 0 : months;
    };


    //judit calcula el tiempo necesario en base al pago mensual
    const calculateMonthsToSave = (totalAmount, monthlySavings) => {
        if (monthlySavings <= 0) {
            return null;
        }
        const months = totalAmount / monthlySavings;
        // judit redondear hacia arriba 
        return Math.ceil(months);
    };

    const handleToggleShowMore = () => { //judit mostrar mas o menos movimientos
        setShowMore(!showMore);
    };

    const movements = [
        { id: 1, description: "Compra en supermercado", amount: -50 },
        { id: 2, description: "Pago de salario", amount: 1500 },
        // Agrega más movimientos según sea necesario

    ];
    const totalAvailable = movements.reduce((acc, movement) => acc + movement.amount, 0);

    return (
        <div className="card">
            <div className="card-body text-center">
                <h2 className="card-title">Objetivos</h2>
                <p className="card-description">Aquí puedes ver todos los objetivos que tienes pendientes.</p>
                <div className="goals">
                    {movements.length > 0 ? (
                        <ul className="movements-list">
                            {movements.slice(0, showMore ? movements.length : 5).map(movement => (
                                <li key={movement.id}>
                                    <p>{movement.description}</p>
                                    <p>{movement.amount.toFixed(2)} EUR</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-movements">No hay objetivos pendientes.</p>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleToggleShowMore}
                    >
                        {showMore ? "Ver menos" : "Ver más"}
                    </button>

                </div>
                <p className="total-available"><strong>Total disponible:</strong> {totalAvailable.toFixed(2)} EUR</p>
            </div>

        </div>
    )
}