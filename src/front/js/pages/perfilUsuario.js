import React, { useState, useEffect } from 'react';
import "../../styles/perfilUsuario.css";

const PerfilUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const imagenDefecto = 'https://via.placeholder.com/150';

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/usuarios', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data.data);
      } else {
        console.error('Error fetching usuarios:', data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="perfil-usuario">
      {usuarios.length > 0 ? (
        usuarios.map((usuario, index) => (
          <div key={index} className="perfil-detalles">
            <img
              src={usuario.imagen || imagenDefecto}
              alt="Imagen de perfil"
              className="perfil-imagen"
            />
            <h2>{usuario.nombre}</h2>
            <p>Email: {usuario.email}</p>
            <p>Teléfono: {usuario.telefono}</p>
            <button className="perfil-boton">Modificar datos</button>
          </div>
        ))
      ) : (
        <p>Cargando usuarios...</p>
      )}
    </div>
  );
};

export default PerfilUsuario;
