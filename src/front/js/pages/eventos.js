import React, { useState, useContext } from 'react';
import '../../styles/eventos.css';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom'; 


export const Eventos = () => {
  const [formData, setFormData] = useState({
    nombre: '',

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



    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
       
        const eventData = {
          nombre: formData.nombre
        };

        
          



        const eventResponse = await actions.postEvent(eventData);
        console.log('Tipo de eventResponse:', typeof eventResponse);
        console.log('eventResponse:', eventResponse);
        navigate('/homeEventos'); 

        if (!eventResponse.ok) {
         
          const errorData = await eventResponse.json();
          throw new Error(`Error ${eventResponse.status}: ${errorData.message || 'Error desconocido'}`);
        }

        // judit si todo esta bien, parsea la respuesta JSON
        const jsonResponse = await eventResponse.json();
        console.log('Respuesta JSON:', jsonResponse);

        
        setFormData({
          nombre: '',

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
          <h2 className="form-heading">Crear un nuevo Eventos</h2>
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


            <button type="submit" className="btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
