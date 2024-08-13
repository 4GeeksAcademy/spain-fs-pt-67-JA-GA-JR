import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Registro } from "./pages/registroUsuario";
import ModificarPerfilUsuario from "./pages/modificarPerfilUsuario";
import { InicioSesion } from "./pages/inicioSesion";
import PerfilUsuario from "./pages/perfilUsuario";
import { IngresosGastos } from "./pages/ingresosGastos"
import PrivateRoute from "./component/privateRoute";
import { HomeMovimientos } from "./pages/homeMovimientos";
import ForgotPassword from "./pages/ForgotPassword";
import { Objetivos } from "./pages/objetivos";
import { CardObjetivos } from "./pages/objetivosCard";
import { HomeObjetivos } from "./pages/homeObjetivos";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                    <Route element={<Home />} path="/home" />
                        <Route element={<Registro />} path="/RegistroUsuarios" />
                        <Route path="/perfilUsuario" element={<PrivateRoute element={<PerfilUsuario />} />} />
                        <Route path="/modificarPerfilUsuario" element={<PrivateRoute element={<ModificarPerfilUsuario />} />} />
                        <Route element={<InicioSesion />} path="/inicioSesion" />
                        <Route element={<CardObjetivos />} path="/objetivoscard" />
                        <Route path="/movimientos" element={<PrivateRoute element={<IngresosGastos />} />} />
                        <Route path="/homeMovimientos" element={<PrivateRoute element={<HomeMovimientos />} />} />
                        <Route element={<ForgotPassword />} path="/forgot-password" />
                        <Route path="/objetivos" element={<PrivateRoute element={<Objetivos />} />} />
                        <Route path="/objetivoshome" element={<HomeObjetivos />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
