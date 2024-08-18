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
                        Nuevo usuario
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/inicioSesion")}>
                        Iniciar sesión
                    </button>
                </div>
            </div>
            <div className="row justify-content-center m-0">
                <div className="col-12 text-center">
                    <h1>Te damos la bienvenida a KuentasKlaras®</h1>
                    <br></br>
                    <h3>Somos una herramienta fácil y gratuita, para ayudarte a monitorizar tus ingresos y gastos.</h3>
                    <br></br>
                    <p>Con nuestras funcionalidades, podrás llevar un registro de forma sencilla y otras cosas como planificar ingresos, crear alertas programadas, fijar objetivos de ahorro y planificar eventos específicos, todo personalizado a tu gusto.</p>
                </div>
            </div>
            <div className="row w-100 p-1">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Movimientos</h5>
                            <p>Visualiza de manera fácil todos los ingresos y gastos que vayas registrando en tu día a día.</p> 
                            <br></br>
                            <p>En la parte baja de la herramienta, verás el balance general según el cálculo automático de toda la info que vayas ingresando.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Alertas Programadas</h5>
                            <p>¿Tienes un gasto fijo cada mes que siempre te pilla por sorpresa?</p>
                            <br></br>
                            <p>Con nuestra alerta programada puedes fijar un recordatorio y te enviaremos una notificación.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Objetivos de Ahorro</h5>
                            <p>Te ayudamos a fijar un objetivo de ahorro.</p>
                            <br></br>
                            <p>Solo necesitas insertar el monto mensual que puedes pagar, o una fecha límite, y te calculamos lo necesario para que llegues a la meta.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Eventos Personalizados</h5>
                            <p>¿Estás planificando un viaje o un evento que luego compartirás con más personas?</p>
                            <br></br>
                            <p>Pues dentro de KuentasKlaras® podrás crear <strong>eventos</strong> para asociarlos luego con tus ingresos o gastos con solo un click.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
