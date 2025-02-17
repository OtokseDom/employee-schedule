import { createContext, useContext, useEffect, useState } from "react";
// Create context
const ScrollContext = createContext({
	scrolled: false,
	setScrolled: () => {},
});
// Create context provider
export const ScrollContextProvider = ({ children }) => {
	const [scrolled, setScrolled] = useState({});
	useEffect(() => {
		const onScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return (
		<ScrollContext.Provider
			value={{
				scrolled,
				setScrolled,
			}}
		>
			{/* {children} */}
			{children}
		</ScrollContext.Provider>
	);
};
// Wrap everything for easy call up
export const useScrollContext = () => useContext(ScrollContext);
