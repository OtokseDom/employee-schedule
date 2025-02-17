import { createContext, useContext, useState } from "react";
// Create context
const AuthContext = createContext({
	user: null,
	token: null,
	setUser: () => {},
	setToken: () => {},
});
// Create context provider
export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

	const setToken = (token) => {
		_setToken(token);
		if (token) {
			localStorage.setItem("ACCESS_TOKEN", token);
		} else {
			localStorage.removeItem("ACCESS_TOKEN");
		}
	};
	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				setUser,
				setToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
// Wrap everything for easy call up
export const useAuthContext = () => useContext(AuthContext);
