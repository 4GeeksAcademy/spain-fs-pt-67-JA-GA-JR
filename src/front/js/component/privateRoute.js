import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const PrivateRoute = ({ element }) => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const authToken = store.authToken || localStorage.getItem('authToken');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (authToken && !store.user) {
                try {

                    const response = await actions.getUsuario();
                    if (response.ok && response.data) {
                        actions.setStore({ user: response.data });
                    } else {
                        console.error("Failed to fetch user data:", response);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setLoading(false);
        };

        if (authToken) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Cargando usuario...</div>;
    }

    if (authToken) {
        return element;  // Judit -> Render the requested component if authenticated
    }
    return <Navigate to="/inicioSesion" state={{ from: location }} />;
};

export default PrivateRoute;
