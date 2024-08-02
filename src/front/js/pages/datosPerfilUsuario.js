import React, { useState } from 'react';
import "../../styles/datosPerfilUsuario.css";

function Formulario({ usuarioId }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [telefonoMovil, setTelefonoMovil] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verificarContrasena, setVerificarContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (contrasena !== verificarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombreCompleto);
    formData.append('telefono', telefonoMovil);
    formData.append('email', email);
    if (contrasena) formData.append('password', contrasena);
    if (imagenPerfil) formData.append('foto_perfil', imagenPerfil);

    setLoading(true);
    try {
      const response = await fetch(`/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert('Datos actualizados correctamente');
      } else {
        setError(data.msg || 'Error al actualizar los datos');
      }
    } catch (error) {
      setLoading(false);
      setError('Error al actualizar los datos');
      console.error('Error:', error);
    }
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
        />
      </div>
      <div className="form-group">
        <label>Repetir Nueva Contraseña</label>
        <input
          type="password"
          value={verificarContrasena}
          onChange={(e) => setVerificarContrasena(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? <p>Cargando...</p> : <button type="submit">Modificar Datos</button>}
    </form>
  );
}

export default Formulario;
