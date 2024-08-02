import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IngresosGastos from './pages/IngresosGastos';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Importa PrivateRoute

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/movimientos"
                    element={<PrivateRoute component={IngresosGastos} />}
                />
                {/* Otras rutas */}
            </Routes>
        </Router>
    );
};

export default App;
