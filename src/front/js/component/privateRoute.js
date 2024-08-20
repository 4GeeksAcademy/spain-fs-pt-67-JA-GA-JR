import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const PrivateRoute = ({ element }) => {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const authToken = store.authToken || localStorage.getItem('authToken');
    const [loading, setLoading] = useState(true);

    console.log('AuthToken:', authToken);
    console.log('Store User:', store.user);

    useEffect(() => {
        const fetchUser = async () => {
            if (authToken && !store.user) {
                try {
                    console.log("Fetching user data...");
                    const response = await actions.getUsuario();
                    if (response.ok && response.data) {
                        console.log("User data fetched successfully:", response.data);
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
        return element;  // Render the requested component if authenticated
    }
    console.log("Redirecting to /inicioSesion");
    return <Navigate to="/inicioSesion" state={{ from: location }} />;
};

export default PrivateRoute;
