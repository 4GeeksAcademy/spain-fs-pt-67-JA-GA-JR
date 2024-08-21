
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
			const token = localStorage.getItem('authToken'); // Jorge -> intento de solución de carga de Objetivos.
			if (token) {
				state.actions.setAuthToken(token);
			} else {
			}

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

export default injectContext;
