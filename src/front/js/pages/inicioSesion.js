import React, {useState} from "react" 

export const InicioSesion = () => {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');



const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el inicio de sesión');
      }

     
      const result = await response.json();
      console.log('Inicio de sesión exitoso:', result);
      // localStorage.setItem('token', result.token); // Guarda el token si es necesario
      // window.location.href = '/dashboard'; // Redirige a una página protegida

    } catch (error) {
      // Manejo de errores generales
      alert(error.message);
    }
  };
    
    return (
        <div className="container mt-5">
      <div className="row justify-content-center">
          <div className="col-md-6">
              <div className="card">
                  <div className="card-body">
                      <h2 className="text-center">Registro de Usuario</h2>
                      <form >
                    {/* //   onSubmit={}> */}
                        
                          <div className="mb-3">
                              <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                              <input type="email" className="form-control" id="email" />
                            </div>
                          
                          <div className="mb-3">
                              <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                              <input type="password" className="form-control" id="password"/></div>
                        
                         
                          <button type="submit" className="btn btn-primary btn-block">Iniciar Sesion</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
);
}