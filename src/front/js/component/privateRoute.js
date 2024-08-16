import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const PrivateRoute = ({ element }) => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const authToken = store.authToken || localStorage.getItem('authToken');
    const [loading, setLoading] = useState(!store.user);  // Jorge -> estado inicial depende de si el usuario ya está en el store

    useEffect(() => {
        if (authToken && !store.user) {
            actions.getUsuario()
                .then((response) => {
                    if (response.ok && response.data) {
                        actions.setStore({ user: response.data });  // Jorge -> revisamos que store.user se actualiza correctamente, medida de seguridad por un flux bastante complicado durante etapa de desarrollo.
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                })
                .finally(() => setLoading(false));  // Jorge -> Aseguramos que el estado de carga se actualiza independientemente del resultado
        } else {
            setLoading(false);  // Jorge -> Si ya tenemos el usuario o no hay authToken, dejamos de cargar
        }
    }, [authToken, store.user, actions]);

    if (loading) {
        return <div>Cargando usuario...</div>;  // Jorge -> Mostrar un mensaje de carga mientras se obtienen los datos del usuario
    }

    if (authToken && store.user) {
        return element;
    }

    return <Navigate to="/inicioSesion" state={{ from: location }} />;
};

export default PrivateRoute;
