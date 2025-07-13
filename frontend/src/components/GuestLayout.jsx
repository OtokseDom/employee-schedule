import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import { MoonStar, Sun } from "lucide-react";

export default function GuestLayout() {
	const { token, user } = useAuthContext();
	const [theme, setTheme] = useState(() => {
		const savedMode = sessionStorage.getItem("theme");
		return savedMode ? JSON.parse(savedMode) : "dark"; // Default to false if nothing is saved
	});
	// Darkmode set session
	useEffect(() => {
		sessionStorage.setItem("theme", JSON.stringify(theme));
		if (theme == "dark") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
		}
	}, [theme]);

	const toggleDark = () => {
		if (theme == "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};
	// debugger;
	if (token) {
		return <Navigate to="/" />;
	}
	return (
		<div>
			<button
				type="button"
				className="md:fixed z-10 flex justify-center items-center bg-foreground text-background m-5 p-2 rounded-full"
				onClick={toggleDark}
			>
				{theme == "light" ? <MoonStar /> : <Sun />}
			</button>
			<Outlet />
		</div>
	);
}
