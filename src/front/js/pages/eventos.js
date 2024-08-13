import React, { useState, useContext } from 'react';
import '../../styles/eventos.css';
import { Context } from "../store/appContext";

export const Eventos = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_esperada: '',
    monto: '',
    tipo_movimiento: 'gastos',
    antelacion: '1d',
    motivo: '',
  });

  const [errors, setErrors] = useState({});
  const { actions } = useContext(Context);

  

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
      formErrors.fecha_esperada = "La fecha de inicio es obligatoria.";
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
            // Preparar datos para el endpoint de eventos
            const eventData = {
                nombre: formData.nombre
            };

            // Enviar datos al endpoint de eventos
            const eventResponse = await actions.postEvent(eventData);

            if (!eventResponse.ok) {
                // Extraer detalles del error del servidor
                const errorData = await eventResponse.json();
                throw new Error(`Error ${eventResponse.status}: ${errorData.message || 'Error desconocido'}`);
            }

            // Preparar datos para el endpoint de alertas
            const alertData = {
                nombre: formData.nombre,
                monto: parseFloat(formData.monto),
                tipo_movimiento: formData.tipo_movimiento,
                antelacion: formData.antelacion,
                motivo: formData.motivo,
                fecha_esperada: formData.fecha_esperada
            };

            // Enviar datos al endpoint de alertas
            const alertResponse = await actions.postAlert(alertData);

            try {
              const result = await postAlert(alertData);
              console.log('Resultado:', result);
          } catch (error) {
              console.error('Error al enviar la alerta:', error);
          }

            // Limpiar el formulario después de un envío exitoso
            setFormData({
                nombre: '',
                fecha_esperada: '',
                monto: '',
                tipo_movimiento: 'gastos',
                antelacion: '1d',
                motivo: ''
            });

            alert('Formulario enviado correctamente!');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            alert(`Error al enviar el formulario: ${error.message}`);
        }
    }
};


  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-card-body">
          <h2 className="form-heading">Formulario de Eventos y Recordatorio de Pagos</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre" className="form-label">Título del Evento/Pago:</label>
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
              <label htmlFor="fecha_esperada" className="form-label">Fecha de Inicio:</label>
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
              <label htmlFor="monto" className="form-label">Cantidad:</label>
              <input
                type="number"
                id="monto"
                name="monto"
                className={`form-control ${errors.monto ? 'form-control-error' : ''}`}
                step="0.01"
                value={formData.monto}
                onChange={handleChange}
              />
              {errors.monto && <div className="form-error">{errors.monto}</div>}
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
                <option value="ingreso">Ingreso</option>
              </select>
            </div>

            <div>
              <label htmlFor="antelacion" className="form-label">Anticipación:</label>
              <select
                id="antelacion"
                name="antelacion"
                className="form-control"
                value={formData.antelacion}
                onChange={handleChange}
              >
                <option value="1d">1 día antes</option>
                <option value="1w">1 semana antes</option>
              </select>
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

            <button type="submit" className="btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
