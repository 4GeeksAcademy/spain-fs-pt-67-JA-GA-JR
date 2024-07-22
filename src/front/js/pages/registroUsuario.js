import React, { startTransition, useContext, useState } from "react";

import "../../styles/home.css";
export const Registro = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      const [errors, setErrors] = useState({}); 


          // judit Manejar cambios en los campos del formulario
          const handleChange = (e) => {
            const { id, value } = e.target;
            setFormData((prevData) => ({
              ...prevData,
              [id]: value
            }));
          };



          const validate = () => {
            const newErrors = {};
            if (!formData.name) newErrors.name = "El nombre es obligatorio.";
            if (!formData.phone) newErrors.phone = "El teléfono es obligatorio.";
            if (!formData.email) newErrors.email = "El email es obligatorio.";
            if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
            if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
            return newErrors;
        };

		    //judit Manejar el envío del formulario
			const handleSubmit = async (e) => {
				e.preventDefault();
				
				

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

		
		try {
            const response = await fetch ('https://symmetrical-capybara-wrvrpg6wg96vc5wxw-3001.app.github.dev/', {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        name : formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        password: formData.password
                    })
            });
            if (!response.ok) {
                throw new Error ('Error en la solicitud' + response.statusText );
            }
            const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {

            const result = await response.json();

        if (result.msg === 'Registro exitoso'){
            alert ('Registro exitoso')
        }
        else {
            alert('Hubo un problema con el registro')
        }
        }else{
            const text = await response.text();
            alert ('Error:' + text);
        }
    }
        catch (error){
            console.error('Error al enviar los datos:', error);
            alert('Hubo un problema al enviar los datos');
        }
				console.log("Datos del formulario:", formData);
			};
    return (
      <div className="container mt-5">
      <div className="row justify-content-center">
          <div className="col-md-6">
              <div className="card">
                  <div className="card-body">
                      <h2 className="text-center">Registro de Usuario</h2>
                      <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                              <label className="form-label">Nombre</label>
                              <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
                              {errors.name && <div className="text-danger">{errors.name}</div>}
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Teléfono</label>
                              <input type="text" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
                              {errors.phone && <div className="text-danger">{errors.phone}</div>}
                          </div>
                          <div className="mb-3">
                              <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                              <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
                              {errors.email && <div className="text-danger">{errors.email}</div>}
                          </div>
                          <div className="mb-3">
                              <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                              <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} />
                              {errors.password && <div className="text-danger">{errors.password}</div>}
                          </div>
                          <div className="mb-3">
                              <label htmlFor="exampleInputConfirmPassword1" className="form-label">Confirmar Contraseña</label>
                              <input type="password" className="form-control" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                              {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                          </div>
                          <button type="submit" className="btn btn-primary btn-block">Registrar</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
);
};