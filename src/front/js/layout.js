import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import { HomeObjetivos } from "./pages/homeObjetivos";
// Jorge -> Este es un componente interno que manejará ScrollToTop y la ubicación
const LayoutWithScroll = () => {
    const location = useLocation();
    // Jorge ->  Listado de rutas en las que NO queremos mostrar el Navbar
    const noNavbarRoutes = ["/inicioSesion", "/RegistroUsuarios", "/forgot-password"];
    // Jorge -> Determinar si la ruta actual está en la lista
    const showNavbar = !noNavbarRoutes.includes(location.pathname);
    return (
        <ScrollToTop location={location}>
            {showNavbar && <Navbar />}
            <Routes>
                <Route element={<Home />} path="/home" />
                <Route element={<Registro />} path="/RegistroUsuarios" />
                <Route path="/perfilUsuario" element={<PrivateRoute element={<PerfilUsuario />} />} />
                <Route path="/modificarPerfilUsuario" element={<PrivateRoute element={<ModificarPerfilUsuario />} />} />
                <Route element={<InicioSesion />} path="/inicioSesion" />
                <Route path="/movimientos" element={<PrivateRoute element={<IngresosGastos />} />} />
                <Route path="/homeMovimientos" element={<PrivateRoute element={<HomeMovimientos />} />} />
                <Route element={<ForgotPassword />} path="/forgot-password" />
                <Route path="/objetivos" element={<PrivateRoute element={<Objetivos />} />} />
                <Route path="/homeObjetivos" element={<PrivateRoute element={<HomeObjetivos />} />} />
                <Route element={<h1>Not found!</h1>} />
            </Routes>
            <Footer />
        </ScrollToTop>
    );
};
const Layout = () => {
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;
    return (
        <div>
            <BrowserRouter basename={basename}>
                <LayoutWithScroll />
            </BrowserRouter>
        </div>
    );
};
export default injectContext(Layout);