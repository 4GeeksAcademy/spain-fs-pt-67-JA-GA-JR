const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
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
						throw new Error('El usuario ha sido creado correctamente');
					}
			
					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error al crear usuario", error);
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
