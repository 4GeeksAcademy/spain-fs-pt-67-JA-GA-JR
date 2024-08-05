import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";


export const IngresosGastos = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        monto: '',
        tipo_movimiento: '',
        motivo: '',
        eventos_relacion: '',
        objetivo_relacion: '',
        fecha: '',
        usuarios_relacion: '',
    });

    const [error, setError] = useState({});
    const {actions} = useContext(Context)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.nombre) newErrors.nombre = "Debes de ponerle un nombre al movimiento.";
        if (!formData.monto) newErrors.monto = "Es necesario especificar una cantidad concreta.";
        if (!formData.tipo_movimiento) newErrors.tipo_movimiento = "Es obligatorio que declares el tipo de movimiento que vas a hacer.";
        // if (!formData.objetivo_relacion) newErrors.objetivo_relacion = "Debes de rellenar este campo con la razon del ingreso/ gasto.";
        if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";

        return newErrors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        console.log("Datos del formulario:", formData);

        const cleanedData = {  //judit copia los datos de formData a cleanData 
            ...formData,
            eventos_relacion: formData.eventos_relacion.trim() || null, //.trim limpia los espacios en blanco 
            objetivo_relacion: formData.objetivo_relacion.trim() || null, //judit al principio y al final de la cadena
        };                                  // judit si el resultado es cadena vacia  lo convierte a null

        try {
            const result = await actions.createTransaction(cleanedData); //judit llama a la funcion createTransaction
            console.log("movimiento creado", result);                   // judit con los datos limpios
            navigate('/homePerfil');
        }catch(error){
            console.log("error al crear el movimiento", error)
        }
		
		
        console.log('Formulario enviado', formData);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center">Registro de Ingresos y Gastos</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                    {error.nombre && <div className="text-danger">{error.nombre}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="monto" className="form-label">Monto</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="monto"
                                        value={formData.monto}
                                        onChange={handleChange}
                                    />
                                    {error.monto && <div className="text-danger">{error.monto}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tipo_movimiento" className="form-label">Tipo de Movimiento</label>
                                    <select
                                        className="form-control"
                                        id="tipo_movimiento"
                                        value={formData.tipo_movimiento}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="Ingreso">Ingreso</option>
                                        <option value="Gasto">Gasto</option>
                                    </select>
                                    {error.tipo_movimiento && <div className="text-danger">{error.tipo_movimiento}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="motivo" className="form-label">Motivo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="motivo"
                                        value={formData.motivo}
                                        onChange={handleChange}
                                    />
                                    {error.motivo && <div className="text-danger">{error.motivo}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eventos_relacion" className="form-label">Evento Relacionado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="eventos_relacion"
                                        value={formData.eventos_relacion}
                                        onChange={handleChange}
                                    />
                                    {error.eventos_relacion && <div className="text-danger">{error.eventos_relacion}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="objetivo_relacion" className="form-label">Objetivo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="objetivo_relacion"
                                        value={formData.objetivo_relacion}
                                        onChange={handleChange}
                                    />
                                    {/* {error.objetivo_relacion && <div className="text-danger">{error.objetivo_relacion}</div>} */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                    />
                                    {error.fecha && <div className="text-danger">{error.fecha}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="usuarios_relacion" className="form-label">Usuario Relacionado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usuarios_relacion"
                                        value={formData.usuarios_relacion}
                                        onChange={handleChange}
                                    />
                                    {error.usuarios_relacion && <div className="text-danger">{error.usuarios_relacion}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Registrar Movimiento
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
