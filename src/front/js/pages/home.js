import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
export const Home = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
          // Manejar cambios en los campos del formulario
          const handleChange = (e) => {
            const { id, value } = e.target;
            setFormData((prevData) => ({
              ...prevData,
              [id]: value
            }));
          };


		    // Manejar el envío del formulario
			const handleSubmit = (e) => {
				e.preventDefault();
				
				// Validar que las contraseñas coincidan
				if (formData.password !== formData.confirmPassword) {
					alert("Las contraseñas no coinciden.");
					return;
				}
		
				// Aquí puedes hacer la solicitud a la API o cualquier otra acción necesaria
				console.log("Datos del formulario:", formData);
			};
    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Registro de Usuario</h2>
                <form onSubmit = {handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" id="phone" value={formData.phone}
                    onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email"  value={formData.email}
                    onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" value={formData.password}
                    onChange={handleChange}/>
                  </div>
                  <div className="mb-3">
                  <label htmlFor="exampleInputConfirmPassword1" className="form-label">Confirmar Contraseña</label>
                  <input type="password" className="form-control" id="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange}/>
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