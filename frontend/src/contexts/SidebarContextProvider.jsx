import { createContext, useContext, useState } from "react";
// Create context
const SidebarContext = createContext({
	expanded: null,
	setExpanded: () => {},
});
// Create context provider
export const SidebarContextProvider = ({ children }) => {
	const [expanded, setExpanded] = useState(() => {
		const savedMode = sessionStorage.getItem("expanded");
		return savedMode ? JSON.parse(savedMode) : false; // Default to false if nothing is saved
	});

	return (
		<SidebarContext.Provider
			value={{
				expanded,
				setExpanded,
			}}
		>
			{/* {children} */}
			{children}
		</SidebarContext.Provider>
	);
};
// Wrap everything for easy call up
export const useSidebarContext = () => useContext(SidebarContext);
