import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const PrivateRoute = ({ element }) => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const authToken = store.authToken || localStorage.getItem('authToken');
    const [loading, setLoading] = useState(true);  // Nuevo estado para gestionar la carga de datos del usuario

    useEffect(() => {
        let isMounted = true;

        if (authToken && !store.user) {
            console.log("User not found in store, fetching user data...");
            actions.getUsuario()
                .then((response) => {
                    console.log("User data fetched:", response);
                    if (isMounted) {
                        setLoading(false);
                        if (response.ok) {
                            actions.setStore({ user: response.data });  // Asegura que store.user se actualiza correctamente
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    if (isMounted) setLoading(false);
                });
        } else {
            setLoading(false);  // Si ya tenemos el usuario o no hay authToken, dejamos de cargar
        }

        return () => {
            isMounted = false;
        };
    }, [authToken, store.user, actions]);

    if (loading) {
        return <div>Cargando usuario...</div>;  // Mostrar un mensaje de carga mientras se obtienen los datos del usuario
    }

    if (authToken && store.user) {
        return element;
    }

    return <Navigate to="/inicioSesion" state={{ from: location }} />;
};

export default PrivateRoute;
