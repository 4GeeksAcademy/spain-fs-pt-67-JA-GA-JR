import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.user) {
            setFormData({
                nombre: store.user.nombre,
                email: store.user.email,
                telefono: store.user.telefono,
                foto_perfil: null
            });
        } else {
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
        }
    }, [store.user, actions]);

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
    
        if (!formData.nombre || !formData.email || !formData.telefono) {
            setError('Por favor, completa todos los campos.');
            return;
        }
    
        setLoading(true);
        setError('');
        const userId = store.user ? store.user.id : null;
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telefono', formData.telefono);
        if (formData.foto_perfil) {
            formDataToSend.append('foto_perfil', formData.foto_perfil);
        }
    
        const response = await actions.updateUsuario(userId, formDataToSend);
        setLoading(false);
    
        if (response.ok) {
            setMessage('Datos actualizados correctamente');
            // Jorge -> aquí forzamos el refresh de perfilUsuario.js para que muestre ya los cambios actualizados.
            actions.setStore({ user: response.data });
            navigate('/perfilUsuario', { replace: true });
        } else {
            setError(response.error || 'Error al actualizar los datos');
        }
    };
    

    return (
        <div className="modificar-perfil-usuario">
            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Foto de Perfil</label>
                    <input
                        type="file"
                        name="foto_perfil"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
};

export default ModificarPerfilUsuario;
