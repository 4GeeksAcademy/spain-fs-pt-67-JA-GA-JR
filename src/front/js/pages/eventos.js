import React, { useState, useContext } from 'react';
import '../../styles/eventos.css';
import { Context } from "../store/appContext";


export const Eventos = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'gastos',
    fecha_esperada: '',
    fecha_fin: '',
    tipo_recordatorio: 'push',
    tiempo_antelacion: '1d',
    monto: '',
    moneda: 'USD',
    estado_pago: 'pending',
    notas: ''
  });

  const [errors, setErrors] = useState({});
  const {actions} = useContext(Context)


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      formErrors.nombre = "El título es obligatorio.";
      isValid = false;
    }

    if (!formData.fecha_esperada) {
      formErrors.fecha_esperada = "La fecha de inicio es obligatoria.";
      isValid = false;
    }

    if (formData.monto <= 0) {
      formErrors.monto = "La cantidad debe ser mayor que 0.";
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
          nombre: formData.nombre,
          // Enviar solo el campo que el backend espera
        };
        
        // Enviar datos al endpoint de eventos
        await actions.postEvent(eventData);
  
        // Preparar datos para el endpoint de alertas
        const alertData = {
          // Aquí debes ajustar según lo que el backend espera. 
          // Basado en tu backend, este es solo un ejemplo
          tipo_recordatorio: formData.tipo_recordatorio,
          tiempo_antelacion: formData.tiempo_antelacion,
          nombre: formData.nombre, // Ajusta si el backend espera otros campos
          monto: formData.monto,
          // Ajusta según el backend para alertas
        };
        
        // Enviar datos al endpoint de alertas
        await actions.postAlert(alertData);
    
        // Limpiar el formulario después de un envío exitoso
        setFormData({
          nombre: '',
          categoria: 'gastos',
          fecha_esperada: '',
          fecha_fin: '',
          tipo_recordatorio: 'push',
          tiempo_antelacion: '1d',
          monto: '',
          moneda: 'USD',
          estado_pago: 'pending',
          notas: ''
        });
        
        alert('Formulario enviado correctamente!');
      } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el formulario.');
      }
    }
  };
  

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-card-body">
          <h2 className="form-heading">Formulario de Eventos y recordatorio de pagos</h2>
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
              <label htmlFor="categoria" className="form-label">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                className="form-control"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="gastos">Gastos</option>
                <option value="ingreso">Ingreso</option>
              </select>
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
              <label htmlFor="fecha_fin" className="form-label">Fecha de Fin:</label>
              <input
                type="date"
                id="fecha_fin"
                name="fecha_fin"
                className="form-control"
                value={formData.fecha_fin}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="tipo_recordatorio" className="form-label">Tipo de Recordatorio:</label>
              <select
                id="tipo_recordatorio"
                name="tipo_recordatorio"
                className="form-control"
                value={formData.tipo_recordatorio}
                onChange={handleChange}
              >
                <option value="push">Notificación push</option>
                <option value="email">Correo electrónico</option>
                <option value="sms">Mensaje de texto</option>
                <option value="all">Todas</option>
              </select>
            </div>

            <div>
              <label htmlFor="tiempo_antelacion" className="form-label">Anticipación:</label>
              <select
                id="tiempo_antelacion"
                name="tiempo_antelacion"
                className="form-control"
                value={formData.tiempo_antelacion}
                onChange={handleChange}
              >
                <option value="1d">1 día antes</option>
                <option value="1w">1 semana antes</option>
              </select>
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
              <label htmlFor="moneda" className="form-label">Moneda:</label>
              <select
                id="moneda"
                name="moneda"
                className="form-control"
                value={formData.moneda}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label htmlFor="estado_pago" className="form-label">Estado del Pago:</label>
              <select
                id="estado_pago"
                name="estado_pago"
                className="form-control"
                value={formData.estado_pago}
                onChange={handleChange}
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Realizado</option>
              </select>
            </div>

            <div>
              <label htmlFor="notas" className="form-label">Notas:</label>
              <textarea
                id="notas"
                name="notas"
                className="form-control"
                value={formData.notas}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
