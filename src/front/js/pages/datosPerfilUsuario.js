import React, { useState } from 'react';

import "../../styles/datosPerfilUsuario.css";

function Formulario() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [telefonoMovil, setTelefonoMovil] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verificarContrasena, setVerificarContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contrasena !== verificarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    alert('Datos actualizados correctamente');
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Imagen de Perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenPerfil(e.target.files[0])}
        />
      </div>
      <div className="form-group">
        <label>Teléfono Móvil</label>
        <input
          type="tel"
          value={telefonoMovil}
          onChange={(e) => setTelefonoMovil(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Nueva Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Repetir Nueva Contraseña</label>
        <input
          type="password"
          value={verificarContrasena}
          onChange={(e) => setVerificarContrasena(e.target.value)}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Modificar Datos</button>
    </form>
  );
}

export default Formulario;
