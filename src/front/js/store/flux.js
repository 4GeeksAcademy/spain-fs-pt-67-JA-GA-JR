const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			user: null,
			demo: [
				{
					nombre: "judit",
					telefono: 123456789,
					email: "judit@gmail.com",
					password: 12345
				}
			],
			goals: []
		},
		actions: {
			createUser: async (formData) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/usuarios", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},

						body: JSON.stringify({
							name: formData.name,
							phone: formData.phone,
							email: formData.email,
							password: formData.password
						})
					});


					if (!response.ok) {
						throw new Error('El usuario no ha sido creado correctamente');
					}
					if (response.ok) {
					}

					const data = await response.json();
					return data;
				} catch (error) {
				}
			},


			login: async (email, password, setError) => {
				try {
					if (!email || !password) {
						setError('Por favor, ingresa tu correo electrónico y contraseña.');

					}
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},

						body: JSON.stringify({
							email: email,
							password: password
						})
					});


					if (!response.ok) {
						const errorData = await response.json();
						const errorMessage = errorData.message || 'Email o contraseña incorrectos';
						setError({ general: errorMessage });


						return false;

					}
					const data = await response.json();
					const token = data.access_token;
					if (!token) {
						throw new Error('Token no recibido en la respuesta de inicio de sesión');
					}

					localStorage.setItem('authToken', token);
					setStore({ user: data.user, authToken: token });  // judit actualiza el estado del usuario
					return true;



				} catch (error) {
					setError(error.message);
				}

			},

			logout: () => {
				localStorage.removeItem('authToken');
				setStore({ user: null, authToken: null });  //  Judit Limpia el estado del usuario
			},



			createTransaction: async (formData) => {
				try {
					const authToken = localStorage.getItem('authToken');


					if (!authToken) {
						throw new Error('Token de autenticación no encontrado.');
					}

					const response = await fetch(process.env.BACKEND_URL + "/api/movimientos", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${authToken}`
						},

						body: JSON.stringify(formData)
					});
					const responseBody = await response.json(); //judit esto y

					if (!response.ok) {
						throw new Error(`El movimiento no ha sido creado correctamente: ${responseBody.msg || response.statusText}`); // judit muy util para que me dijera el error concreto en la consola
					}
					if (response.ok) {
					}

					
					return responseBody;
				} catch (error) {
				}
			},

			getMovement: async () => {
				try {
					const authToken = localStorage.getItem('authToken');

					const response = await fetch(`${process.env.BACKEND_URL}/api/movimientos`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${authToken}`
						}
					});


					if (!response.ok) {
						throw new Error('Error al obtener todos tus movimientos');
					}

					const data = await response.json();
					return data.data || [];
				} catch (error) {
					return  [];
					
				}
			},

			
			postGoal: async (newGoal) => {
				try {

						const authToken = localStorage.getItem('authToken');
	
	
						if (!authToken) {
							throw new Error('Token de autenticación no encontrado.');
						}
	
						
                    const resp = await fetch(process.env.BACKEND_URL + "/api/objetivo", {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization': `Bearer ${authToken}`,
					  
					   
					},
					// mode: 'no-cors',

					body: JSON.stringify(newGoal),

				});
				console.log(localStorage.getItem('authToken'));

				if (!resp.ok) {
					const errorData = await resp.text();
					throw new Error(`Error al crear el objetivo: ${resp.statusText}. ${errorData}`);
				  };

                    const data = await resp.json();
                    return data;

                } catch (error) {
                    console.error("Error al crear el objetivo", error);
					throw error;
                }
			},



			getGoal: async () => {
				try {
					const authToken = localStorage.getItem('authToken');

					const response = await fetch(`${process.env.BACKEND_URL}/api/objetivo`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${authToken}`
						}
					});


					if (!response.ok) {
						throw new Error('Error al obtener todos tus objetivos');
					}

					const data = await response.json();
					setStore({ goals: data.data || [] });
                } catch (error) {
                    console.error('Error al obtener los objetivos:', error);
                    setStore({ goals: [] });
                }
            },



			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
				}
			}
		}
	};
};

export default getState;
