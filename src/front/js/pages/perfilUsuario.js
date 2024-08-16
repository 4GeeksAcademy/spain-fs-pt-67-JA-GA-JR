import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

const PerfilUsuario = () => {
    const [error, setError] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Jorge -> Efecto para verificar si el usuario está en el store o necesita ser cargado.
    useEffect(() => {
        if (!store.user && store.authToken) {
            actions.getUsuario().then(result => {
                if (!result.ok) {
                    setError('Error al obtener los datos del usuario'); // Jorge -> Manejo básico del error
                }
            });
        }
    }, [store.user, store.authToken, actions]);

    // Jorge -> Función para manejar la navegación a la página de modificación de perfil.
    const handleModificarDatos = () => {
        navigate('/modificarPerfilUsuario');
    };

    // Jorge -> Función para manejar la navegación de regreso a la página de inicio.
    const handleVolverInicio = () => {
        navigate('/home');
    };

    return (
        <div className="perfil-usuario">
            {error && <p className="text-danger">{error}</p>}  {/* Jorge -> Mostrar error si ocurre */}
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
                <p>Cargando datos del usuario...</p> // Jorge -> Indicador de carga mientras se obtienen los datos
            )}
        </div>
    );
};

export default PerfilUsuario;
