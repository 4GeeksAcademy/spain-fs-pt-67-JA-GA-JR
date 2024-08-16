import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Context } from "../store/appContext";

import "../../styles/home.css";
import { jsx } from "react/jsx-runtime";
export const Registro = () => {

  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      const [errors, setErrors] = useState({}); 
      const {actions} = useContext(Context)

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
            const result = await actions.createUser(formData);
            navigate('/home');
        } catch(error){
          throw new Error("Error al crear el usuario");
        }
      };

      // Manejar la navegación a la página de inicio de sesión
      const handleBackToLogin = () => {
        navigate('/inicioSesion');
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
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Ingrese su nombre"
                                        title="Ingrese su nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        placeholder="Ingrese su teléfono"
                                        title="Ingrese su teléfono"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        autoComplete="phone"
                                    />
                                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Ingrese su correo electrónico"
                                        title="Ingrese su correo electrónico"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Ingrese su contraseña"
                                        title="Ingrese su contraseña"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Confirme su contraseña"
                                        title="Confirme su contraseña"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />
                                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-success btn-block w-50 me-1">Registrar</button>
                                    <button type="button" className="btn btn-warning btn-block w-50 ms-1" onClick={handleBackToLogin}>Volver a inicio sesión</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
