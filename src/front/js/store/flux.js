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
			]
		},
		actions: {
			createUser: async (formData) => {
				try {
					console.log(formData)
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
						alert('El usuario ha sido creado correctamente');
					}

					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error al crear usuario", error);
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
					console.log('Datos de la respuesta:', data);
					const token = data.access_token;
					if (!token) {
						throw new Error('Token no recibido en la respuesta de inicio de sesión');
					}

					localStorage.setItem('authToken', token);
					setStore({ user: data.user, authToken: token });  // judit actualiza el estado del usuario
					return true;



				} catch (error) {
					console.error("Error al iniciar sesión", error);
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
					const responseBody = await response.json();

					if (!response.ok) {
						throw new Error(`El movimiento no ha sido creado correctamente: ${responseBody.msg || response.statusText}`);
					}
					if (response.ok) {
						alert('El movimiento ha sido creado correctamente');
					}

					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error al crear el movimiento", error);
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
					return data;
				} catch (error) {
					console.error('Error al obtener los movimientos:', error);
					return Array.isArray(data) ? data : [];
					throw error;
				}
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.error("Error loading message from backend", error);
				}
			}
		}
	};
};

export default getState;
