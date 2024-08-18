import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="container-fluid">
            <div className="row p-3 bg-dark">
                <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-primary me-2" onClick={() => navigate("/RegistroUsuarios")}>
                        Registro
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/inicioSesion")}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>
            <div className="row justify-content-center m-0">
                <div className="col-12 text-center">
                    <h1>Te damos la bienvenida a Kuentas Klaras</h1>
                    <h3>Somos una herramienta fácil y gratuita, para ayudarte a monitorizar tus ingresos y gastos.</h3>
                    <p>Con nuestras funcionalidades, podrás llevar un registro de forma sencilla y otras cosas como planificar ingresos, crear alertas programadas, fijar objetivos de ahorro y planificar eventos específicos, todo personalizado a tu gusto.</p>
                </div>
            </div>
            <div className="row w-100 p-1">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Movimientos</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Alertas Programadas</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Objetivos de Ahorro</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Eventos Personalizados</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
