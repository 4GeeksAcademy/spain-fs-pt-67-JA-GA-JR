const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
			{
				nombre : "judit",
				telefono: 123456789,
				email: "judit@gmail.com", 
				password : 12345
			}

			]
		},
		actions: {
			// judit accion para crear usuario
			createUser: async formData => {
				try {
					const user = await createUser(formData);
					return user;
				} catch (error) {
					console.error("Error creating user:", error);
				}
			},
			
			
			getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
				
			}
		}
	};

export default getState;
