import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError("Por favor, ingresa tu correo electrónico.");
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Por favor revisa tu correo, te hemos enviado un mensaje con lo necesario.");
                setTimeout(() => {
                    navigate('/inicioSesion');
                }, 5000); // Redirigir después de 3 segundos
            } else {
                setError("No se encontró una cuenta con ese correo electrónico.");
            }
        } catch (err) {
            setError("Ocurrió un error. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Restablecer Contraseña</h2>
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Enviar Correo de Restablecimiento
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <a href="/inicioSesion">Volver al inicio de sesión</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
