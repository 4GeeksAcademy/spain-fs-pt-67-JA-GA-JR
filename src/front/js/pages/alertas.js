import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

export const Alertas = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_esperada: '',
        monto: '',
        tipo_movimiento: 'gastos',
        antelacion: 1,
        motivo: '',
    });

    const [errors, setErrors] = useState({});
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.nombre || formData.nombre.trim().length === 0) {
            formErrors.nombre = "El nombre es obligatorio.";
            isValid = false;
        }

        if (!formData.fecha_esperada) {
            formErrors.fecha_esperada = "La fecha esperada es obligatoria.";
            isValid = false;
        }

        if (!formData.monto || isNaN(parseFloat(formData.monto)) || parseFloat(formData.monto) <= 0) {
            formErrors.monto = "El monto debe ser un número válido y mayor que 0.";
            isValid = false;
        }

        if (!formData.motivo.trim()) {
            formErrors.motivo = "El motivo es obligatorio.";
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Judit -> Preparar datos para el endpoint de eventos
                const alertData = {
                    nombre: formData.nombre,
                    fecha_esperada: formData.fecha_esperada,
                    monto: parseFloat(formData.monto),
                    tipo_movimiento: formData.tipo_movimiento,
                    antelacion: parseInt(formData.antelacion, 10),
                    motivo: formData.motivo
                };

                // Judit -> Enviar datos usando la función postAlert del contexto
                const response = await actions.postAlert(alertData);
                navigate('/homealertas');

                // Judit -> Aseguramos de que no se ha usado ya el cuerpo de la respuesta
                if (!response.ok) {
                    // Judit -> Extraer detalles del error del servidor
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.msg || 'Error desconocido'}`);
                }

                // Judit ->  Extraer datos en formato JSON sólo si es necesario
                const responseData = await response.json();


                // Judit -> Limpiar el formulario después de un envío exitoso
                setFormData({
                    nombre: '',
                    fecha_esperada: '',
                    monto: '',
                    tipo_movimiento: 'gastos',
                    antelacion: '1d',
                    motivo: ''
                });

                alert('Alerta creada correctamente!');

            } catch (error) {
                console.error('Error al enviar la alerta:', error);
                alert(`Error al enviar la alerta: ${error.message}`);
            }
        }
    };


    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-card-body">
                    <h2 className="form-heading">Formulario de Alertas</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nombre" className="form-label">Título de la Alerta:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={`form-control ${errors.nombre ? 'form-control-error' : ''}`}
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            {errors.nombre && <div className="form-error">{errors.nombre}</div>}
                        </div>

                        <div>
                            <label htmlFor="fecha_esperada" className="form-label">Fecha Esperada:</label>
                            <input
                                type="date"
                                id="fecha_esperada"
                                name="fecha_esperada"
                                className={`form-control ${errors.fecha_esperada ? 'form-control-error' : ''}`}
                                value={formData.fecha_esperada}
                                onChange={handleChange}
                            />
                            {errors.fecha_esperada && <div className="form-error">{errors.fecha_esperada}</div>}
                        </div>

                        <div>
                            <label htmlFor="monto" className="form-label">Monto:</label>
                            <input
                                type="text"
                                id="monto"
                                name="monto"
                                className={`form-control ${errors.monto ? 'form-control-error' : ''}`}
                                value={formData.monto}
                                onChange={handleChange}
                            />
                            {errors.monto && <div className="form-error">{errors.monto}</div>}
                        </div>

                        <div>
                            <label htmlFor="motivo" className="form-label">Motivo:</label>
                            <input
                                type="text"
                                id="motivo"
                                name="motivo"
                                className={`form-control ${errors.motivo ? 'form-control-error' : ''}`}
                                value={formData.motivo}
                                onChange={handleChange}
                            />
                            {errors.motivo && <div className="form-error">{errors.motivo}</div>}
                        </div>

                        <div>
                            <label htmlFor="tipo_movimiento" className="form-label">Tipo de Movimiento:</label>
                            <select
                                id="tipo_movimiento"
                                name="tipo_movimiento"
                                className="form-control"
                                value={formData.tipo_movimiento}
                                onChange={handleChange}
                            >
                                <option value="gastos">Gastos</option>
                                <option value="ingresos">Ingresos</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="antelacion" className="form-label">Antelación (debe de ser en días):</label>
                            <input
                                id="antelacion"
                                name="antelacion"
                                type="number"
                                className="form-control"
                                value={formData.antelacion}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <button type="submit" className="btn-primary">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
