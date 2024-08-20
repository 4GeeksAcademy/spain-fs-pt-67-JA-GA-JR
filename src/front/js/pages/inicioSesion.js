import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";


export const InicioSesion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [isChecked, setIsChecked] = useState(false); // Nueva variable de estado para la casilla de verificación
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);  // Añadido store para acceder al authToken
    const location = useLocation();

    useEffect(() => {
        if (store.authToken || localStorage.getItem('authToken')) {
            navigate('/home');
        }
    }, [ ]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked); // Actualizar el estado cuando se marque/desmarque la casilla
    };

    const validate = () => {
        const errors = {};
        if (!email) errors.email = "El email no es correcto";
        if (!password) errors.password = "La contraseña no es correcta";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }
        if (!isChecked) {
            setError({ general: "Debe aceptar las políticas de privacidad antes de iniciar sesión." });
            return;
        }
        try {
            const success = await actions.login(email, password, setError);
            if (success) {
                const from = location.state?.from?.pathname || '/home';
                navigate(from);
            }
        } catch (error) {
            setError({ general: "Error al iniciar sesión. Inténtalo de nuevo más tarde." });
        }
    };

    const handleRegisterClick = () => {
        navigate('/RegistroUsuarios');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Inicio de Sesión</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                    {error.email && <div className="text-danger">{error.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                    {error.password && <div className="text-danger">{error.password}</div>}
                                </div>
                                <i class="fa-solid fa-arrow-down fa-bounce fa-xl"></i>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="privacyPolicy"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="privacyPolicy" className="form-check-label">
                                        He leído y acepto las{" "}
                                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                            Políticas de Privacidad
                                        </a>.
                                    </label>
                                </div>
                                {error.general && <div className="text-danger">{error.general}</div>}
                                <button type="submit" className="btn btn-primary btn-block w-100" disabled={!isChecked}>
                                    Iniciar sesión
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <button onClick={handleRegisterClick} className="btn btn-primary btn-block w-100" disabled={!isChecked}>
                                    Me quiero registrar
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <a href="/forgot-password">¡Olvidé mi contraseña!</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

