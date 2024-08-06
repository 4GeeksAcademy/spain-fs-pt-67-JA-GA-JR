import React from "react";

export const HomeObjetivos =  () => {
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


}