import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { Context } from "../store/appContext";

const ModificarPerfilUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        foto_perfil: null
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    useEffect(() => {
        const fetchUsuario = async () => {
            const response = await actions.getUsuario();
            if (response.ok) {
                setFormData({
                    nombre: response.data.nombre,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    foto_perfil: null
                });
            } else {
                setError('Error al obtener los datos del usuario');
            }
        };

        fetchUsuario();
    }, [actions]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            foto_perfil: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = formData.id;
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telefono', formData.telefono);
        if (formData.foto_perfil) {
            formDataToSend.append('foto_perfil', formData.foto_perfil);
        }

        const response = await actions.updateUsuario(userId, formDataToSend);
        if (response.ok) {
            setMessage('Datos actualizados correctamente');
            navigate('/perfilUsuario');
        } else {
            setError('Error al actualizar los datos');
        }
    };

    return (
        <div className="modificar-perfil-usuario">
            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div>
                    <label>Foto de Perfil</label>
                    <input type="file" name="foto_perfil" onChange={handleFileChange} />
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default ModificarPerfilUsuario;
