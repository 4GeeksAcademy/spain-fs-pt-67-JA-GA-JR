import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

const PerfilUsuario = () => {
    const [error, setError] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.user && store.authToken) {
            actions.getUsuario().then(result => {
                if (!result.ok) {
                    setError('Error al obtener los datos del usuario');
                }
            });
        }
    }, [store.user, store.authToken, actions]);

    const handleModificarDatos = () => {
        navigate('/modificarPerfilUsuario');
    };

    const handleVolverInicio = () => {
        navigate('/home');
    };

    return (
        <div className="perfil-usuario">
            {error && <p className="text-danger">{error}</p>}
            {store.user ? (
                <div className="perfil-detalles">
                    <img
                        src={store.user.foto_perfil_url || 'https://via.placeholder.com/200'}
                        alt="Imagen de perfil"
                        className="perfil-imagen"
                    />
                    <h2>{store.user.nombre}</h2>
                    <p>Email: {store.user.email}</p>
                    <p>Teléfono: {store.user.telefono}</p>
                    <button className="perfil-boton" onClick={handleModificarDatos}>
                        Modificar mis datos
                    </button>
                    <button className="perfil-boton" onClick={handleVolverInicio}>
                        Volver a Inicio
                    </button>
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
    );
};

export default PerfilUsuario;
