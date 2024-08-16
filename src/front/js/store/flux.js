const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            user: null,
            authToken: null,
            demo: [
                {
                    nombre: "judit",
                    telefono: 123456789,
                    email: "judit@gmail.com",
                    password: 12345
                }
            ],
            goals: []  // Aquí almacenaremos los objetivos
        },
        actions: {
            setStore: (updatedStore) => {
                console.log("setStore: updatedStore:", updatedStore);
                setStore({
                    ...getStore(),
                    ...updatedStore
                });
            },

            setAuthToken: (token) => {
                setStore({ authToken: token });
                console.log("setAuthToken: authToken establecido en el store:", token);
            },

            // Función para obtener los objetivos desde el backend
            getGoals: async () => {
                console.log("getGoals: Ejecutando función getGoals");
                try {
                    const authToken = getStore().authToken || localStorage.getItem('authToken');
                    console.log("getGoals: authToken:", authToken);
                    if (!authToken) {
                        throw new Error("Token de autenticación no encontrado");
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/objetivo`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });

                    console.log("getGoals: Estado de la respuesta:", response.status);

                    if (!response.ok) {
                        throw new Error('Error al obtener los objetivos');
                    }

                    const data = await response.json();
                    console.log("getGoals: Objetivos obtenidos:", data.data);
                    setStore({ goals: data.data || [] });
                } catch (error) {
                    console.error('Error al obtener los objetivos:', error);
                }
            },

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
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Error al crear el usuario:", error);
                }
            },

            login: async (email, password, setError) => {
                try {
                    if (!email || !password) {
                        setError('Por favor, ingresa tu correo electrónico y contraseña.');
                        return false;
                    }

                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('password', password);

                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        body: formData
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
                    setStore({ user: data.user, authToken: token });
                    return true;

                } catch (error) {
                    setError(error.message);
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem('authToken');
                setStore({ user: null, authToken: null });
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
                    return responseBody;
                } catch (error) {
                    console.error("Error al crear el movimiento:", error);
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
                    console.error("Error al obtener los movimientos:", error);
                    return [];
                }
            },

            postGoal: async (newGoal) => {
                try {
                    const authToken = localStorage.getItem('authToken');

                    if (!authToken) {
                        throw new Error('Token de autenticación no encontrado.');
                    }

                    const response = await fetch(process.env.BACKEND_URL + "/api/objetivo", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(newGoal)
                    });

                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(`Error al crear el objetivo: ${response.statusText}. ${errorData}`);
                    };

                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Error al crear el objetivo:", error);
                    throw error;
                }
            },

            getMessage: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await response.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.error("Error al obtener el mensaje:", error);
                }
            },

            getUsuario: async () => {
                try {
                    const store = getStore();
                    const authToken = store.authToken || localStorage.getItem('authToken');

                    if (!store.user && authToken) {
                        const response = await fetch(process.env.BACKEND_URL + "/api/usuario", {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${authToken}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Error al obtener los datos del usuario');
                        }

                        const data = await response.json();
                        setStore({ user: data.data }); // Jorge -> Almacenamos los datos del usuario en el store
                        return { ok: true, data: data.data };
                    }

                    return { ok: true, data: store.user };
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                    return { ok: false, data: null };
                }
            },

            updateUsuario: async (userId, formData) => {
                try {
                    const authToken = localStorage.getItem('authToken');
                    const response = await fetch(process.env.BACKEND_URL + `/api/usuarios/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Error al actualizar los datos del usuario');
                    }

                    const data = await response.json();
                    return { ok: true, data };
                } catch (error) {
                    console.error('Error al actualizar el usuario:', error);
                    return { ok: false, data: null };
                }
            },
        }
    };
};

export default getState;
