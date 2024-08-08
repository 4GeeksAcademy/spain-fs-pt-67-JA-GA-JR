import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/reset_password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.msg);
            navigate('/login'); // Jorge -> Redirigir al usuario a la página de inicio de sesión
        } else {
            setMessage(data.msg);
        }
    };

    return (
        <div>
            <h2>Restablecer contraseña</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nueva contraseña:
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Restablecer</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default NewPassword;
