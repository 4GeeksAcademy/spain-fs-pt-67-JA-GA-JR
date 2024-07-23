
import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.

export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign({}, state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
			/**
			 * EDIT THIS!
			 * Esta función es el equivalente a "window.onLoad", solo se ejecuta una vez en la vida útil de la aplicación.
			 * Debes hacer tus solicitudes ajax o fetch aquí. No uses setState() para guardar datos en el
			 * store, en su lugar usa acciones, como esta:
			 **/
			state.actions.getMessage(); // <---- llamando a esta función desde las acciones en flux.js
		}, []);

		// El valor inicial para el contexto ya no es null, sino el estado actual de este componente,
		// el contexto ahora tendrá las funciones getStore, getActions y setStore disponibles, porque fueron declaradas
		// en el estado de este componente.
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export const createUser = async (formData) => {
    try {
        const response = await fetch('https://symmetrical-capybara-wrvrpg6wg96vc5wxw-3001.app.github.dev/', {
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
        console.log(error);
    }
};




export default injectContext;
