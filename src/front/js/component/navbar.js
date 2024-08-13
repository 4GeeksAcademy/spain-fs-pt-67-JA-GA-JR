import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/inicioSesion");
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/home">
                    <span className="navbar-brand mb-0 h1">KuentasKlaras</span>
                </Link>
                <div className="ml-auto d-flex align-items-center">
                    {/* Jorge -> Menú desplegable para perfil de usuario */}
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Mi Perfil
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<li><Link className="dropdown-item" to="/perfilUsuario">Ver Perfil</Link></li>
                            {/*Jorge -> Aquí podemos añadir más opciones luego*/}
                        </ul>
                    </div>

                    {/* Jorge -> Botón de cerrar sesión */}
                    <button className="btn btn-danger ml-3" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};
