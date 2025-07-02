import { createContext, useContext, useState } from "react";

// Create context
const LoadContext = createContext({
	loading: false,
	setLoading: () => {},
});

// Create context provider
export const LoadContextProvider = ({ children }) => {
	const [loadingCount, setLoadingCount] = useState(0);

	const loading = loadingCount > 0;

	const setLoading = (isLoading) => {
		setLoadingCount((prev) => (isLoading ? prev + 1 : Math.max(prev - 1, 0)));
	};

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

// Hook for easy access
export const useLoadContext = () => useContext(LoadContext);
