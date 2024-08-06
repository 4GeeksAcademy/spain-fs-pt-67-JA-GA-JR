import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta sea correcta

const PrivateRoute = ({ element }) => {
    const { store } = useContext(Context);
    const location = useLocation();
    const isAuthenticated = !!store.authToken;

    if (isAuthenticated) {
        return element;
    } else {
        // judit Almacena la ruta actual en el estado para redirigir después de iniciar sesión
        return <Navigate to="/inicioSesion" state={{ from: location }} />;
    }
};

export default PrivateRoute;
