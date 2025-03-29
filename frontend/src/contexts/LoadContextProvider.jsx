import { createContext, useContext, useState } from "react";
// Create context
const LoadContext = createContext({
	loading: null,
	setLoading: () => {},
});
// Create context provider
export const LoadContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	return (
		<LoadContext.Provider
			value={{
				loading,
				setLoading,
			}}
		>
			{children}
		</LoadContext.Provider>
	);
};
// Wrap everything for easy call up
export const useLoadContext = () => useContext(LoadContext);
