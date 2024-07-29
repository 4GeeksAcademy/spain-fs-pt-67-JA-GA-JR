import React from 'react';

import "../../styles/perfilUsuario.css";

const PerfilUsuario = () => {
  const imagenDefecto = 'https://via.placeholder.com/150';

  return (
    <div className="perfil-usuario">
      <img
        src={"" || imagenDefecto}
        alt="Imagen de perfil"
        className="perfil-imagen"
      />
      <div className="perfil-detalles">
        <h2></h2>
        <p>Email: </p>
        <p>Teléfono: </p>
        <button className="perfil-boton">Modificar datos</button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
